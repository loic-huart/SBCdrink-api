import { type IIngredient } from './types'
import ErrorService from '../errors/errors'
import Ingredient, { deSerializeIngredient, serializeIngredient, serializeIngredients } from '../../models/Ingredient'
import { Slug, type Error } from '../errors/types'
import { createPayloadValidation } from './validators'

interface IIngredientService extends ErrorService {
  find: () => Promise<{ ingredients: IIngredient[] }>
  create: (ingredient: IIngredient) => Promise<{ ingredient: IIngredient, error?: Error }>
}

class IngredientService extends ErrorService implements IIngredientService {
  private static instance: IngredientService

  public static getInstance (): IngredientService {
    if (IngredientService.instance === undefined) {
      IngredientService.instance = new IngredientService()
    }

    return IngredientService.instance
  }

  public async find (): Promise<{ ingredients: IIngredient[] }> {
    const ingredients = await Ingredient.find()
    return {
      ingredients: serializeIngredients(ingredients)
    }
  }

  public async create (ingredient: IIngredient): Promise<{ ingredient: IIngredient, error?: Error }> {
    const { error } = createPayloadValidation(ingredient)
    if (error != null) {
      return {
        ingredient: {} as IIngredient,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }

    const newIngredient = new Ingredient(deSerializeIngredient(ingredient))
    await newIngredient.save()

    return {
      ingredient: serializeIngredient(newIngredient)
    }
  }
}

export default IngredientService
