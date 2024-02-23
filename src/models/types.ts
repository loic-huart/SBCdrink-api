import { type ObjectId } from 'mongoose'

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
