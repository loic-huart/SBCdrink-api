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
    timeForOneQuantity: 1
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

    const newSetting = new Setting(deSerializeSetting(setting))
    await newSetting.save()

    return {
      setting: serializeSetting(newSetting)
    }
  }

  public async findSettingOrCreate (): Promise<ISetting> {
    const findSetting = await Setting.findOne()
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

    const findSetting = await Setting.findOne()
    if (findSetting == null) {
      const findSetting = await this.findSettingOrCreate()

      return {
        setting: findSetting
      }
    }

    const { time_for_one_quantity } = deSerializeSetting(setting)
    findSetting.time_for_one_quantity = time_for_one_quantity

    const newSetting = await findSetting.save()

    return {
      setting: serializeSetting(newSetting)
    }
  }
}

export default SettingService
