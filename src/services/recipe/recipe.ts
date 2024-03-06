import { type IPayloadFindByIdRecipe, type IPayloadFindRecipe, type IRecipe } from './types'
import ErrorService from '../errors/errors'
import Recipe, { deSerializeRecipe, serializeRecipe, serializeRecipes } from '../../models/Recipe'
import { Slug, type Error } from '../errors/types'
import { createPayloadValidation, findByIdPayloadValidation } from './validators'

interface IRecipeService extends ErrorService {
  find: ({ isAvailable, withIngredients }: IPayloadFindRecipe) => Promise<{ recipes: IRecipe[] }>
  findById: ({ id, withIngredients }: IPayloadFindByIdRecipe) => Promise<{ recipe: IRecipe, error?: Error }>
  create: (recipe: IRecipe) => Promise<{ recipe: IRecipe, error?: Error }>
}

class RecipeService extends ErrorService implements IRecipeService {
  private static instance: RecipeService

  public static getInstance(): RecipeService {
    if (RecipeService.instance === undefined) {
      RecipeService.instance = new RecipeService()
    }

    return RecipeService.instance
  }

  public async find({
    isAvailable,
    withIngredients = false
  }: IPayloadFindRecipe): Promise<{ recipes: IRecipe[] }> {
    const recipe = await Recipe.find({
      ...(isAvailable != null ? { is_available: isAvailable } : {})
    }).populate(withIngredients ? 'steps.ingredient' : '')
    return {
      recipes: serializeRecipes(recipe, withIngredients)
    }
  }

  public async findById ({ id, withIngredients = false }: IPayloadFindByIdRecipe): Promise<{ recipe: IRecipe, error?: Error }> {
    const { error } = findByIdPayloadValidation({ id })
    if (error != null) {
      return {
        recipe: {} as IRecipe,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }
    const recipe = await Recipe.findById(id).populate(withIngredients ? 'steps.ingredient' : '')
    if (recipe == null) {
      return {
        recipe: {} as IRecipe,
        error: this.NewNotFoundError('Recipe not found', Slug.ErrRecipeNotFound)
      }
    }

    return {
      recipe: serializeRecipe(recipe, withIngredients)
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
      recipe: serializeRecipe(newRecipe)
    }
  }
}

export default RecipeService
