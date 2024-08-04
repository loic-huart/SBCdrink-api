import mongoose from 'mongoose'
import { type ISetting } from '../services/setting/types'
import { type IModelSetting } from './types'

const Schema = mongoose.Schema

const serializeSetting = (setting: IModelSetting): ISetting => ({
  timeForOneQuantity: setting.time_for_one_quantity
})

const serializeSettings = (settings: IModelSetting[]): ISetting[] => {
  return settings.map(setting => serializeSetting(setting))
}

const deSerializeSetting = (setting: ISetting): IModelSetting => ({
  time_for_one_quantity: setting.timeForOneQuantity
})

const deSerializeSettings = (settings: ISetting[]): IModelSetting[] => {
  return settings.map(setting => deSerializeSetting(setting))
}

const settingSchema = new Schema<IModelSetting>({
  time_for_one_quantity: {
    type: Number,
    required: true
  }
})

const Setting = mongoose.model('Setting', settingSchema)

export default Setting
export {
  serializeSetting,
  serializeSettings,
  deSerializeSetting,
  deSerializeSettings
}
