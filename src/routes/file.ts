import { type FastifyInstance } from 'fastify'
import FileController from '../controllers/file'
import fs from 'fs'
import util from 'node:util'
import { pipeline } from 'node:stream'
const pump = util.promisify(pipeline)

const file = FileController.getInstance()

const router = async (app: FastifyInstance): Promise<void> => {
  app.post('/v1/file', file.post)
}

export default router
