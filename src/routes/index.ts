import { type FastifyInstance } from 'fastify'
import ingredientRoutes from './ingredient'
import orderRoutes from './order'
import RecipeRoutes from './recipe'

const routes = async (app: FastifyInstance) => {
  await ingredientRoutes(app)
  await orderRoutes(app)
  await RecipeRoutes(app)
}

export default routes
