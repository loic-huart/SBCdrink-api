import { IRecipeFull, type IPayloadFindByIdRecipe, type IPayloadFindRecipe, type IRecipe } from './types'
import ErrorService from '../errors/errors'
import Recipe, { deSerializeRecipe, RecipeStep, serializeRecipe, serializeRecipes } from '../../models/Recipe'
import { Slug, type Error } from '../errors/types'
import { createPayloadValidation, findByIdPayloadValidation, updatePayloadValidation } from './validators'
import { Ingredient } from '../../models'
import File from '../../models/File'
import { IModelIngredient, IModelRecipeFull } from '../../models/types'

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
      const ingredient = {} as IModelIngredient
      if (ingredient == null) {
        return step.ingredientId
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
    const recipes = await Recipe.findMany({
      where: isAvailable != null ? { is_available: isAvailable } : {},
      orderBy: {
        updated_at: sort
      },
      include: {
        picture: withPictures,
        steps: {
          include: {
            ingredient: withIngredients
          }
        }
      }
    })

    return {
      // @ts-ignore
      recipes: serializeRecipes(recipes, withIngredients, withPictures)
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
    const recipe = await Recipe.findUnique({
      where: { id },
      include: {
        picture: withPictures,
        steps: {
          include: {
            ingredient: withIngredients
          }
        }
      }
    })

    if (recipe == null) {
      return {
        recipe: {} as IRecipe,
        error: this.NewNotFoundError('Recipe not found', Slug.ErrRecipeNotFound)
      }
    }

    return {
      // @ts-ignore
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

    const deSerializedRecipe = deSerializeRecipe(recipe, false, false)

    const newRecipe = await Recipe.create({
      include: {
        steps: true
      },
      data: {
        ...deSerializedRecipe,
        steps: {
          create: deSerializedRecipe.steps
        }
      }
    })

    return {
      recipe: serializeRecipe(newRecipe, false, false)
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

    const findRecipe = await Recipe.findUnique({ where: { id } })
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
      picture_id,
      alcohol_level,
      alcohol_min_level,
      alcohol_max_level,
      default_glass_volume
    } = deSerializeRecipe(recipe, false, false)

    const newRecipe = await Recipe.update({
      include: {
        steps: true
      },
      where: {
        id: findRecipe.id
      },
      data: {
        name,
        description,
        picture_id: picture_id ?? undefined,
        alcohol_level,
        alcohol_min_level,
        alcohol_max_level,
        default_glass_volume,
        steps: {
          update: steps.map(step => ({
            where: { id: step.id },
            data: {
              ingredient_id: step.ingredient_id,
              proportion: step.proportion,
              order_index: step.order_index
            }
          }))
        }
      }
    })

    return {
      recipe: serializeRecipe(newRecipe, false, false)
    }
  }

  public async delete (id: string): Promise<{ error?: Error }> {
    const findRecipe = await Recipe.findUnique({
      where: { id },
      include: {
        steps: true
      }
    })
    if (findRecipe == null) {
      return {
        error: this.NewNotFoundError('Recipe not found', Slug.ErrRecipeNotFound)
      }
    }

    if (findRecipe.picture_id != null) {
      const findFile = await File.findFirst({
        where: {
          id: findRecipe.picture_id
        }
      })
      if (findFile !== null) {
        await File.delete({ where: { id: findRecipe.picture_id } })
      }
    }

    await RecipeStep.deleteMany({
      where: { recipe_id: id }
    })

    await Recipe.deleteMany({
      where: { id: findRecipe.id }
    })

    return {}
  }
}

export default RecipeService
