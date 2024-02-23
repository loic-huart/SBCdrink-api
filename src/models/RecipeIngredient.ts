import mongoose, { type ObjectId } from 'mongoose'
import { type IRecipeIngredient } from '../services/recipeIngredient/types'
import { type IModelRecipeIngredient } from './types'

const Schema = mongoose.Schema

const serializeRecipe = (recipeIngredient: IModelRecipeIngredient): IRecipeIngredient => ({
  id: recipeIngredient._id as unknown as string,
  ingredient: recipeIngredient.ingredient as unknown as string,
  recipe: recipeIngredient.recipe as unknown as string,
  proportion: recipeIngredient.proportion,
  orderIndex: recipeIngredient.order_index
})

const serializeRecipes = (recipeIngredients: IModelRecipeIngredient[]): IRecipeIngredient[] => {
  return recipeIngredients.map(recipeIngredient => serializeRecipe(recipeIngredient))
}

const deSerializeRecipe = (recipeIngredient: IRecipeIngredient): IModelRecipeIngredient => ({
  _id: recipeIngredient.id as unknown as ObjectId,
  ingredient: recipeIngredient.ingredient as unknown as ObjectId,
  recipe: recipeIngredient.recipe as unknown as ObjectId,
  proportion: recipeIngredient.proportion,
  order_index: recipeIngredient.orderIndex
})

const deSerializeRecipes = (recipeIngredients: IRecipeIngredient[]): IModelRecipeIngredient[] => {
  return recipeIngredients.map(recipeIngredient => deSerializeRecipe(recipeIngredient))
}

const recipeIngredientSchema = new Schema<IModelRecipeIngredient>({
  ingredient: {
    type: Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true
  },
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  proportion: {
    type: Number,
    required: true
  },
  order_index: {
    type: Number,
    required: true
  }
})

const RecipeIngredient = mongoose.model('RecipeIngredient', recipeIngredientSchema)

export default RecipeIngredient
export {
  serializeRecipe,
  serializeRecipes,
  deSerializeRecipe,
  deSerializeRecipes
}
