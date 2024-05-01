import { type IIngredient } from '../ingredient/types'

export interface IMachineConfiguration {
  id: string
  ingredient: IIngredient | string | null
  slot: number
  measureVolume: number
}

export interface IPayloadFindMachineConfigurations {
  withIngredients: boolean
}
