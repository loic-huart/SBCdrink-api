import mongoose, { type ObjectId } from 'mongoose'
import { type IMachineConfiguration } from '../services/machineConfiguration/types'
import { type IModelMachineConfiguration } from './types'

const Schema = mongoose.Schema

const serializeRecipe = (machineConfiguration: IModelMachineConfiguration): IMachineConfiguration => ({
  id: machineConfiguration._id as unknown as string,
  ingredient: machineConfiguration.ingredient as unknown as string,
  slot: machineConfiguration.slot,
  measureVolume: machineConfiguration.measure_volume
})

const serializeRecipes = (machineConfigurations: IModelMachineConfiguration[]): IMachineConfiguration[] => {
  return machineConfigurations.map(machineConfiguration => serializeRecipe(machineConfiguration))
}

const deSerializeRecipe = (machineConfiguration: IMachineConfiguration): IModelMachineConfiguration => ({
  _id: machineConfiguration.id as unknown as ObjectId,
  ingredient: machineConfiguration.ingredient as unknown as ObjectId,
  slot: machineConfiguration.slot,
  measure_volume: machineConfiguration.measureVolume
})

const deSerializeRecipes = (machineConfigurations: IMachineConfiguration[]): IModelMachineConfiguration[] => {
  return machineConfigurations.map(machineConfiguration => deSerializeRecipe(machineConfiguration))
}

const machineConfigurationSchema = new Schema<IModelMachineConfiguration>({
  ingredient: {
    type: Schema.Types.ObjectId,
    ref: 'Ingredient'
  },
  slot: {
    type: Number,
    required: true
  },
  measure_volume: {
    type: Number,
    required: true
  }
})

const MachineConfiguration = mongoose.model('MachineConfiguration', machineConfigurationSchema)

export default MachineConfiguration
export {
  serializeRecipe,
  serializeRecipes,
  deSerializeRecipe,
  deSerializeRecipes
}
