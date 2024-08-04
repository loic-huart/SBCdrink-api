import { type OrderStatus } from '../services/order/types'
import { type ObjectId } from 'mongodb'

// export interface IModelIngredient extends Document {
export interface IModelIngredient {
  _id: ObjectId
  name: string
  is_alcohol: boolean
  alcohol_degree: number
  created_at: Date
  updated_at: Date
  viscosity: number
}

export interface IModelRecipe {
  _id: ObjectId
  name: string
  description: string
  picture: IModelFile | ObjectId | null
  alcohol_level: number
  alcohol_min_level: number
  alcohol_max_level: number
  is_available: boolean
  default_glass_volume: number
  steps: Array<{
    _id: ObjectId
    ingredient: IModelIngredient | ObjectId
    proportion: number
    order_index: number
  }>
  created_at: Date
  updated_at: Date
}

export interface IModelMachineConfiguration {
  _id: ObjectId
  ingredient: IModelIngredient | ObjectId | null
  slot: number
  measure_volume: number | null
}

export interface IModelRecipeIngredient {
  _id: ObjectId
  ingredient: ObjectId
  recipe: ObjectId
  proportion: number
  order_index: number
}

export interface IModelOrder {
  _id: ObjectId
  status: OrderStatus
  progress: number
  recipe: IModelRecipe
  steps: Array<{
    _id: ObjectId
    status: OrderStatus
    order_index: number
    quantity: number
    ingredient: IModelIngredient
  }>
  created_at: Date
  updated_at: Date
}

export interface IModelFile {
  _id: ObjectId
  name: string
  path: string
  created_at: Date
  updated_at: Date
}

export interface IModelSetting {
  time_for_one_quantity: number
}
