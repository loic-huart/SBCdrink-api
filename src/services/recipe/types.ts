import { type IFile } from '../file/types'
import { type IIngredient } from '../ingredient/types'

export interface IRecipe {
  id: string
  name: string
  description: string
  picture: IFile | string | null
  alcoholLevel: number
  alcoholMinLevel: number
  alcoholMaxLevel: number
  isAvailable: boolean
  defaultGlassVolume: number
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
  withPictures?: boolean
  sort?: 'desc' | 'asc'
}

export interface IPayloadFindByIdRecipe {
  id: string
  withIngredients?: boolean
  withPictures?: boolean
}
