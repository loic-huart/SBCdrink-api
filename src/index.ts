import Fastify, { type FastifyInstance } from 'fastify'
import { checkEnvVariables } from './configs/configs'
import dbConnect from './lib/mongoose'
import routes from './routes'
import cors from '@fastify/cors'

async function run (): Promise<any> {
  // Check environment variables
  await checkEnvVariables()

  // Connect to database
  await dbConnect()

  const app: FastifyInstance = Fastify({
    logger: true
  })
  await app.register(cors, {
    origin: '*'
    // origin: (origin, cb) => {
    //   // @ts-expect-error origin is a string
    //   const hostname = new URL(origin).hostname
    //   if (hostname === 'localhost') {
    //     //  Request from localhost will pass
    //     cb(null, true)
    //     return
    //   }
    //   // Generate an error on other origins, disabling access
    //   cb(new Error('Not allowed'), false)
    // }
  })

  // Routes
  void app.register(routes, { prefix: '/api' })

  await app.listen({ port: 8000, host: '0.0.0.0' })
    .then((address) => { console.log(`server listening on ${address}`) })
    .catch(err => {
      console.log('Error starting server:', err)
      process.exit(1)
    })
}

void run()
