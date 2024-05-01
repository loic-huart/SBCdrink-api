import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import { type IMachineConfiguration } from '../services/machineConfiguration/types'
import { type IModelMachineConfiguration } from './types'

const Schema = mongoose.Schema

const serializeMachineConfiguration = (machineConfiguration: IModelMachineConfiguration): IMachineConfiguration => ({
  id: machineConfiguration._id as unknown as string,
  ingredient: machineConfiguration.ingredient as unknown as string,
  slot: machineConfiguration.slot,
  measureVolume: machineConfiguration.measure_volume
})

const serializeMachineConfigurations = (machineConfigurations: IModelMachineConfiguration[]): IMachineConfiguration[] => {
  return machineConfigurations.map(machineConfiguration => serializeMachineConfiguration(machineConfiguration))
}

const deSerializeMachineConfiguration = (machineConfiguration: IMachineConfiguration): IModelMachineConfiguration => ({
  _id: new ObjectId(machineConfiguration.id),
  ingredient: machineConfiguration.ingredient as unknown as ObjectId,
  slot: machineConfiguration.slot,
  measure_volume: machineConfiguration.measureVolume
})

const deSerializeMachineConfigurations = (machineConfigurations: IMachineConfiguration[]): IModelMachineConfiguration[] => {
  return machineConfigurations.map(machineConfiguration => deSerializeMachineConfiguration(machineConfiguration))
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
  serializeMachineConfiguration,
  serializeMachineConfigurations,
  deSerializeMachineConfiguration,
  deSerializeMachineConfigurations
}
