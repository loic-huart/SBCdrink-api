export interface IIngredient {
  id: string
  name: string
  isAlcohol: boolean
  alcoholDegree: number
}

export interface IPayloadFindByIdIngredient {
  id: string
}
