import { type FastifyReply, type FastifyRequest } from 'fastify'
import OrderService from '../services/order/order'
import mapErrorTypeToHttpCode from '../utils/mapErrorTypeToHttpCode'
import { type IPayloadCreateOrder } from '../services/order/types'

interface IOrderController {
  get: (req: FastifyRequest, res: FastifyReply) => Promise<void>
}

class OrderController implements IOrderController {
  private static instance: OrderController

  public static getInstance (): OrderController {
    if (OrderController.instance === undefined) {
      OrderController.instance = new OrderController()
    }

    return OrderController.instance
  }

  public async get (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const orderService = OrderService.getInstance()
      const { orders } = await orderService.find()
      await res.status(200).send(orders)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }

  public async post (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const orderService = OrderService.getInstance()
      const {
        order,
        error
      } = await orderService.create(req.body as IPayloadCreateOrder)
      if (error != null) {
        const httpCode = mapErrorTypeToHttpCode(error.errorType)
        await res.status(httpCode).send(error)
        return
      }
      await res.status(201).send(order)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }
}

export default OrderController
