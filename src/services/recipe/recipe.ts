import { type IPayloadFindByIdRecipe, type IPayloadFindRecipe, type IRecipe } from './types'
import ErrorService from '../errors/errors'
import Recipe, { deSerializeRecipe, serializeRecipe, serializeRecipes } from '../../models/Recipe'
import { Slug, type Error } from '../errors/types'
import { createPayloadValidation, findByIdPayloadValidation, updatePayloadValidation } from './validators'
import { Ingredient } from '../../models'
import File from '../../models/File'

interface IRecipeService extends ErrorService {
  find: ({ isAvailable, withIngredients, withPictures }: IPayloadFindRecipe) => Promise<{ recipes: IRecipe[] }>
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
    withIngredients = false,
    withPictures = false,
    sort
  }: IPayloadFindRecipe): Promise<{ recipes: IRecipe[] }> {
    const recipe = await Recipe.find({
      ...(isAvailable != null ? { is_available: isAvailable } : {})
    }).populate(withIngredients ? 'steps.ingredient' : '')
      .populate(withPictures ? 'picture' : '')
      .sort({ updated_at: sort === 'desc' ? -1 : 1 })
    return {
      recipes: serializeRecipes(recipe, withIngredients, withPictures)
    }
  }

  public async findById ({ id, withIngredients = false, withPictures = false }: IPayloadFindByIdRecipe): Promise<{ recipe: IRecipe, error?: Error }> {
    const { error } = findByIdPayloadValidation({ id })
    if (error != null) {
      return {
        recipe: {} as IRecipe,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }
    const recipe = await Recipe.findById(id)
      .populate(withIngredients ? 'steps.ingredient' : '')
      .populate(withPictures ? 'picture' : '')
    if (recipe == null) {
      return {
        recipe: {} as IRecipe,
        error: this.NewNotFoundError('Recipe not found', Slug.ErrRecipeNotFound)
      }
    }

    return {
      recipe: serializeRecipe(recipe, withIngredients, withPictures)
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

    const {
      name,
      steps,
      description,
      picture,
      alcohol_level,
      alcohol_min_level,
      alcohol_max_level
    } = deSerializeRecipe(recipe)
    findRecipe.name = name
    findRecipe.description = description
    findRecipe.picture = picture
    findRecipe.alcohol_level = alcohol_level
    findRecipe.alcohol_min_level = alcohol_min_level
    findRecipe.alcohol_max_level = alcohol_max_level
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

    const findFile = await File.findById(findRecipe.picture)
    if (findFile !== null) {
      await findFile.deleteOne()
    }

    await findRecipe.deleteOne()

    return {}
  }
}

export default RecipeService
