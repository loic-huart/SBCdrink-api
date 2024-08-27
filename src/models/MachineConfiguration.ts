import { type IMachineConfigurationWithIngredient, type IMachineConfiguration, type IBaseMachineConfiguration } from '../services/machineConfiguration/types'
import { type IModelMachineConfigurationWithIngredient, type IModelMachineConfiguration, type IModelMachineConfigurationBase } from './types'
import { deSerializeIngredient, serializeIngredient } from './Ingredient'
import { PrismaClient } from '@prisma/client'

function serializeMachineConfiguration (machineConfiguration: IModelMachineConfiguration, withIngredients: false): IMachineConfiguration
function serializeMachineConfiguration (machineConfiguration: IModelMachineConfigurationWithIngredient, withIngredients: true): IMachineConfigurationWithIngredient
function serializeMachineConfiguration (
  machineConfiguration: IModelMachineConfiguration | IModelMachineConfigurationWithIngredient,
  withIngredients: boolean = false
): IMachineConfiguration | IMachineConfigurationWithIngredient {
  const baseMachineConfiguration: IBaseMachineConfiguration = {
    id: machineConfiguration.id,
    measureVolume: machineConfiguration.measure_volume,
    slot: machineConfiguration.slot,
    ingredientId: machineConfiguration.ingredient_id
  }

  const ingredient = (machineConfiguration as IModelMachineConfigurationWithIngredient).ingredient

  if (withIngredients) {
    return {
      ...baseMachineConfiguration,
      ingredient: ingredient != null ? serializeIngredient(ingredient) : null
    } as IMachineConfigurationWithIngredient
  } else {
    return {
      ...baseMachineConfiguration
    }
  }
}

function serializeMachineConfigurations (machineConfigurations: IModelMachineConfiguration[], withIngredients: false): IMachineConfiguration[]
function serializeMachineConfigurations (machineConfigurations: IModelMachineConfigurationWithIngredient[], withIngredients: true): IMachineConfigurationWithIngredient[]
function serializeMachineConfigurations (
  machineConfigurations: IModelMachineConfiguration[] | IModelMachineConfigurationWithIngredient[],
  withIngredients: boolean = false
): IMachineConfiguration[] | IMachineConfigurationWithIngredient[] {
  // @ts-ignore
  return machineConfigurations.map(machineConfiguration => serializeMachineConfiguration(machineConfiguration, withIngredients))
}

function deSerializeMachineConfiguration (machineConfiguration: IMachineConfiguration, withIngredients: false): IModelMachineConfiguration
function deSerializeMachineConfiguration (machineConfiguration: IMachineConfigurationWithIngredient, withIngredients: true): IModelMachineConfigurationWithIngredient
function deSerializeMachineConfiguration (
  machineConfiguration: IMachineConfiguration | IMachineConfigurationWithIngredient,
  withIngredients: boolean = false
): IModelMachineConfiguration | IModelMachineConfigurationWithIngredient {
  const baseMachineConfiguration: IModelMachineConfigurationBase = {
    id: machineConfiguration.id,
    measure_volume: machineConfiguration.measureVolume,
    slot: machineConfiguration.slot,
    ingredient_id: machineConfiguration.ingredientId
  }

  const ingredient = (machineConfiguration as IMachineConfigurationWithIngredient).ingredient

  if (withIngredients) {
    return {
      ...baseMachineConfiguration,
      ingredient: ingredient != null
        ? deSerializeIngredient(ingredient)
        : null
    }
  } else {
    return {
      ...baseMachineConfiguration
    }
  }
}

function deSerializeMachineConfigurations (machineConfigurations: IMachineConfiguration[], withIngredients: false): IModelMachineConfiguration[]
function deSerializeMachineConfigurations (machineConfigurations: IMachineConfigurationWithIngredient[], withIngredients: true): IModelMachineConfigurationWithIngredient[]
function deSerializeMachineConfigurations (
  machineConfigurations: IMachineConfiguration[] | IMachineConfigurationWithIngredient[],
  withIngredients: boolean = false
): IModelMachineConfiguration[] | IModelMachineConfigurationWithIngredient[] {
  // @ts-ignore
  return machineConfigurations.map(machineConfiguration => deSerializeMachineConfiguration(machineConfiguration, withIngredients))
}

const MachineConfiguration = new PrismaClient().machineconfiguration

export default MachineConfiguration
export {
  serializeMachineConfiguration,
  serializeMachineConfigurations,
  deSerializeMachineConfiguration,
  deSerializeMachineConfigurations
}
