import type fs from 'fs'

export interface ImageObject {
  type: string
  fieldname: string
  filename: string
  encoding: string
  mimetype: string
  file: fs.ReadStream
  fields: any
  // _buf: any
  toBuffer: () => Promise<Buffer>
}

export interface IFile {
  id: string
  name: string
  path: string
  createdAt: Date
  updatedAt: Date
}
