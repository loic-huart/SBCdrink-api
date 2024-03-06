import { OrderStatus, type IOrder } from './types'
import ErrorService from '../errors/errors'
import Order, { deSerializeOrder, serializeOrder, serializeOrders } from '../../models/Order'
import { Slug, type Error } from '../errors/types'
import { createPayloadValidation } from './validators'
import Recipe, { serializeRecipe } from '../../models/Recipe'
import { Ingredient } from '../../models'
import { serializeIngredient } from '../../models/Ingredient'
import { type IModelIngredient, type IModelRecipe } from '../../models/types'

interface IOrderService extends ErrorService {
  find: () => Promise<{ orders: IOrder[] }>
  create: (order: IOrder) => Promise<{ order: IOrder, error?: Error }>
}

class OrderService extends ErrorService implements IOrderService {
  private static instance: OrderService

  public static getInstance (): OrderService {
    if (OrderService.instance === undefined) {
      OrderService.instance = new OrderService()
    }

    return OrderService.instance
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
