import { type FastifyReply, type FastifyRequest } from 'fastify'
import MachineService from '../services/machine/machine'
import mapErrorTypeToHttpCode from '../utils/mapErrorTypeToHttpCode'
import { type IOrder } from '../services/order/types'

interface IMachineController {
  directMakeCocktail: (req: FastifyRequest, res: FastifyReply) => Promise<void>
}

class MachineController implements IMachineController {
  private static instance: MachineController

  public static getInstance (): MachineController {
    if (MachineController.instance === undefined) {
      MachineController.instance = new MachineController()
    }

    return MachineController.instance
  }

  public async directMakeCocktail (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const machineService = MachineService.getInstance()
      const {
        response,
        error
      } = await machineService.makeCocktail(req.body as IOrder)
      if (error != null) {
        const httpCode = mapErrorTypeToHttpCode(error.errorType)
        await res.status(httpCode).send(error)
        return
      }
      await res.status(201).send(response)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }
}

export default MachineController
