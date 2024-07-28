import { type FastifyReply, type FastifyRequest } from 'fastify'
import mapErrorTypeToHttpCode from '../utils/mapErrorTypeToHttpCode'
import { type IService } from './service'

interface IController {
  get: (req: FastifyRequest, res: FastifyReply) => Promise<void>
  getById: (req: FastifyRequest, res: FastifyReply) => Promise<void>
  post: (req: FastifyRequest, res: FastifyReply) => Promise<void>
  put: (req: FastifyRequest, res: FastifyReply) => Promise<void>
  delete: (req: FastifyRequest, res: FastifyReply) => Promise<void>
}

class Controller implements IController {
  private static instance: Controller
  private static service: IService<any>

  public static getInstance (): IController {
    if (Controller.instance === undefined) {
      Controller.instance = new Controller()
    }

    return Controller.instance
  }

  public static setService<U>(service: IService<U>): void {
    Controller.service = service
  }

  public async get (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const serviceInstance = Controller.service.getInstance()
      const {
        sort
      } = req.query as { sort: 'desc' | 'asc' }
      const { datas } = await serviceInstance.find({ sort })
      await res.status(200).send(datas)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }

  public async getById (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const serviceInstance = Controller.service.getInstance()
      const { id } = req.params as { id: string }
      const {
        data,
        error
      } = await serviceInstance.findById({ id })
      if (error != null) {
        const httpCode = mapErrorTypeToHttpCode(error.errorType)
        await res.status(httpCode).send(error)
        return
      }

      await res.status(200).send(data)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }

  public async post (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const serviceInstance = Controller.service.getInstance()
      const {
        data,
        error
      } = await serviceInstance.create(req.body)
      if (error != null) {
        const httpCode = mapErrorTypeToHttpCode(error.errorType)
        await res.status(httpCode).send(error)
        return
      }
      await res.status(201).send(data)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }

  public async put (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const serviceInstance = Controller.service.getInstance()
      const { id } = req.params as { id: string }
      const {
        data,
        error
      } = await serviceInstance.update(id, req.body)
      if (error != null) {
        const httpCode = mapErrorTypeToHttpCode(error.errorType)
        await res.status(httpCode).send(error)
        return
      }
      await res.status(200).send(data)
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }

  public async delete (req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const serviceInstance = Controller.service.getInstance()
      const { id } = req.params as { id: string }
      const { error } = await serviceInstance.delete(id)
      if (error != null) {
        const httpCode = mapErrorTypeToHttpCode(error.errorType)
        await res.status(httpCode).send(error)
        return
      }
      await res.status(204).send()
    } catch (error: unknown) {
      await res.status(500).send(error)
    }
  }
}

export default Controller
