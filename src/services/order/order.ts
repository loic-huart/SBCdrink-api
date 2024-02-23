import { type IOrder } from './types'
import ErrorService from '../errors/errors'
import Order, { deSerializeOrder, serializeOrders } from '../../models/Order'
import { Slug, type Error } from '../errors/types'
import { createPayloadValidation } from './validators'

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
    const { error } = createPayloadValidation(order)
    if (error != null) {
      return {
        order: {} as IOrder,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }

    // TODO: Recipe.findOne({ _id: order.recipe._id })

    // TOTO: Ingredient.find({ _id: { $in: order.steps.map(step => step.ingredient._id) } })

    const newOrder = new Order(deSerializeOrder(order))
    await newOrder.save()

    return {
      order
    }
  }
}

export default OrderService
