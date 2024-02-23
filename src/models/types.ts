import { type ObjectId, type Document } from 'mongoose'

// export interface IModelIngredient extends Document {
export interface IModelIngredient {
  _id: ObjectId
  name: string
  is_alcohol: boolean
  alcohol_degree: number
}
