import { type FastifyInstance } from 'fastify'
import { OrderController } from '../controllers'

const order = OrderController.getInstance()

const router = async (app: FastifyInstance): Promise<void> => {
  app.get('/v1/order', order.get)
  app.post('/v1/order', order.post)

  // app.get('/v1/order/:id', order.getOne)
  // app.put('/v1/order/:id', order.put)
  // app.delete('/v1/order/:id', order.delete)
}

export default router
