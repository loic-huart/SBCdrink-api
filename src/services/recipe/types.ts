import { type IFile } from '../file/types'
import { type IIngredient } from '../ingredient/types'

export interface IRecipeStep {
  id: string
  ingredientId: string
  proportion: number
  orderIndex: number
}

export interface IRecipeStepWithIngredient extends IRecipeStep {
  ingredient: IIngredient
}

export interface IBaseRecipe {
  id: string
  name: string
  description: string
  alcoholLevel: number
  alcoholMinLevel: number
  alcoholMaxLevel: number
  isAvailable: boolean
  defaultGlassVolume: number
  createdAt: Date
  updatedAt: Date
  pictureId: string | null
}

export interface IRecipe extends IBaseRecipe {
  steps: IRecipeStep[]
}

export interface IRecipeWithPicture extends IRecipe {
  picture: IFile | null
}

export interface IRecipeWithIngredient extends Omit<IRecipe, 'steps'> {
  steps: IRecipeStepWithIngredient[]
}

export interface IRecipeFull extends Omit<IRecipe, 'steps'> {
  picture: IFile | null
  steps: IRecipeStepWithIngredient[]
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
