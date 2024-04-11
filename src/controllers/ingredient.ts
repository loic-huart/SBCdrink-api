import { type FastifyReply, type FastifyRequest } from 'fastify'
import IngredientService from '../services/ingredient/ingredient'
import mapErrorTypeToHttpCode from '../utils/mapErrorTypeToHttpCode'
import { type IIngredient } from '../services/ingredient/types'

interface IIngredientController {
  get: (req: FastifyRequest, res: FastifyReply) => Promise<void>
}

class IngredientController implements IIngredientController {
  private static instance: IngredientController

  public static getInstance (): IngredientController {
    if (IngredientController.instance === undefined) {
      IngredientController.instance = new IngredientController()
    }

    return IngredientController.instance
  }

  public async get (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const ingredientService = IngredientService.getInstance()
      const { ingredients } = await ingredientService.find()
      await res.status(200).send(ingredients)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }

  public async getById (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const ingredientService = IngredientService.getInstance()
      const { id } = req.params as { id: string }
      const {
        ingredient,
        error
      } = await ingredientService.findById({ id })
      if (error != null) {
        const httpCode = mapErrorTypeToHttpCode(error.errorType)
        await res.status(httpCode).send(error)
        return
      }

      await res.status(200).send(ingredient)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }

  public async post (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const ingredientService = IngredientService.getInstance()
      const {
        ingredient,
        error
      } = await ingredientService.create(req.body as IIngredient)
      if (error != null) {
        const httpCode = mapErrorTypeToHttpCode(error.errorType)
        await res.status(httpCode).send(error)
        return
      }
      await res.status(201).send(ingredient)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }

  public async put (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const ingredientService = IngredientService.getInstance()
      const { id } = req.params as { id: string }
      const {
        ingredient,
        error
      } = await ingredientService.update(id, req.body as IIngredient)
      if (error != null) {
        const httpCode = mapErrorTypeToHttpCode(error.errorType)
        await res.status(httpCode).send(error)
        return
      }
      await res.status(200).send(ingredient)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }

  public async delete (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const ingredientService = IngredientService.getInstance()
      const { id } = req.params as { id: string }
      const { error } = await ingredientService.delete(id)
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

export default IngredientController
