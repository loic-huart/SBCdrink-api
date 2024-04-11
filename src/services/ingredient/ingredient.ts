import { type IIngredient, type IPayloadFindByIdIngredient } from './types'
import ErrorService from '../errors/errors'
import Ingredient, { deSerializeIngredient, serializeIngredient, serializeIngredients } from '../../models/Ingredient'
import { Slug, type Error } from '../errors/types'
import { createPayloadValidation, findByIdPayloadValidation } from './validators'
import { IModelIngredient } from '../../models/types'

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

  public async findById ({ id }: IPayloadFindByIdIngredient): Promise<{ ingredient: IIngredient, error?: Error }> {
    const { error } = findByIdPayloadValidation({ id })
    if (error != null) {
      return {
        ingredient: {} as IIngredient,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }
    const ingredient = await Ingredient.findById(id)
    if (ingredient == null) {
      return {
        ingredient: {} as IIngredient,
        error: this.NewNotFoundError('Ingredient not found', Slug.ErrIngredientNotFound)
      }
    }

    return {
      ingredient: serializeIngredient(ingredient)
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

  public async update (id: string, ingredient: IIngredient): Promise<{ ingredient: IIngredient, error?: Error }> {
    const { error } = createPayloadValidation(ingredient)
    if (error != null) {
      return {
        ingredient: {} as IIngredient,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }

    const findIngredient = await Ingredient.findById(id)
    if (findIngredient == null) {
      return {
        ingredient: {} as IIngredient,
        error: this.NewNotFoundError('Ingredient not found', Slug.ErrIngredientNotFound)
      }
    }

    const { alcohol_degree, is_alcohol, name } = deSerializeIngredient(ingredient)
    findIngredient.name = name
    findIngredient.is_alcohol = is_alcohol
    findIngredient.alcohol_degree = alcohol_degree

    const newIngredient = await findIngredient.save()

    return {
      ingredient: serializeIngredient(newIngredient)
    }
  }
}

export default IngredientService
