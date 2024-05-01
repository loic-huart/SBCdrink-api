import { type FastifyReply, type FastifyRequest } from 'fastify'
import MachineConfigurationService from '../services/machineConfiguration/machineConfiguration'
import mapErrorTypeToHttpCode from '../utils/mapErrorTypeToHttpCode'
import { type IMachineConfiguration } from '../services/machineConfiguration/types'

interface IMachineConfigurationController {
  get: (req: FastifyRequest, res: FastifyReply) => Promise<void>
  put: (req: FastifyRequest, res: FastifyReply) => Promise<void>
}

class MachineConfigurationController implements IMachineConfigurationController {
  private static instance: MachineConfigurationController

  public static getInstance (): MachineConfigurationController {
    if (MachineConfigurationController.instance === undefined) {
      MachineConfigurationController.instance = new MachineConfigurationController()
    }

    return MachineConfigurationController.instance
  }

  public async get (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const machineConfigurationService = MachineConfigurationService.getInstance()
      const { withIngredients } = req.query as { withIngredients: boolean }
      const { machineConfigurations } = await machineConfigurationService.find({ withIngredients })
      await res.status(200).send(machineConfigurations)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }

  public async put (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const machineConfigurationService = MachineConfigurationService.getInstance()
      const { id } = req.params as { id: string }
      const {
        machineConfiguration,
        error
      } = await machineConfigurationService.update(id, req.body as IMachineConfiguration)
      if (error != null) {
        const httpCode = mapErrorTypeToHttpCode(error.errorType)
        await res.status(httpCode).send(error)
        return
      }
      await res.status(200).send(machineConfiguration)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }
}

export default MachineConfigurationController
