export interface IIngredient {
  id: string
  name: string
  isAlcohol: boolean
  alcoholDegree: number
  createdAt: Date
  updatedAt: Date
}

export interface IPayloadFindByIdIngredient {
  id: string
}

export interface IPayloadFind {
  sort: 'asc' | 'desc'
}
