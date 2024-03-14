import { type FastifyInstance } from 'fastify'
import { MachineController } from '../controllers'

const machine = MachineController.getInstance()

const router = async (app: FastifyInstance): Promise<void> => {
  app.post('/v1/machine/direct-make-cocktail', machine.directMakeCocktail)
}

export default router
