import { type IIngredient } from '../ingredient/types'

export interface IRecipe {
  id: string
  name: string
  description: string
  picture: string
  alcoholLevel: number
  alcoholMinLevel: number
  alcoholMaxLevel: number
  isAvailable: boolean
  steps: Array<{
    id: string
    ingredient: IIngredient | string
    proportion: number
    orderIndex: number
  }>
  createdAt: Date
  updatedAt: Date
}

export interface IPayloadFindRecipe {
  isAvailable?: boolean
  withIngredients?: boolean
}

export interface IPayloadFindByIdRecipe {
  id: string
  withIngredients?: boolean
}
