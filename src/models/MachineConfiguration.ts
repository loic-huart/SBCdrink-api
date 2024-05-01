import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import { type IMachineConfiguration } from '../services/machineConfiguration/types'
import { type IModelIngredient, type IModelMachineConfiguration } from './types'
import { deSerializeIngredient, serializeIngredient } from './Ingredient'
import { type IIngredient } from '../services/ingredient/types'

const Schema = mongoose.Schema

const serializeMachineConfiguration = (machineConfiguration: IModelMachineConfiguration, withIngredients = false): IMachineConfiguration => {
  let ingredient = null

  if (machineConfiguration.ingredient !== null) {
    if (withIngredients) {
      ingredient = serializeIngredient(machineConfiguration.ingredient as IModelIngredient)
    } else {
      ingredient = (machineConfiguration.ingredient as ObjectId).toString()
    }
  }

  return ({
    id: machineConfiguration._id.toString(),
    ingredient,
    slot: machineConfiguration.slot,
    measureVolume: machineConfiguration.measure_volume
  })
}

const serializeMachineConfigurations = (machineConfigurations: IModelMachineConfiguration[], withIngredients = false): IMachineConfiguration[] => {
  return machineConfigurations.map(machineConfiguration => serializeMachineConfiguration(machineConfiguration, withIngredients))
}

const deSerializeMachineConfiguration = (machineConfiguration: IMachineConfiguration, withIngredients = false): IModelMachineConfiguration => {
  let ingredient = null

  if (machineConfiguration.ingredient !== null) {
    if (withIngredients) {
      ingredient = deSerializeIngredient(machineConfiguration.ingredient as IIngredient)
    } else {
      ingredient = new ObjectId(machineConfiguration.ingredient as string)
    }
  }

  return ({
    _id: new ObjectId(machineConfiguration.id),
    ingredient,
    slot: machineConfiguration.slot,
    measure_volume: machineConfiguration.measureVolume
  })
}

const deSerializeMachineConfigurations = (machineConfigurations: IMachineConfiguration[], withIngredients = false): IModelMachineConfiguration[] => {
  return machineConfigurations.map(machineConfiguration => deSerializeMachineConfiguration(machineConfiguration, withIngredients))
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
    nullable: true
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
