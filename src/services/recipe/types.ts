export interface IRecipe {
  id: string
  name: string
  description: string
  picture: string
  alcoholLevel: number
  alcoholMinLevel: number
  alcoholMaxLevel: number
  isAvailable: boolean
  createdAt: Date
  updatedAt: Date
}
