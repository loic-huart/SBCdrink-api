import { type ISetting } from './types'
import ErrorService from '../errors/errors'
import { Slug, type Error } from '../errors/types'
import { createPayloadValidation, updatePayloadValidation } from './validators'
import Setting, { deSerializeSetting, serializeSetting } from '../../models/Setting'

interface ISettingService extends ErrorService {
  find: () => Promise<{ setting: ISetting }>
  update: (setting: ISetting) => Promise<{ setting: ISetting, error?: Error }>
}

class SettingService extends ErrorService implements ISettingService {
  private static instance: SettingService

  public readonly defaultSetting: ISetting = {
    dispenserEmptyingTime: 1,
    dispenserFillingTime: 1
  }

  public static getInstance (): SettingService {
    if (SettingService.instance === undefined) {
      SettingService.instance = new SettingService()
    }

    return SettingService.instance
  }

  public async create (setting: ISetting): Promise<{ setting: ISetting, error?: Error }> {
    const { error } = createPayloadValidation(setting)
    if (error != null) {
      return {
        setting: {} as ISetting,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }

    const newSetting = setting

    const createdSetting = await Setting.create({
      data: deSerializeSetting(newSetting)
    })

    return {
      setting: serializeSetting(createdSetting)
    }
  }

  public async findSettingOrCreate (): Promise<ISetting> {
    const findSetting = await Setting.findFirst()

    if (findSetting == null) {
      const { setting: newSetting } = await this.create(this.defaultSetting)

      return newSetting
    }

    return serializeSetting(findSetting)
  }

  public async find (): Promise<{ setting: ISetting }> {
    const findSetting = await this.findSettingOrCreate()

    return {
      setting: findSetting
    }
  }

  public async update (setting: ISetting): Promise<{ setting: ISetting, error?: Error }> {
    const { error } = updatePayloadValidation(setting)
    if (error != null) {
      return {
        setting: {} as ISetting,
        error: this.NewIncorrectInputError(error.details[0].message, Slug.ErrIncorrectInput)
      }
    }

    const findSetting = await Setting.findFirst()
    if (findSetting == null) {
      const findSetting = await this.findSettingOrCreate()

      return {
        setting: findSetting
      }
    }

    const { dispenser_emptying_time, dispenser_filling_time } = deSerializeSetting(setting)

    const updatedSetting = await Setting.update({
      where: {
        id: findSetting.id
      },
      data: {
        dispenser_emptying_time,
        dispenser_filling_time
      }
    })

    return {
      setting: serializeSetting(updatedSetting)
    }
  }
}

export default SettingService
