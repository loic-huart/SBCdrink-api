import { type IFile } from '../services/file/types'
import { type IModelFile } from './types'
import { PrismaClient } from '@prisma/client'

const serializeFile = (file: IModelFile | null): IFile | null => {
  if (file == null) return null
  return ({
    id: file.id,
    name: file.name,
    path: file.path,
    createdAt: file.created_at,
    updatedAt: file.updated_at
  })
}

const serializeFiles = (files: Array<IModelFile | null>): Array<IFile | null> => {
  return files.map(file => serializeFile(file))
}

const deSerializeFile = (file: IFile | null): IModelFile | null => {
  if (file == null) return null
  return ({
    id: file.id,
    name: file.name,
    path: file.path,
    created_at: file.createdAt,
    updated_at: file.updatedAt
  })
}

const deSerializeFiles = (files: Array<IFile | null>): Array<IModelFile | null> => {
  return files.map(file => deSerializeFile(file))
}

const File = new PrismaClient().file

export default File
export {
  serializeFile,
  serializeFiles,
  deSerializeFile,
  deSerializeFiles
}
