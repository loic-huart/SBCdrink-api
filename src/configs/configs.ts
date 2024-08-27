import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'

dotenvConfig({ path: resolve(__dirname, '../../.env') })

type Config = Record<string, string>

enum Environment {
  apiHost = 'API_HOST',
  apiPort = 'API_PORT',
  databaseUrl = 'DATABASE_URL',
  scriptHost = 'SCRIPT_HOST',
  scriptPort = 'SCRIPT_PORT'
}

type EnvironmentKey = keyof typeof Environment

export const checkEnvVariables = async (): Promise<void> => {
  Object.values(Environment).forEach((envVariable) => {
    // eslint-disable-next-line eqeqeq
    if (process.env[envVariable] == null) {
      throw new Error(`Missing environment variable: ${envVariable}`)
    }
  })
}

export const getEnvVariables = (envList: EnvironmentKey[]): Config => {
  const envVariables = envList.reduce((acc: Config, key: EnvironmentKey) => {
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    acc[key] = process.env[Environment[key]] as string
    return acc
  }, {})
  return envVariables
}

export const apiConfig = getEnvVariables([
  'apiHost',
  'apiPort'
])

export const dbConfig = getEnvVariables([
  'databaseUrl'
])

export const scriptConfig = getEnvVariables([
  'scriptHost',
  'scriptPort'
])
