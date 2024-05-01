import { type IPayloadFindIngredients, type IIngredient, type IPayloadFindByIdIngredient } from './types'
import ErrorService from '../errors/errors'
import Ingredient, { deSerializeIngredient, serializeIngredient, serializeIngredients } from '../../models/Ingredient'
import { Slug, type Error } from '../errors/types'
import { createPayloadValidation, findByIdPayloadValidation, updatePayloadValidation } from './validators'
import Recipe from '../../models/Recipe'
import MachineConfiguration from '../../models/MachineConfiguration'

interface IIngredientService extends ErrorService {
  find: ({ sort }: IPayloadFindIngredients) => Promise<{ ingredients: IIngredient[] }>
  findById: ({ id }: IPayloadFindByIdIngredient) => Promise<{ ingredient: IIngredient, error?: Error }>
  create: (ingredient: IIngredient) => Promise<{ ingredient: IIngredient, error?: Error }>
  update: (id: string, ingredient: IIngredient) => Promise<{ ingredient: IIngredient, error?: Error }>
  delete: (id: string) => Promise<{ error?: Error }>
}

class IngredientService extends ErrorService implements IIngredientService {
  private static instance: IngredientService

  public static getInstance (): IngredientService {
    if (IngredientService.instance === undefined) {
      IngredientService.instance = new IngredientService()
    }

    return IngredientService.instance
  }

  public async find ({ sort }: IPayloadFindIngredients): Promise<{ ingredients: IIngredient[] }> {
    const ingredients = await Ingredient.find().sort({ updated_at: sort === 'desc' ? -1 : 1 })
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
    const { error } = updatePayloadValidation(ingredient)
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

  public async delete (id: string): Promise<{ error?: Error }> {
    const findIngredient = await Ingredient.findById(id)
    if (findIngredient == null) {
      return {
        error: this.NewNotFoundError('Ingredient not found', Slug.ErrIngredientNotFound)
      }
    }

    const recipeUseIngredient = await Recipe.find({ 'steps.ingredient': findIngredient._id })
    if (recipeUseIngredient.length > 0) {
      return {
        error: this.NewForbiddenError('Ingredient is used in a recipe', Slug.ErrIngredientUsed)
      }
    }

    const machineConfigurationUseIngredient = await MachineConfiguration.find({ 'ingredients.ingredient': findIngredient._id })
    if (machineConfigurationUseIngredient.length > 0) {
      return {
        error: this.NewForbiddenError('Ingredient is used in a machineConfiguration', Slug.ErrIngredientUsed)
      }
    }

    await findIngredient.deleteOne()

    return {}
  }
}

export default IngredientService
