import Fastify, { type FastifyInstance } from 'fastify'
import { apiConfig, checkEnvVariables } from './configs/configs'
import dbConnect from './lib/mongoose'
import routes from './routes'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import path from 'path'
import fastifyMultipart from '@fastify/multipart'

const { apiPort, apiHost } = apiConfig

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

  await app.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/public/' // optional: default '/'
    // constraints: { host: 'example.com' } // optional: default {}
  })

  await app.register(fastifyMultipart)

  // Routes
  void app.register(routes, { prefix: '/api' })

  // @ts-expect-error apiPort or apiHost can be undefiend
  await app.listen({ port: apiPort, host: apiHost })
    .then((address) => { console.log(`server listening on ${address}`) })
    .catch(err => {
      console.log('Error starting server:', err)
      process.exit(1)
    })
}

void run()
