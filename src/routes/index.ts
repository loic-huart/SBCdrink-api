import { type FastifyInstance } from 'fastify'
import ingredientRoutes from './ingredient'

const routes = async (app: FastifyInstance) => {
  await ingredientRoutes(app)
}

export default routes
