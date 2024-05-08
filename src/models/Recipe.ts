import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import { type IRecipe } from '../services/recipe/types'
import { type IModelFile, type IModelIngredient, type IModelRecipe } from './types'
import { deSerializeIngredient, serializeIngredient } from './Ingredient'
import { type IIngredient } from '../services/ingredient/types'
import { deSerializeFile, serializeFile } from './File'
import { type IFile } from '../services/file/types'

const Schema = mongoose.Schema

const serializeRecipe = (recipe: IModelRecipe, withIngredients = false, withPictures = false): IRecipe => {
  let picture = null

  if (recipe.picture !== null) {
    if (withPictures) {
      picture = serializeFile(recipe.picture as IModelFile)
    } else {
      picture = (recipe.picture as ObjectId).toString()
    }
  }

  return ({
    id: recipe._id.toString(),
    name: recipe.name,
    description: recipe.description,
    picture,
    alcoholLevel: recipe.alcohol_level,
    alcoholMinLevel: recipe.alcohol_min_level,
    alcoholMaxLevel: recipe.alcohol_max_level,
    isAvailable: recipe.is_available,
    steps: recipe.steps.map(step => ({
      id: step._id.toString(),
      ingredient: withIngredients ? serializeIngredient(step.ingredient as IModelIngredient) : (step.ingredient as ObjectId).toString(),
      proportion: step.proportion,
      orderIndex: step.order_index
    })),
    createdAt: recipe.created_at,
    updatedAt: recipe.updated_at
  })
}

const serializeRecipes = (recipes: IModelRecipe[], withIngredients = false, withPictures = false): IRecipe[] => {
  return recipes.map(recipe => serializeRecipe(recipe, withIngredients, withPictures))
}

const deSerializeRecipe = (recipe: IRecipe, withIngredients = false, withPictures = false): IModelRecipe => {
  let picture = null

  if (recipe.picture !== null) {
    if (withPictures) {
      picture = deSerializeFile(recipe.picture as IFile)
    } else {
      picture = new ObjectId(recipe.picture as string)
    }
  }

  return ({
    _id: new ObjectId(recipe.id),
    name: recipe.name,
    description: recipe.description,
    picture,
    alcohol_level: recipe.alcoholLevel,
    alcohol_min_level: recipe.alcoholMinLevel,
    alcohol_max_level: recipe.alcoholMaxLevel,
    is_available: recipe.isAvailable,
    steps: recipe.steps.map(step => ({
      _id: new ObjectId(step.id),
      ingredient: withIngredients ? deSerializeIngredient(step.ingredient as IIngredient) : new ObjectId(step.ingredient as string),
      proportion: step.proportion,
      order_index: step.orderIndex
    })),
    created_at: recipe.createdAt,
    updated_at: recipe.updatedAt
  })
}

const deSerializeRecipes = (recipes: IRecipe[], withIngredients = false, withPictures = false): IModelRecipe[] => {
  return recipes.map(recipe => deSerializeRecipe(recipe, withIngredients, withPictures))
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
    type: Schema.Types.ObjectId,
    ref: 'File',
    required: false,
    default: null
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
  ]
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
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
