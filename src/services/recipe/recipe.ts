import { type IPayloadFindByIdRecipe, type IPayloadFindRecipe, type IRecipe } from './types'
import ErrorService from '../errors/errors'
import Recipe, { deSerializeRecipe, serializeRecipe, serializeRecipes } from '../../models/Recipe'
import { Slug, type Error } from '../errors/types'
import { createPayloadValidation, findByIdPayloadValidation, updatePayloadValidation } from './validators'
import { Ingredient } from '../../models'

interface IRecipeService extends ErrorService {
  find: ({ isAvailable, withIngredients }: IPayloadFindRecipe) => Promise<{ recipes: IRecipe[] }>
  findById: ({ id, withIngredients }: IPayloadFindByIdRecipe) => Promise<{ recipe: IRecipe, error?: Error }>
  create: (recipe: IRecipe) => Promise<{ recipe: IRecipe, error?: Error }>
  update: (id: string, recipe: IRecipe) => Promise<{ recipe: IRecipe, error?: Error }>
  delete: (id: string) => Promise<{ error?: Error }>
}

class RecipeService extends ErrorService implements IRecipeService {
  private static instance: RecipeService

  public static getInstance (): RecipeService {
    if (RecipeService.instance === undefined) {
      RecipeService.instance = new RecipeService()
    }

    return RecipeService.instance
  }

  private async checkIngredientsExist (steps: IRecipe['steps']): Promise<{ error: Error | null }> {
    const ingredientNotExists = await Promise.all(steps.map(async (step) => {
      const ingredient = await Ingredient.findById(step.ingredient)
      if (ingredient == null) {
        return step.ingredient
      }
      return null
    }))
    const filteredIngredientNotExists = ingredientNotExists.filter((ingredient) => ingredient != null)
    if (filteredIngredientNotExists.length > 0) {
      return {
        error: this.NewNotFoundError(`Ingredient not found : ${filteredIngredientNotExists.join(', ')}`, Slug.ErrIngredientNotFound)
      }
    }
    return { error: null }
  }

  public async find ({
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

    const { error: errorIngredientsNotExist } = await this.checkIngredientsExist(recipe.steps)
    if (errorIngredientsNotExist != null) {
      return {
        recipe: {} as IRecipe,
        error: errorIngredientsNotExist
      }
    }

    const newRecipe = new Recipe(deSerializeRecipe(recipe))
    await newRecipe.save()

    return {
      recipe: serializeRecipe(newRecipe)
    }
  }

  public async update (id: string, recipe: IRecipe): Promise<{ recipe: IRecipe, error?: Error }> {
    const { error } = updatePayloadValidation(recipe)
    if (error != null) {
      return {
        recipe: {} as IRecipe,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }

    const findRecipe = await Recipe.findById(id)
    if (findRecipe == null) {
      return {
        recipe: {} as IRecipe,
        error: this.NewNotFoundError('Recipe not found', Slug.ErrRecipeNotFound)
      }
    }

    const { error: errorIngredientsNotExist } = await this.checkIngredientsExist(recipe.steps)
    if (errorIngredientsNotExist != null) {
      return {
        recipe: {} as IRecipe,
        error: errorIngredientsNotExist
      }
    }

    const { name, is_available, steps } = deSerializeRecipe(recipe)
    findRecipe.name = name
    findRecipe.is_available = is_available
    findRecipe.steps = steps.map(step => ({
      _id: step._id,
      ingredient: step.ingredient,
      proportion: step.proportion,
      order_index: step.order_index
    }))

    const newRecipe = await findRecipe.save()

    return {
      recipe: serializeRecipe(newRecipe)
    }
  }

  public async delete (id: string): Promise<{ error?: Error }> {
    const findRecipe = await Recipe.findById(id)
    if (findRecipe == null) {
      return {
        error: this.NewNotFoundError('Recipe not found', Slug.ErrRecipeNotFound)
      }
    }

    await findRecipe.deleteOne()

    return {}
  }
}

export default RecipeService
