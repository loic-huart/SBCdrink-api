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
    const ingredients = await Ingredient.findMany({
      orderBy: {
        updated_at: sort
      }
    })
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
    const ingredient = await Ingredient.findUnique({
      where: { id }
    })
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
    const newIngredient = await Ingredient.create({ data: deSerializeIngredient(ingredient) })

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

    const findIngredient = await Ingredient.findUnique({ where: { id } })
    if (findIngredient == null) {
      return {
        ingredient: {} as IIngredient,
        error: this.NewNotFoundError('Ingredient not found', Slug.ErrIngredientNotFound)
      }
    }

    const { alcohol_degree, is_alcohol, name, viscosity } = deSerializeIngredient(ingredient)

    const newIngredient = await Ingredient.update({
      where: {
        id: findIngredient.id
      },
      data: {
        name,
        is_alcohol,
        alcohol_degree,
        viscosity
      }
    })

    return {
      ingredient: serializeIngredient(newIngredient)
    }
  }

  public async delete (id: string): Promise<{ error?: Error }> {
    const findIngredient = await Ingredient.findUnique({ where: { id } })
    if (findIngredient == null) {
      return {
        error: this.NewNotFoundError('Ingredient not found', Slug.ErrIngredientNotFound)
      }
    }

    const recipeUseIngredient = await Recipe.findMany({
      where: {
        steps: {
          some: {
            ingredient_id: findIngredient.id
          }
        }
      }
    })
    if (recipeUseIngredient.length > 0) {
      return {
        error: this.NewForbiddenError('Ingredient is used in a recipe', Slug.ErrIngredientUsed)
      }
    }

    const machineConfigurationUseIngredient = await MachineConfiguration.findMany({
      where: {
        ingredient_id: findIngredient.id
      }
    })

    if (machineConfigurationUseIngredient.length > 0) {
      return {
        error: this.NewForbiddenError('Ingredient is used in a machineConfiguration', Slug.ErrIngredientUsed)
      }
    }

    await Ingredient.delete({ where: { id: findIngredient.id } })

    return {}
  }
}

export default IngredientService
