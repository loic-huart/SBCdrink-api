import { loadPackageDefinition, credentials } from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'
import ErrorService from '../errors/errors'
import path from 'path'
import { Slug, type Error } from '../errors/types'
import { type IMachineStep } from './types'
import { scriptConfig } from '../../configs/configs'
import { directMakeCocktailPayloadValidation } from './validators'
import { type IOrder, type IOrderMakeCocktail } from '../order/types'
import { MachineConfiguration } from '../../models'
import Setting from '../../models/Setting'
const PROTO_PATH = path.join(__dirname, '/protos/machine.proto')

interface IMachineService extends ErrorService {
  makeCocktail: (order: IOrderMakeCocktail) => Promise<{ response: boolean, error?: Error }>
  orderToMachineSteps: (order: IOrder) => Promise<IMachineStep[]>
}

class MachineService extends ErrorService implements IMachineService {
  private static instance: MachineService

  private readonly client: any

  private constructor () {
    super()
    // Suggested options for similarity to existing grpc.load behavior
    const packageDefinition = loadSync(
      PROTO_PATH,
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      }
    )
    const machine: any = loadPackageDefinition(packageDefinition).machine
    this.client = new machine.Machine(
      `${scriptConfig.scriptHost}:${scriptConfig.scriptPort}`,
      credentials.createInsecure()
    )
  }

  public static getInstance (): MachineService {
    if (MachineService.instance === undefined) {
      MachineService.instance = new MachineService()
    }

    return MachineService.instance
  }

  public async orderToMachineSteps (order: Partial<IOrder>): Promise<IMachineStep[]> {
    if (order.steps === null || order.steps === undefined) return []

    const allMachineConfigurations = await MachineConfiguration.find()

    const setting = await Setting.findOne()
    const dispenserEmptyingTime = setting?.dispenser_emptying_time ?? 1
    const dispenserFillingTime = setting?.dispenser_filling_time ?? 1

    const machineSteps: IMachineStep[] = []

    order.steps.forEach((step) => {
      const targetMachineConfiguration = allMachineConfigurations.find((machineConfiguration) => machineConfiguration?.ingredient?._id.toString() === step?.ingredient?.id)

      let remainingQuantity = step.quantity
      const slot = targetMachineConfiguration?.slot
      const measure_volume = targetMachineConfiguration?.measure_volume ?? 0

      let index = 0
      while (remainingQuantity > 0) {
        index++
        const pressed = Math.min(remainingQuantity, measure_volume)
        machineSteps.push({
          stepId: `${step.id}-${index}`,
          slot: slot ?? 0,
          pressed: pressed * dispenserEmptyingTime * step.ingredient.viscosity,
          delayAfter: (remainingQuantity - measure_volume > 0 ? (dispenserFillingTime * measure_volume) : 0.5)
          // TODO: passer les position des step dans la collection setting ou machineconfiguration, et envoyer la position du slot dans le machineStep
          // TODO: add dans le front, dans settings, la possibilité des deffinir la position des slots,
          // et de faire bouger la chariot a un slot defini, pour reglé plus facilement la machine
        })
        remainingQuantity -= measure_volume
      }
    })

    return machineSteps
  }

  public async makeCocktail (orderMakeCocktail: IOrderMakeCocktail): Promise<{ response: boolean, error?: Error }> {
    const { error } = directMakeCocktailPayloadValidation(orderMakeCocktail)
    if (error != null) {
      return {
        response: false,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }

    const machineSteps = await this.orderToMachineSteps(orderMakeCocktail)
    console.info('Call machine script with steps:', machineSteps)

    const response = await new Promise<{ response: boolean, error?: Error | undefined }>((resolve) => {
      return this.client.makeCocktail({
        steps: JSON.stringify(machineSteps)
      }, (err: any, response: any) => {
        // eslint-disable-next-line no-extra-boolean-cast
        if (Boolean(err)) {
          console.error('Machine script error:', err)
          resolve({
            response: false,
            error: this.NewUnknowError('Machine script error', Slug.ErrUnknow)
          })
        } else {
          resolve({
            response: true
          })
        }
      })
    })

    return response
  }
}

export default MachineService
