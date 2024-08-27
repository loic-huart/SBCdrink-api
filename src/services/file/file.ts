import { type ImageObject, type IFile } from './types'
import ErrorService from '../errors/errors'
import File, { deSerializeFile, serializeFile } from '../../models/File'
import { Slug, type Error } from '../errors/types'
import { createPayloadValidation } from './validators'
import sharp from 'sharp'
import path from 'path'

interface IFileService extends ErrorService {
  create: (fileFromRequest: ImageObject) => Promise<{ file: IFile, error?: Error }>
  update: (id: string, fileFromRequest: ImageObject) => Promise<{ file: IFile, error?: Error }>
}

class FileService extends ErrorService implements IFileService {
  private static instance: FileService

  public static getInstance (): FileService {
    if (FileService.instance === undefined) {
      FileService.instance = new FileService()
    }

    return FileService.instance
  }

  private async getImageBuffer (imageObject: ImageObject): Promise<Buffer> {
    return await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = []
      imageObject.file.on('data', (chunk: Buffer) => chunks.push(chunk))
      imageObject.file.on('end', () => {
        const buffer = Buffer.concat(chunks)
        resolve(buffer)
      })
      imageObject.file.on('error', (error: Error) => { reject(error) })
    })
  }

  private async convertAndSaveImage (imageObject: ImageObject, outputPath: string): Promise<void> {
    const imageBuffer = await this.getImageBuffer(imageObject)

    await sharp(imageBuffer)
      .webp()
      .resize(120, 200)
      .toFile(outputPath)
  }

  public async create (imageObject: ImageObject): Promise<{ file: IFile, error?: Error }> {
    const { error } = createPayloadValidation(imageObject)
    if (error != null) {
      return {
        file: {} as IFile,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }

    const newFile = {} as IFile
    const filename = newFile.id.toString()

    const outputPath: string = path.join(__dirname, `../../../public/uploads/${filename}.webp`)
    await this.convertAndSaveImage(imageObject, outputPath)

    newFile.name = filename
    newFile.path = `/uploads/${filename}.webp`
    const createdFile = await File.create({ data: deSerializeFile(newFile) as unknown as IFile })

    return {
      file: serializeFile(createdFile) as unknown as IFile
    }
  }

  public async update (id: string, imageObject: ImageObject): Promise<{ file: IFile, error?: Error }> {
    const { error } = createPayloadValidation(imageObject)
    if (error != null) {
      return {
        file: {} as IFile,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }

    const findFile = await File.findUnique({ where: { id } })
    if (findFile == null) {
      return {
        file: {} as IFile,
        error: this.NewNotFoundError('File not found', Slug.ErrFileNotFound)
      }
    }

    await File.delete({ where: { id: findFile.id } })

    const newFile = {} as IFile
    const filename = newFile.id.toString()

    const outputPath: string = path.join(__dirname, `../../../public/uploads/${filename}.webp`)

    await this.convertAndSaveImage(imageObject, outputPath)

    const updatedFile = await File.update({
      where: {
        id: newFile.id
      },
      data: {
        name: filename,
        path: `/uploads/${filename}.webp`
      }
    })

    return {
      file: serializeFile(updatedFile) as unknown as IFile
    }
  }
}

export default FileService
