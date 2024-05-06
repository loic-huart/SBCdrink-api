import { type FastifyInstance } from 'fastify'
import ingredientRoutes from './ingredient'
import orderRoutes from './order'
import RecipeRoutes from './recipe'
import MachineRoutes from './machine'
import MachineConfigurationRoutes from './machineConfiguration'
import FileRoutes from './file'

const routes = async (app: FastifyInstance) => {
  await ingredientRoutes(app)
  await orderRoutes(app)
  await RecipeRoutes(app)
  await MachineRoutes(app)
  await MachineConfigurationRoutes(app)
  await FileRoutes(app)
}

export default routes
