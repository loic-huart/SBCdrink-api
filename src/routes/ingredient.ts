import { type FastifyInstance } from 'fastify'
import { IngredientController } from '../controllers'

const ingredient = IngredientController.getInstance()

const router = async (app: FastifyInstance): Promise<void> => {
  app.get('/v1/ingredients', ingredient.get)
  app.get('/v1/ingredient/:id', ingredient.getById)
  app.post('/v1/ingredient', ingredient.post)

  // app.get('/v1/ingredient/:id', ingredient.getById)
  // app.put('/v1/ingredient/:id', ingredient.put)
  // app.delete('/v1/ingredient/:id', ingredient.delete)
}

export default router
