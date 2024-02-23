import { type ObjectId } from 'mongoose'
import Ingredient from './Ingredient'

// export interface IModelIngredient extends Document {
export interface IModelIngredient {
  _id: ObjectId
  name: string
  is_alcohol: boolean
  alcohol_degree: number
}

export interface IModelRecipe {
  _id: ObjectId
  name: string
  description: string
  picture: string
  alcohol_level: number
  alcohol_min_level: number
  alcohol_max_level: number
  is_available: boolean
  created_at: Date
  updated_at: Date
}

export interface IModelMachineConfiguration {
  _id: ObjectId
  ingredient: ObjectId
  slot: number
  measure_volume: number
}

export interface IModelRecipeIngredient {
  _id: ObjectId
  ingredient: ObjectId
  recipe: ObjectId
  proportion: number
  order_index: number
}
