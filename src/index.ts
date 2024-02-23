import Fastify, { type FastifyInstance } from 'fastify'
import { checkEnvVariables } from './configs/configs'
import dbConnect from './lib/mongoose'
import routes from './routes'

async function run (): Promise<any> {
  // Check environment variables
  await checkEnvVariables()

  // Connect to database
  await dbConnect()

  const app: FastifyInstance = Fastify({
    logger: true
  })

  // Routes
  void app.register(routes)

  await app.listen({ port: 3000, host: '0.0.0.0' })
    .then((address) => console.log(`server listening on ${address}`))
    .catch(err => {
      console.log('Error starting server:', err)
      process.exit(1)
    })
}

void run()
