import { type ObjectId } from 'mongoose'
import { deSerialize, serialize, serializes } from './serialize'
import ErrorService from '../services/errors/errors'
import { type Error, Slug } from '../services/errors/types'
import { createPayloadValidation, findByIdPayloadValidation, updatePayloadValidation } from './validators'

export interface IPayloadFind {
  sort: 'asc' | 'desc'
}

export interface IPayloadFindById {
  id: string
}

export interface IModel {
  _id: ObjectId
}

export interface IService<T> extends ErrorService {
  getInstance: () => IService<T>
  find: ({ sort }: IPayloadFind) => Promise<{ datas: T[] }>
  findById: ({ id }: IPayloadFindById) => Promise<{ data: T, error?: Error }>
  create: (data: T) => Promise<{ data: T, error?: Error }>
  update: (id: string, data: T) => Promise<{ data: T, error?: Error }>
  delete: (id: string) => Promise<{ error?: Error }>
}

class Service<T> extends ErrorService implements IService<T> {
  private static instance: Service<any>
  private static model: any

  public static getInstance<T>(): IService<T> {
    if (Service.instance === undefined) {
      Service.instance = new Service<T>()
    }

    return Service.instance
  }

  public static setModel<U>(model: U): void {
    Service.model = model
  }

  public async find ({ sort }: IPayloadFind): Promise<{ datas: T[] }> {
    const datas = await Service.model.find().sort({ updated_at: sort === 'desc' ? -1 : 1 })
    return {
      datas: serializes<T, typeof Service.model>(datas as T[])
    }
  }

  public async findById ({ id }: IPayloadFindById): Promise<{ data: T, error?: Error }> {
    const { error } = findByIdPayloadValidation({ id })
    if (error != null) {
      return {
        data: {} as T,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }
    const data = await Service.model.findById(id)
    if (data == null) {
      return {
        data: {} as T,
        error: this.NewNotFoundError('Data not found', Slug.ErrDataNotFound)
      }
    }

    return {
      data: serialize<T, typeof Service.model>(data as T)
    }
  }

  public async create (data: T): Promise<{ data: T, error?: Error }> {
    const { error } = createPayloadValidation<T>(data)
    if (error != null) {
      return {
        data: {} as T,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }

    const newData = new Service.model(deSerialize<typeof Service.model, T>(data))
    await newData.save()

    return {
      data: serialize<T, typeof Service.model>(newData as T)
    }
  }

  public async update (id: string, data: T): Promise<{ data: T, error?: Error }> {
    const { error } = updatePayloadValidation<T>(data)
    if (error != null) {
      return {
        data: {} as T,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }

    let findData = await Service.model.findById(id)
    if (findData == null) {
      return {
        data: {} as T,
        error: this.NewNotFoundError('Data not found', Slug.ErrIngredientNotFound)
      }
    }

    // const { alcohol_degree, is_alcohol, name, viscosity } = deSerialize<typeof Service.model, T>(data)
    // findData.name = name
    // findData.is_alcohol = is_alcohol
    // findData.alcohol_degree = alcohol_degree
    // findData.viscosity = viscosity

    findData = deSerialize<typeof Service.model, T>(data)

    const newData = await findData.save()

    return {
      data: serialize<T, typeof Service.model>(newData as T)
    }
  }

  public async delete (id: string): Promise<{ error?: Error }> {
    const findData = await Service.model.findById(id)
    if (findData == null) {
      return {
        error: this.NewNotFoundError('Data not found', Slug.ErrIngredientNotFound)
      }
    }

    await findData.deleteOne()

    return {}
  }
}

export default Service
