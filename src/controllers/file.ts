import { type FastifyReply, type FastifyRequest } from 'fastify'
import FileService from '../services/file/file'
import mapErrorTypeToHttpCode from '../utils/mapErrorTypeToHttpCode'
import { type ImageObject } from '../services/file/types'

interface IFileController {
  post: (req: FastifyRequest, res: FastifyReply) => Promise<void>
}

class FileController implements IFileController {
  private static instance: FileController

  public static getInstance (): FileController {
    if (FileController.instance === undefined) {
      FileController.instance = new FileController()
    }

    return FileController.instance
  }

  public async post (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const fileService = FileService.getInstance()

      // @ts-expect-error file is a ImageObject
      const fileFromRequest = await req.file() as ImageObject

      const {
        file,
        error
      } = await fileService.create(fileFromRequest)
      if (error != null) {
        const httpCode = mapErrorTypeToHttpCode(error.errorType)
        await res.status(httpCode).send(error)
        return
      }
      await res.status(201).send(file)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }
}

export default FileController
