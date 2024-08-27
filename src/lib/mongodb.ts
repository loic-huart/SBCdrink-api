import { MongoClient } from 'mongodb'
import { dbConfig } from '../configs/configs'

const dbConnect = async (): Promise<MongoClient> => {
  const { databaseUrl } = dbConfig

  // Créer un client MongoDB natif
  const mongoClient = new MongoClient(databaseUrl)

  // Se connecter au client MongoDB
  await mongoClient.connect()

  console.log('Connected to database sucessfully')
  return mongoClient
}

export default dbConnect
