import { type IPayloadFindMachineConfigurations, type IMachineConfiguration } from './types'
import ErrorService from '../errors/errors'
import MachineConfiguration, { deSerializeMachineConfiguration, serializeMachineConfiguration, serializeMachineConfigurations } from '../../models/MachineConfiguration'
import { Slug, type Error } from '../errors/types'
import { updatePayloadValidation } from './validators'
import { mongoClient } from '../..'
import { Recipe } from '../../models'

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
    const collectionMachineConfiguration = mongoClient.db().collection('machineConfiguration')
    const watchMachineConfiguration = collectionMachineConfiguration.watch(
      [],
      { fullDocument: 'updateLookup' }
    )
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    watchMachineConfiguration.on('change', async (change: any): Promise<void> => {
      // TODO: passer mongodb en version 6 pour pouvoir ajouter 'fullDocumentBeforeChange' au watch
      // et refactor cett fonction pour ne pas parcourir toute les recipe toutes le temps
      // iniquement parcourit les recipe qui continnent l'ancien ingredient et le nouveau
      // CONTRE TODO: la version 6 n'est pas suporté sur raspberry

      console.log('CHANGE', change)

      switch (change.operationType) {
        case 'update': {
          if (change?.documentKey?._id == null) break
          const machineChangeId = change?.documentKey?._id

          // console.info('Watch machineConfiguration', machineChangeId, 'updated')

          const machineConfiguration = await MachineConfiguration.findMany()

          const ingredientsAllowed = machineConfiguration
            .filter(mc => (mc.measure_volume != null) && (mc.ingredient_id != null))
            .map(mc => (mc.ingredient_id) as string)

          const recipesToUpdate = await Recipe.findMany({
            where: {
              steps: {
                every: {
                  ingredient: {
                    id: { in: ingredientsAllowed }
                  }
                }
              }
            },
            include: {
              steps: {
                include: {
                  ingredient: true
                }
              }
            }
          })

          // set toutes les recipes qui contiennent les ingredients a available
          const recipeIdsToUpdate = recipesToUpdate.map(recipe => recipe.id)
          const recipeAvailable = await Recipe.updateMany({
            where: {
              id: {
                in: recipeIdsToUpdate
              }
            },
            data: {
              is_available: true
            }
          })

          // set toutes les recipes qui ne contiennent pas les ingredients a not available
          const recipeIdsToExclude = recipesToUpdate.map(recipe => recipe.id)
          const recipeNotAvailable = await Recipe.updateMany({
            where: {
              id: {
                notIn: recipeIdsToExclude
              }
            },
            data: {
              is_available: false
            }
          })

          // @ts-ignore
          const recipeUpdated = [...recipeAvailable, ...recipeNotAvailable].map(recipeUp => recipeUp.id).join(',')

          console.info('Watch machineConfiguration', machineChangeId, 'updated recipe', recipeUpdated)

          break
        }
        default:
          break
      }
    })
  }

  public async find ({ withIngredients }: IPayloadFindMachineConfigurations): Promise<{ machineConfigurations: IMachineConfiguration[] }> {
    const machineConfigurations = await MachineConfiguration.findMany({
      orderBy: {
        slot: 'asc'
      },
      include: {
        ingredient: withIngredients
      }
    })

    return {
      // @ts-ignore
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

    const findMachineConfiguration = await MachineConfiguration.findUnique({ where: { id } })
    if (findMachineConfiguration == null) {
      return {
        machineConfiguration: {} as IMachineConfiguration,
        error: this.NewNotFoundError('MachineConfiguration not found', Slug.ErrMachineConfigurationNotFound)
      }
    }

    const { ingredient_id, measure_volume, slot } = deSerializeMachineConfiguration(machineConfiguration, false)

    const newMachineConfiguration = await MachineConfiguration.update({
      where: {
        id: findMachineConfiguration.id
      },
      data: {
        ingredient_id,
        measure_volume,
        slot
      }
    })

    return {
      machineConfiguration: serializeMachineConfiguration(newMachineConfiguration, false)
    }
  }
}

export default MachineConfigurationService
