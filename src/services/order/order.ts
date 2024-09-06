import { type IPayloadCreateOrder, OrderStatus, type IOrder } from './types'
import ErrorService from '../errors/errors'
import Order, { deSerializeOrder, serializeOrder, serializeOrders } from '../../models/Order'
import { Slug, type Error } from '../errors/types'
import { createPayloadValidation } from './validators'
import Recipe, { serializeRecipe } from '../../models/Recipe'
import { Ingredient, MachineConfiguration } from '../../models'
import { serializeIngredient } from '../../models/Ingredient'
import { type IModelOrder } from '../../models/types'
import MachineService from '../machine/machine'
import { mongoClient } from '../..'

interface IOrderService extends ErrorService {
  find: () => Promise<{ orders: IOrder[] }>
  create: (order: IPayloadCreateOrder) => Promise<{ order: IOrder, error?: Error }>
}

class OrderService extends ErrorService implements IOrderService {
  private static instance: OrderService

  private constructor () {
    super()
    this.watch()
  }

  public static getInstance (): OrderService {
    if (OrderService.instance === undefined) {
      OrderService.instance = new OrderService()
    }

    return OrderService.instance
  }

  public watch (): void {
    const collectionOrder = mongoClient.db().collection('order')
    const watchOrder = collectionOrder.watch()
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    watchOrder.on('change', async (change): Promise<void> => {
      switch (change.operationType) {
        case 'insert': {
          if (change.fullDocument == null) break

          const machineService = MachineService.getInstance()
          const order = serializeOrder(change.fullDocument as IModelOrder)

          if (order.status !== OrderStatus.CREATED) break

          await Order.update({ where: { id: order.id }, data: { status: OrderStatus.IN_PROGRESS } })
          console.info('Watch order', order.id, 'status updated to', OrderStatus.IN_PROGRESS)
          const res = await machineService.makeCocktail({ steps: order.steps })
          if (res.error != null) {
            await Order.update({ where: { id: order.id }, data: { status: OrderStatus.FAILED } })
            console.info('Watch order', order.id, 'status updated to', OrderStatus.FAILED, 'error:', res.error)
          } else {
            await Order.update({ where: { id: order.id }, data: { status: OrderStatus.DONE } })
            console.info('Watch order', order.id, 'status updated to', OrderStatus.DONE)
          }
          break
        }
        default:
          break
      }
    })
  }

  public async find (): Promise<{ orders: IOrder[] }> {
    const orders = await Order.findMany({
      include: {
        steps: true
      }
    })
    return {
      orders: serializeOrders(orders)
    }
  }

  public async create (order: IPayloadCreateOrder): Promise<{ order: IOrder, error?: Error }> {
    const orderInStatusCreated = await Order.findFirst({ where: { status: OrderStatus.CREATED } })
    if (orderInStatusCreated != null) {
      return {
        order: {} as IOrder,
        error: this.NewForbiddenError('There is already an order in status created', Slug.ErrOrderAlreadyInStatusCreated)
      }
    }

    const { error } = createPayloadValidation(order)
    if (error != null) {
      return {
        order: {} as IOrder,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }

    const recipe = await Recipe.findUnique({
      where: { id: order.recipe },
      include: {
        picture: true,
        steps: {
          include: {
            ingredient: true
          }
        }
      }
    })
    // }) as unknown as IModelRecipeFull
    if (recipe == null) {
      return {
        order: {} as IOrder,
        error: this.NewNotFoundError('Recipe not found', Slug.ErrRecipeNotFound)
      }
    }

    let ingredientError = null
    const steps = []
    for (const step of order.steps) {
      const ingredient = await Ingredient.findFirst({ where: { id: step.ingredient } })
      if (ingredient == null) {
        ingredientError = {
          order: {} as IOrder,
          error: this.NewNotFoundError('Ingredient not found', Slug.ErrIngredientNotFound)
        }
        break
      }

      const machineConfiguration = await MachineConfiguration.findFirst({ where: { ingredient_id: step.ingredient } })
      console.log('Machine configuration:', machineConfiguration)
      if (machineConfiguration == null) {
        ingredientError = {
          order: {} as IOrder,
          error: this.NewNotFoundError('Ingredient is not available', Slug.ErrIngredientIsNotAvailable)
        }
        break
      }

      steps.push({
        ...step,
        status: OrderStatus.CREATED,
        ingredient: serializeIngredient(ingredient)
      })
    }
    if (ingredientError != null) {
      return ingredientError
    }

    const populatedNewOrder: IOrder = {
      ...order,
      recipe: serializeRecipe(recipe, true, true),
      steps,
      progress: 0,
      status: OrderStatus.CREATED
    } as IOrder

    const deSerializedOrder = deSerializeOrder(populatedNewOrder)

    const newOrder = await Order.create({
      include: {
        steps: true
      },
      data: {
        ...deSerializedOrder,
        steps: {
          create: deSerializedOrder.steps
        }
      }
    })

    return {
      order: serializeOrder(newOrder)
    }
  }
}

export default OrderService
