import { type IRecipe } from './types'
import ErrorService from '../errors/errors'
import Recipe, { deSerializeRecipe, serializeRecipe, serializeRecipes } from '../../models/Recipe'
import { Slug, type Error } from '../errors/types'
import { createPayloadValidation, findByIdPayloadValidation } from './validators'

interface IRecipeService extends ErrorService {
  find: () => Promise<{ recipes: IRecipe[] }>
  findById: (id: string) => Promise<{ recipe: IRecipe, error?: Error }>
  create: (recipe: IRecipe) => Promise<{ recipe: IRecipe, error?: Error }>
}

class RecipeService extends ErrorService implements IRecipeService {
  private static instance: RecipeService

  public static getInstance (): RecipeService {
    if (RecipeService.instance === undefined) {
      RecipeService.instance = new RecipeService()
    }

    return RecipeService.instance
  }

  public async find (): Promise<{ recipes: IRecipe[] }> {
    const recipe = await Recipe.find()
    return {
      recipes: serializeRecipes(recipe)
    }
  }

  public async findById (id: string): Promise<{ recipe: IRecipe, error?: Error }> {
    const { error } = findByIdPayloadValidation({ id })
    if (error != null) {
      return {
        recipe: {} as IRecipe,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }
    const recipe = await Recipe.findById(id)
    if (recipe == null) {
      return {
        recipe: {} as IRecipe,
        error: this.NewNotFoundError('Recipe not found', Slug.ErrRecipeNotFound)
      }
    }

    return {
      recipe: serializeRecipe(recipe)
    }
  }

  public async create (recipe: IRecipe): Promise<{ recipe: IRecipe, error?: Error }> {
    const { error } = createPayloadValidation(recipe)
    if (error != null) {
      return {
        recipe: {} as IRecipe,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }

    const newRecipe = new Recipe(deSerializeRecipe(recipe))
    await newRecipe.save()

    return {
      recipe
    }
  }
}

export default RecipeService
