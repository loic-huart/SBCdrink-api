// ---------------------------------- Ingredient --------------------------------------------------

export interface IModelIngredient {
  id: string
  name: string
  is_alcohol: boolean
  alcohol_degree: number
  created_at: Date
  updated_at: Date
  viscosity: number
}

// ------------------------------------- File -----------------------------------------------------

export interface IModelFile {
  id: string
  name: string
  path: string
  created_at: Date
  updated_at: Date
}

// ------------------------------------ Recipe ----------------------------------------------------

export interface IModelRecipeStep {
  id: string
  ingredient_id: string
  order_index: number
  proportion: number
}

export interface IModelRecipeStepWithIngredient extends IModelRecipeStep {
  ingredient: IModelIngredient
}

export interface IModelRecipeBase {
  id: string
  name: string
  description: string
  alcohol_level: number
  alcohol_min_level: number
  alcohol_max_level: number
  is_available: boolean
  default_glass_volume: number
  created_at: Date
  updated_at: Date
  picture_id: string | null
}

export interface IModelRecipe extends IModelRecipeBase {
  steps: IModelRecipeStep[]
}

export interface IModelRecipeWithPicture extends IModelRecipe {
  picture: IModelFile | null
}

export interface IModelRecipeWithIngredient extends Omit<IModelRecipe, 'steps'> {
  steps: IModelRecipeStepWithIngredient[]
}

export interface IModelRecipeFull extends Omit<IModelRecipe, 'steps'> {
  steps: IModelRecipeStepWithIngredient[]
  picture: IModelFile | null
}

// ----------------------------- MachineConfiguration ---------------------------------------------

export interface IModelMachineConfigurationBase {
  id: string
  slot: number
  measure_volume: number | null
  ingredient_id: string | null
  position: number | null
}

export interface IModelMachineConfiguration extends IModelMachineConfigurationBase {
}

export interface IModelMachineConfigurationWithIngredient extends IModelMachineConfiguration {
  ingredient: IModelIngredient | null
}

export interface IModelMachineConfigurationFull extends IModelMachineConfiguration {
  ingredient: IModelIngredient | null
}

// ------------------------------------- Order ----------------------------------------------------

export type IModelOrderStatus = 'CREATED' | 'IN_PROGRESS' | 'DONE' | 'CANCELED' | 'FAILED'

export interface IModelOrderIngredient extends IModelIngredient {}

export interface IModelOrderStep {
  id: string
  ingredient: IModelOrderIngredient
  order_index: number
  quantity: number
  status: IModelOrderStatus
}

export interface IModelOrderRecipeStep extends IModelRecipeStep {}

export interface IModelOrderRecipe extends IModelRecipeFull {}

export interface IModelOrder {
  id: string
  status: IModelOrderStatus
  progress: number
  recipe: IModelOrderRecipe
  steps: IModelOrderStep[]
  created_at: Date
  updated_at: Date
}

// ------------------------------------ Setting ---------------------------------------------------

export interface IModelSetting {
  dispenser_emptying_time: number
  dispenser_filling_time: number
}
