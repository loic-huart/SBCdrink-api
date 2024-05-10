import { type FastifyInstance } from 'fastify'
import FileController from '../controllers/file'

const file = FileController.getInstance()

const router = async (app: FastifyInstance): Promise<void> => {
  app.post('/v1/file', file.post)
  app.put('/v1/file/:id', file.put)
}

export default router
