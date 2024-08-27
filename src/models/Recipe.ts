import { type IRecipeFull, type IRecipeWithIngredient, type IRecipeWithPicture, type IRecipe, type IBaseRecipe, type IRecipeStepWithIngredient } from '../services/recipe/types'
import { type IModelRecipeFull, type IModelRecipeWithIngredient, type IModelRecipeWithPicture, type IModelRecipe, type IModelRecipeBase, type IModelRecipeStepWithIngredient } from './types'
import { deSerializeIngredient, serializeIngredient } from './Ingredient'
import { deSerializeFile, serializeFile } from './File'
import { PrismaClient } from '@prisma/client'

function serializeRecipe (recipe: IModelRecipeFull, withIngredients: true, withPictures: true): IRecipeFull
function serializeRecipe (recipe: IModelRecipeWithIngredient, withIngredients: true, withPictures: false): IRecipeWithIngredient
function serializeRecipe (recipe: IModelRecipeWithPicture, withIngredients: false, withPictures: true): IRecipeWithPicture
function serializeRecipe (recipe: IModelRecipe, withIngredients: false, withPictures: false): IRecipe
function serializeRecipe (
  recipe: IModelRecipe | IModelRecipeWithIngredient | IModelRecipeWithPicture | IModelRecipeFull,
  withIngredients: boolean = false,
  withPictures: boolean = false
): IRecipe | IRecipeWithIngredient | IRecipeWithPicture | IRecipeFull {
  const baseRecipe: IBaseRecipe = {
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    alcoholLevel: recipe.alcohol_level,
    alcoholMinLevel: recipe.alcohol_min_level,
    alcoholMaxLevel: recipe.alcohol_max_level,
    isAvailable: recipe.is_available,
    defaultGlassVolume: recipe.default_glass_volume,
    createdAt: recipe.created_at,
    updatedAt: recipe.updated_at,
    pictureId: recipe.picture_id
  }

  if (withIngredients && withPictures) {
    return {
      ...baseRecipe,
      steps: recipe.steps.map((step) => ({
        id: step.id,
        ingredientId: step.ingredient_id,
        ingredient: serializeIngredient((step as IModelRecipeStepWithIngredient).ingredient),
        proportion: step.proportion,
        orderIndex: step.order_index
      })),
      picture: serializeFile((recipe as IModelRecipeWithPicture).picture)
    } as IRecipeFull
  } else if (withIngredients) {
    return {
      ...baseRecipe,
      steps: recipe.steps.map((step) => ({
        id: step.id,
        ingredientId: step.ingredient_id,
        ingredient: serializeIngredient((step as IModelRecipeStepWithIngredient).ingredient),
        proportion: step.proportion,
        orderIndex: step.order_index
      }))
    } as IRecipeWithIngredient
  } else if (withPictures) {
    return {
      ...baseRecipe,
      steps: recipe.steps.map(step => ({
        id: step.id,
        ingredientId: step.ingredient_id,
        proportion: step.proportion,
        orderIndex: step.order_index
      })),
      picture: serializeFile((recipe as IModelRecipeWithPicture).picture)
    } as IRecipeWithPicture
  } else {
    return {
      ...baseRecipe,
      steps: recipe.steps.map(step => ({
        id: step.id,
        ingredientId: step.ingredient_id,
        proportion: step.proportion,
        orderIndex: step.order_index
      }))
    } as IRecipe
  }
}

function serializeRecipes (recipes: IModelRecipeFull[], withIngredients: true, withPictures: true): IRecipeFull[]
function serializeRecipes (recipes: IModelRecipeWithIngredient[], withIngredients: true, withPictures: false): IRecipeWithIngredient[]
function serializeRecipes (recipes: IModelRecipeWithPicture[], withIngredients: false, withPictures: true): IRecipeWithPicture[]
function serializeRecipes (recipes: IModelRecipe[], withIngredients: false, withPictures: false): IRecipe[]
function serializeRecipes (
  recipes: IModelRecipe[] | IModelRecipeWithIngredient[] | IModelRecipeWithPicture[] | IModelRecipeFull[],
  withIngredients: boolean = false,
  withPictures: boolean = false
): IRecipe[] | IRecipeWithIngredient[] | IRecipeWithPicture[] | IRecipeFull[] {
  // @ts-ignore
  return recipes.map(recipe => serializeRecipe(recipe, withIngredients, withPictures))
}

// type DeSerializeRecipeReturnType<
//   WI extends boolean,
//   WP extends boolean
// > = WI extends true
//   ? WP extends true
//     ? IModelRecipeFull
//     : IModelRecipeWithIngredient
//   : WP extends true
//     ? IModelRecipeWithPicture
//     : IModelRecipe

// const deSerializeRecipe = <
//   WI extends boolean = false,
//   WP extends boolean = false
// >(recipe: IRecipe, withIngredients: WI, withPictures: WP): DeSerializeRecipeReturnType<WI, WP> => {

function deSerializeRecipe (recipe: IRecipeFull, withIngredients: true, withPictures: true): IModelRecipeFull
function deSerializeRecipe (recipe: IRecipeWithIngredient, withIngredients: true, withPictures: false): IModelRecipeWithIngredient
function deSerializeRecipe (recipe: IRecipeWithPicture, withIngredients: false, withPictures: true): IModelRecipeWithPicture
function deSerializeRecipe (recipe: IRecipe, withIngredients: false, withPictures: false): IModelRecipe
function deSerializeRecipe (
  recipe: IRecipe | IRecipeFull | IRecipeWithIngredient | IRecipeWithPicture,
  withIngredients: boolean = false,
  withPictures: boolean = false
): IModelRecipe | IModelRecipeWithIngredient | IModelRecipeWithPicture | IModelRecipeFull {
  const baseRecipe: IModelRecipeBase = {
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    alcohol_level: recipe.alcoholLevel,
    alcohol_min_level: recipe.alcoholMinLevel,
    alcohol_max_level: recipe.alcoholMaxLevel,
    is_available: recipe.isAvailable,
    default_glass_volume: recipe.defaultGlassVolume,
    created_at: recipe.createdAt,
    updated_at: recipe.updatedAt,
    picture_id: recipe.pictureId
  }

  if (withIngredients && withPictures) {
    return {
      ...baseRecipe,
      steps: recipe.steps.map(step => ({
        id: step.id,
        ingredient_id: step.ingredientId,
        ingredient: deSerializeIngredient((step as IRecipeStepWithIngredient).ingredient),
        proportion: step.proportion,
        order_index: step.orderIndex
      })),
      picture: deSerializeFile((recipe as IRecipeWithPicture).picture)
    } as IModelRecipeFull
  } else if (withIngredients) {
    return {
      ...baseRecipe,
      steps: recipe.steps.map(step => ({
        id: step.id,
        ingredient_id: step.ingredientId,
        ingredient: deSerializeIngredient((step as IRecipeStepWithIngredient).ingredient),
        proportion: step.proportion,
        order_index: step.orderIndex
      }))
    } as IModelRecipeWithIngredient
  } else if (withPictures) {
    return {
      ...baseRecipe,
      steps: recipe.steps.map(step => ({
        id: step.id,
        ingredient_id: step.ingredientId,
        proportion: step.proportion,
        order_index: step.orderIndex
      })),
      picture: deSerializeFile((recipe as IRecipeWithPicture).picture)
    } as IModelRecipeWithPicture
  } else {
    return {
      ...baseRecipe,
      steps: recipe.steps.map(step => ({
        id: step.id,
        ingredient_id: step.ingredientId,
        proportion: step.proportion,
        order_index: step.orderIndex
      }))
    } as IModelRecipe
  }
}

function deSerializeRecipes (recipes: IRecipeFull[], withIngredients: true, withPictures: true): IModelRecipeFull[]
function deSerializeRecipes (recipes: IRecipeWithIngredient[], withIngredients: true, withPictures: false): IModelRecipeWithIngredient[]
function deSerializeRecipes (recipes: IRecipeWithPicture[], withIngredients: false, withPictures: true): IModelRecipeWithPicture[]
function deSerializeRecipes (recipes: IRecipe[], withIngredients: false, withPictures: false): IModelRecipe[]
function deSerializeRecipes (
  recipes: IRecipe[] | IRecipeFull[] | IRecipeWithIngredient[] | IRecipeWithPicture[],
  withIngredients: boolean = false,
  withPictures: boolean = false
): IModelRecipe[] | IModelRecipeWithIngredient[] | IModelRecipeWithPicture[] | IModelRecipeFull[] {
  // @ts-ignore
  return recipes.map(recipe => deSerializeRecipe(recipe, withIngredients, withPictures))
}

const RecipeStep = new PrismaClient().recipeStep
const Recipe = new PrismaClient().recipe

export default Recipe
export {
  RecipeStep,
  serializeRecipe,
  serializeRecipes,
  deSerializeRecipe,
  deSerializeRecipes
}
