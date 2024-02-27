import { type FastifyReply, type FastifyRequest } from 'fastify'
import RecipeService from '../services/recipe/recipe'
import mapErrorTypeToHttpCode from '../utils/mapErrorTypeToHttpCode'
import { Error } from '../services/errors/types'
import { type IRecipe } from '../services/recipe/types'

interface IRecipeController {
  get: (req: FastifyRequest, res: FastifyReply) => Promise<void>
}

class RecipeController implements IRecipeController {
  private static instance: RecipeController

  public static getInstance (): RecipeController {
    if (RecipeController.instance === undefined) {
      RecipeController.instance = new RecipeController()
    }

    return RecipeController.instance
  }

  public async get (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const recipeService = RecipeService.getInstance()
      const {
        isAvailable,
        withIngredients
      } = req.query as { isAvailable: boolean, withIngredients: boolean }
      const { recipes } = await recipeService.find({
        isAvailable,
        withIngredients
      })
      await res.status(200).send(recipes)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }

  public async getById (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const recipeService = RecipeService.getInstance()
      const { id } = req.params as { id: string }
      const { withIngredients } = req.query as { withIngredients: boolean }
      const {
        recipe,
        error
      } = await recipeService.findById({ id, withIngredients })
      if (error != null) {
        const httpCode = mapErrorTypeToHttpCode(error.errorType)
        await res.status(httpCode).send(error)
        return
      }

      await res.status(200).send(recipe)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }

  public async post (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const recipeService = RecipeService.getInstance()
      const {
        recipe,
        error
      } = await recipeService.create(req.body as IRecipe)
      if (error != null) {
        const httpCode = mapErrorTypeToHttpCode(error.errorType)
        await res.status(httpCode).send(error)
        return
      }
      await res.status(201).send(recipe)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }
}

export default RecipeController
