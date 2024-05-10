import { type IPayloadFindMachineConfigurations, type IMachineConfiguration } from './types'
import ErrorService from '../errors/errors'
import MachineConfiguration, { deSerializeMachineConfiguration, serializeMachineConfiguration, serializeMachineConfigurations } from '../../models/MachineConfiguration'
import { Slug, type Error } from '../errors/types'
import { updatePayloadValidation } from './validators'
import { IModelMachineConfiguration } from '../../models/types'
import Recipe from '../../models/Recipe'

interface IMachineConfigurationService extends ErrorService {
  find: ({ withIngredients }: IPayloadFindMachineConfigurations) => Promise<{ machineConfigurations: IMachineConfiguration[] }>
  update: (id: string, machineConfiguration: IMachineConfiguration) => Promise<{ machineConfiguration: IMachineConfiguration, error?: Error }>
}

class MachineConfigurationService extends ErrorService implements IMachineConfigurationService {
  private static instance: MachineConfigurationService

  private constructor () {
    super()
    this.watch()
  }

  public static getInstance (): MachineConfigurationService {
    if (MachineConfigurationService.instance === undefined) {
      MachineConfigurationService.instance = new MachineConfigurationService()
    }

    return MachineConfigurationService.instance
  }

  public watch (): void {
    const watchMachineConfiguration = MachineConfiguration.watch(
      [],
      { fullDocument: 'updateLookup' }
    )
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    watchMachineConfiguration.on('change', async (change): Promise<void> => {
      // TODO: passer mongodb en version 6 pour pouvoir ajouter 'fullDocumentBeforeChange' au watch
      // et refactor cett fonction pour ne pas parcourir toute les recipe toutes le temps
      // iniquement parcourit les recipe qui continnent l'ancien ingredient et le nouveau
      switch (change.operationType) {
        case 'update': {
          if (change?.documentKey?._id == null) break
          const machineChangeId = change?.documentKey?._id

          console.info('Watch machineConfiguration', machineChangeId, 'updated')

          const machineConfiguration = await MachineConfiguration.find()

          const ingredientsAllowed = machineConfiguration
            .filter(mc => (mc.measure_volume != null) && (mc.ingredient != null))
            .map(mc => mc.ingredient)

          // toute les recipes qui contiennent les ingredients
          const recipesToUpdate = await Recipe.find({
            steps: {
              $not: {
                $elemMatch: {
                  ingredient: { $nin: ingredientsAllowed }
                }
              }
            }
          })

          // set toutes les recipes qui contiennent les ingredient a available
          const recipeAvailable = await Recipe.updateMany(
            {
              _id: { $in: recipesToUpdate.map(recipe => recipe._id) }
            },
            { $set: { is_available: true } }
          ).find()

          // set toutes les recipes qui ne contiennent pas les ingredient a not available
          const recipeNotAvailable = await Recipe.updateMany(
            {
              _id: { $nin: recipesToUpdate.map(recipe => recipe._id) }
            },
            { $set: { is_available: false } }
          ).find()

          const recipeUpdated = [...recipeAvailable, ...recipeNotAvailable].map(recipeUp => recipeUp._id).join(',')

          console.info('Watch machineConfiguration', machineChangeId, 'updated recipe', recipeUpdated)

          break
        }
        default:
          break
      }
    })
  }

  public async find ({ withIngredients }: IPayloadFindMachineConfigurations): Promise<{ machineConfigurations: IMachineConfiguration[] }> {
    const machineConfigurations = await MachineConfiguration.find()
      .populate(withIngredients ? 'ingredient' : '')
      .sort({ slot: 1 })

    return {
      machineConfigurations: serializeMachineConfigurations(machineConfigurations, withIngredients)
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
