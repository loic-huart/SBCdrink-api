import { OrderStatus, type IOrder } from './types'
import ErrorService from '../errors/errors'
import Order, { deSerializeOrder, serializeOrder, serializeOrders } from '../../models/Order'
import { Slug, type Error } from '../errors/types'
import { createPayloadValidation } from './validators'
import Recipe, { serializeRecipe } from '../../models/Recipe'
import { Ingredient, MachineConfiguration } from '../../models'
import { serializeIngredient } from '../../models/Ingredient'
import { type IModelOrder, type IModelIngredient, type IModelRecipe } from '../../models/types'
import MachineService from '../machine/machine'

interface IOrderService extends ErrorService {
  find: () => Promise<{ orders: IOrder[] }>
  create: (order: IOrder) => Promise<{ order: IOrder, error?: Error }>
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
    const watchOrder = Order.watch()
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    watchOrder.on('change', async (change): Promise<void> => {
      switch (change.operationType) {
        case 'insert': {
          if (change.fullDocument == null) break

          const machineService = MachineService.getInstance()
          const order = serializeOrder(change.fullDocument as IModelOrder)

          if (order.status !== OrderStatus.CREATED) break

          await Order.findByIdAndUpdate(order.id, { status: OrderStatus.IN_PROGRESS })
          console.info('Watch order', order.id, 'status updated to', OrderStatus.IN_PROGRESS)
          const res = await machineService.makeCocktail({ steps: order.steps })
          if (res.error != null) {
            await Order.findByIdAndUpdate(order.id, { status: OrderStatus.FAILED })
            console.info('Watch order', order.id, 'status updated to', OrderStatus.FAILED, 'error:', res.error)
          } else {
            await Order.findByIdAndUpdate(order.id, { status: OrderStatus.DONE })
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
    const orders = await Order.find()
    return {
      orders: serializeOrders(orders)
    }
  }

  public async create (order: IOrder): Promise<{ order: IOrder, error?: Error }> {
    const orderInStatusCreated = await Order.findOne({ status: OrderStatus.CREATED })
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

    const recipe = await Recipe.findById(order.recipe) as unknown as IModelRecipe
    if (recipe == null) {
      return {
        order: {} as IOrder,
        error: this.NewNotFoundError('Recipe not found', Slug.ErrRecipeNotFound)
      }
    }

    let ingredientError = null
    const steps = []
    for (const step of order.steps) {
      const ingredient = await Ingredient.findById(step.ingredient) as unknown as IModelIngredient
      if (ingredient == null) {
        ingredientError = {
          order: {} as IOrder,
          error: this.NewNotFoundError('Ingredient not found', Slug.ErrIngredientNotFound)
        }
        break
      }

      const machineConfiguration = await MachineConfiguration.findOne({ ingredient: step.ingredient })
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
        ingredient: serializeIngredient(ingredient)
      })
    }
    if (ingredientError != null) {
      return ingredientError
    }

    const populatedNewOrder = {
      ...order,
      recipe: serializeRecipe(recipe),
      steps
    }

    const newOrder = new Order(deSerializeOrder(populatedNewOrder))
    await newOrder.save()

    return {
      order: serializeOrder(newOrder)
    }
  }
}

export default OrderService
