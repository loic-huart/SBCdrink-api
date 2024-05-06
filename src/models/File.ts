import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import { type IFile } from '../services/file/types'
import { type IModelFile } from './types'

const Schema = mongoose.Schema

const serializeFile = (file: IModelFile): IFile => ({
  id: file._id.toString(),
  name: file.name,
  path: file.path,
  createdAt: file.created_at,
  updatedAt: file.updated_at
})

const serializeFiles = (files: IModelFile[]): IFile[] => {
  return files.map(file => serializeFile(file))
}

const deSerializeFile = (file: IFile): IModelFile => ({
  _id: new ObjectId(file.id),
  name: file.name,
  path: file.path,
  created_at: file.createdAt,
  updated_at: file.updatedAt
})

const deSerializeFiles = (files: IFile[]): IModelFile[] => {
  return files.map(file => deSerializeFile(file))
}

const fileSchema = new Schema<IModelFile>({
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const File = mongoose.model('File', fileSchema)

export default File
export {
  serializeFile,
  serializeFiles,
  deSerializeFile,
  deSerializeFiles
}
