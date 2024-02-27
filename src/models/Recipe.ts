import mongoose, { type ObjectId } from 'mongoose'
import { type IRecipe } from '../services/recipe/types'
import { type IModelRecipe } from './types'
import { deSerializeIngredient, serializeIngredient } from './Ingredient'

const Schema = mongoose.Schema

const serializeRecipe = (recipe: IModelRecipe): IRecipe => ({
  id: recipe._id as unknown as string,
  name: recipe.name,
  description: recipe.description,
  picture: recipe.picture,
  alcoholLevel: recipe.alcohol_level,
  alcoholMinLevel: recipe.alcohol_min_level,
  alcoholMaxLevel: recipe.alcohol_max_level,
  isAvailable: recipe.is_available,
  steps: recipe.steps.map(step => ({
    id: step._id as unknown as string,
    ingredient: serializeIngredient(step.ingredient),
    proportion: step.proportion,
    orderIndex: step.order_index
  })),
  createdAt: recipe.created_at,
  updatedAt: recipe.updated_at
})

const serializeRecipes = (recipes: IModelRecipe[]): IRecipe[] => {
  return recipes.map(recipe => serializeRecipe(recipe))
}

const deSerializeRecipe = (recipe: IRecipe): IModelRecipe => ({
  _id: recipe.id as unknown as ObjectId,
  name: recipe.name,
  description: recipe.description,
  picture: recipe.picture,
  alcohol_level: recipe.alcoholLevel,
  alcohol_min_level: recipe.alcoholMinLevel,
  alcohol_max_level: recipe.alcoholMaxLevel,
  is_available: recipe.isAvailable,
  steps: recipe.steps.map(step => ({
    _id: step.id as unknown as ObjectId,
    ingredient: deSerializeIngredient(step.ingredient),
    proportion: step.proportion,
    order_index: step.orderIndex
  })),
  created_at: recipe.createdAt,
  updated_at: recipe.updatedAt
})

const deSerializeRecipes = (recipes: IRecipe[]): IModelRecipe[] => {
  return recipes.map(recipe => deSerializeRecipe(recipe))
}

const recipeSchema = new Schema<IModelRecipe>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  picture: {
    type: String
  },
  alcohol_level: {
    type: Number,
    required: true
  },
  alcohol_min_level: {
    type: Number,
    required: true,
    default: 0
  },
  alcohol_max_level: {
    type: Number,
    required: true,
    default: 0
  },
  is_available: {
    type: Boolean,
    required: true,
    default: false
  },
  steps: [
    {
      ingredient: {
        type: Schema.Types.ObjectId,
        ref: 'Ingredient',
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
    }
  ],
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now
  }
})

const Recipe = mongoose.model('Recipe', recipeSchema)

export default Recipe
export {
  serializeRecipe,
  serializeRecipes,
  deSerializeRecipe,
  deSerializeRecipes
}
