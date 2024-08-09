import { type FastifyReply, type FastifyRequest } from 'fastify'
import SettingService from '../services/setting/setting'
import mapErrorTypeToHttpCode from '../utils/mapErrorTypeToHttpCode'
import { type ISetting } from '../services/setting/types'

interface ISettingController {
  get: (req: FastifyRequest, res: FastifyReply) => Promise<void>
  put: (req: FastifyRequest, res: FastifyReply) => Promise<void>
}

class SettingController implements ISettingController {
  private static instance: SettingController

  public static getInstance (): SettingController {
    if (SettingController.instance === undefined) {
      SettingController.instance = new SettingController()
    }

    return SettingController.instance
  }

  public async get (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const settingService = SettingService.getInstance()
      const { setting } = await settingService.find()
      await res.status(200).send(setting)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }

  public async put (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const settingService = SettingService.getInstance()
      const {
        setting,
        error
      } = await settingService.update(req.body as ISetting)
      if (error != null) {
        const httpCode = mapErrorTypeToHttpCode(error.errorType)
        await res.status(httpCode).send(error)
        return
      }
      await res.status(200).send(setting)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }
}

export default SettingController
