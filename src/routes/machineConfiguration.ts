import { type FastifyInstance } from 'fastify'
import { MachineConfigurationController } from '../controllers'

const machineConfiguration = MachineConfigurationController.getInstance()

const router = async (app: FastifyInstance): Promise<void> => {
  app.get('/v1/machine-configurations', machineConfiguration.get)
  app.put('/v1/machine-configuration/:id', machineConfiguration.put)
}

export default router
