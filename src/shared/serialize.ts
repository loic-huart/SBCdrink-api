import { ObjectId } from 'mongodb'

const serialize = <T, U>(data: T): U => {
  const camelCase = (str: string): string => str.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  })

  return Object.keys(data).reduce((acc, key) => {
    return {
      ...acc,
      [camelCase(key)]: key === 'id' ? (data[key] as ObjectId).toString() : data[key]
    }
  }, {} as U)
}

const serializes = <T, U>(datas: T[]): U[] => {
  return datas.map(data => serialize(data))
}

const deSerialize = <T, U>(data: T): U => {
  const snakeCase = (str: string): string => str.replace(/([A-Z])/g, ($1) => {
    return `_${$1.toLowerCase()}`
  })

  return Object.keys(data).reduce((acc, key) => {
    return {
      ...acc,
      [snakeCase(key)]: key === 'id' ? new ObjectId(data[key] as string) : data[key]
    }
  }, {} as U)
}

const deSerializes = <T, U>(datas: T[]): U[] => {
  return datas.map(data => deSerialize(data))
}

export {
  serialize,
  serializes,
  deSerialize,
  deSerializes
}
