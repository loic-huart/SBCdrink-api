import mongoose from 'mongoose'
import { dbConfig } from '../configs/configs'

const dbConnect = async (): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    const { dbHost, dbUser, dbPass, dbPort, dbName } = dbConfig

    const dbUrl = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`

    const connectionParams: mongoose.ConnectOptions = {
      authSource: 'admin'
    }

    void mongoose.connect(dbUrl, connectionParams)

    mongoose.connection.on('connected', () => {
      console.log('Connected to database sucessfully')
      resolve()
    })

    mongoose.connection.on('error', (err: string) => {
      console.log(`Error while connecting to database : ${err}`)
      reject(err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('Mongodb connection disconnected')
    })
  })
}

export default dbConnect
