import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../../.env') })

type Config = Record<string, string>

enum Environment {
  dbHost = 'DB_HOST',
  dbUser = 'DB_USER',
  dbPass = 'DB_PASS',
  dbPort = 'DB_PORT',
  dbName = 'DB_NAME',
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

export const dbConfig = getEnvVariables([
  'dbHost',
  'dbUser',
  'dbPass',
  'dbPort',
  'dbName'
])

export const scriptConfig = getEnvVariables([
  'scriptHost',
  'scriptPort'
])
