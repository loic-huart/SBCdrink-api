import { type IIngredient } from '../ingredient/types'
import { type IRecipe } from '../recipe/types'

export enum OrderStatus {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELED = 'CANCELED'
}

export interface IOrderStep {
  id: string
  status: OrderStatus
  orderIndex: number
  quantity: number
  ingredient: IIngredient
}

export interface IOrder {
  id: string
  status: OrderStatus
  progress: number
  recipe: IRecipe
  steps: IOrderStep[]
  createdAt: Date
  updatedAt: Date
}
