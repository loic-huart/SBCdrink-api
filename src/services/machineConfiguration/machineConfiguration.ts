import { type IMachineConfiguration } from './types'
import ErrorService from '../errors/errors'
import MachineConfiguration, { deSerializeMachineConfiguration, serializeMachineConfiguration, serializeMachineConfigurations } from '../../models/MachineConfiguration'
import { Slug, type Error } from '../errors/types'
import { updatePayloadValidation } from './validators'

interface IMachineConfigurationService extends ErrorService {
  find: () => Promise<{ machineConfigurations: IMachineConfiguration[] }>
  update: (id: string, machineConfiguration: IMachineConfiguration) => Promise<{ machineConfiguration: IMachineConfiguration, error?: Error }>
}

class MachineConfigurationService extends ErrorService implements IMachineConfigurationService {
  private static instance: MachineConfigurationService

  public static getInstance (): MachineConfigurationService {
    if (MachineConfigurationService.instance === undefined) {
      MachineConfigurationService.instance = new MachineConfigurationService()
    }

    return MachineConfigurationService.instance
  }

  public async find (): Promise<{ machineConfigurations: IMachineConfiguration[] }> {
    const machineConfigurations = await MachineConfiguration.find().sort({ slot: 1 })
    return {
      machineConfigurations: serializeMachineConfigurations(machineConfigurations)
    }
  }

  public async update (id: string, machineConfiguration: IMachineConfiguration): Promise<{ machineConfiguration: IMachineConfiguration, error?: Error }> {
    const { error } = updatePayloadValidation(machineConfiguration)
    if (error != null) {
      return {
        machineConfiguration: {} as IMachineConfiguration,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }

    const findMachineConfiguration = await MachineConfiguration.findById(id)
    if (findMachineConfiguration == null) {
      return {
        machineConfiguration: {} as IMachineConfiguration,
        error: this.NewNotFoundError('MachineConfiguration not found', Slug.ErrMachineConfigurationNotFound)
      }
    }

    const { ingredient, measure_volume, slot } = deSerializeMachineConfiguration(machineConfiguration)
    findMachineConfiguration.ingredient = ingredient
    findMachineConfiguration.measure_volume = measure_volume
    findMachineConfiguration.slot = slot

    const newMachineConfiguration = await findMachineConfiguration.save()

    return {
      machineConfiguration: serializeMachineConfiguration(newMachineConfiguration)
    }
  }
}

export default MachineConfigurationService
