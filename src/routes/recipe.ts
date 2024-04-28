import { type FastifyInstance } from 'fastify'
import { RecipeController } from '../controllers'

const recipe = RecipeController.getInstance()

const router = async (app: FastifyInstance): Promise<void> => {
  app.get('/v1/recipes', recipe.get)
  app.get('/v1/recipe/:id', recipe.getById)
  app.post('/v1/recipe', recipe.post)
  app.put('/v1/recipe/:id', recipe.put)

  // app.delete('/v1/recipe/:id', recipe.delete)
}

export default router
