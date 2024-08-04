import { type FastifyInstance } from 'fastify'
import SettingController from '../controllers/setting'

const setting = SettingController.getInstance()

const router = async (app: FastifyInstance): Promise<void> => {
  app.get('/v1/setting', setting.get)
  app.put('/v1/setting', setting.put)
}

export default router
