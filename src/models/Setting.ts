import { type ISetting } from '../services/setting/types'
import { type IModelSetting } from './types'
import { PrismaClient } from '@prisma/client'

const serializeSetting = (setting: IModelSetting): ISetting => ({
  dispenserEmptyingTime: setting.dispenser_emptying_time,
  dispenserFillingTime: setting.dispenser_filling_time
})

const serializeSettings = (settings: IModelSetting[]): ISetting[] => {
  return settings.map(setting => serializeSetting(setting))
}

const deSerializeSetting = (setting: ISetting): IModelSetting => ({
  dispenser_emptying_time: setting.dispenserEmptyingTime,
  dispenser_filling_time: setting.dispenserFillingTime
})

const deSerializeSettings = (settings: ISetting[]): IModelSetting[] => {
  return settings.map(setting => deSerializeSetting(setting))
}

const Setting = new PrismaClient().setting

export default Setting
export {
  serializeSetting,
  serializeSettings,
  deSerializeSetting,
  deSerializeSettings
}
