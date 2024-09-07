import { type IIngredient } from '../ingredient/types'

export interface IBaseMachineConfiguration {
  id: string
  slot: number
  measureVolume: number | null
  ingredientId: string | null
}

export interface IMachineConfiguration extends IBaseMachineConfiguration {
}

export interface IMachineConfigurationWithIngredient extends IMachineConfiguration {
  ingredient: IIngredient | null
}

export interface IPayloadFindMachineConfigurations {
  withIngredients?: boolean
}
