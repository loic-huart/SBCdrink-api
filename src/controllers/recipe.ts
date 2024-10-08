import { type FastifyReply, type FastifyRequest } from 'fastify'
import RecipeService from '../services/recipe/recipe'
import mapErrorTypeToHttpCode from '../utils/mapErrorTypeToHttpCode'
import { type IRecipe } from '../services/recipe/types'
import parseBooleanQuery from '../utils/parseBooleanQuery'

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
        withIngredients,
        withPictures,
        sort
      } = req.query as { isAvailable: string, withIngredients: string, sort: 'desc' | 'asc', withPictures: string }
      const { recipes } = await recipeService.find({
        isAvailable: parseBooleanQuery(isAvailable),
        withIngredients: parseBooleanQuery(withIngredients),
        withPictures: parseBooleanQuery(withPictures),
        sort
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
      const { withIngredients, withPictures } = req.query as { withIngredients: string, withPictures: string }
      const {
        recipe,
        error
      } = await recipeService.findById({
        id,
        withIngredients: parseBooleanQuery(withIngredients),
        withPictures: parseBooleanQuery(withPictures)
      })
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

  public async put (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const recipeService = RecipeService.getInstance()
      const { id } = req.params as { id: string }
      const {
        recipe,
        error
      } = await recipeService.update(id, req.body as IRecipe)
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

  public async delete (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const recipeService = RecipeService.getInstance()
      const { id } = req.params as { id: string }
      const { error } = await recipeService.delete(id)
      if (error != null) {
        const httpCode = mapErrorTypeToHttpCode(error.errorType)
        await res.status(httpCode).send(error)
        return
      }
      await res.status(204).send()
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }
}

export default RecipeController
