import { type IIngredient } from '../services/ingredient/types'
import { type IModelIngredient } from './types'
import { PrismaClient } from '@prisma/client'

const serializeIngredient = (ingredient: IModelIngredient): IIngredient => ({
  id: ingredient.id,
  name: ingredient.name,
  isAlcohol: ingredient.is_alcohol,
  alcoholDegree: ingredient.alcohol_degree,
  createdAt: ingredient.created_at,
  updatedAt: ingredient.updated_at,
  viscosity: ingredient.viscosity
})

const serializeIngredients = (ingredients: IModelIngredient[]): IIngredient[] => {
  return ingredients.map(ingredient => serializeIngredient(ingredient))
}

const deSerializeIngredient = (ingredient: IIngredient): IModelIngredient => ({
  id: ingredient.id,
  name: ingredient.name,
  is_alcohol: ingredient.isAlcohol,
  alcohol_degree: ingredient.alcoholDegree,
  created_at: ingredient.createdAt,
  updated_at: ingredient.updatedAt,
  viscosity: ingredient.viscosity
})

const deSerializeIngredients = (ingredients: IIngredient[]): IModelIngredient[] => {
  return ingredients.map(ingredient => deSerializeIngredient(ingredient))
}

const Ingredient = new PrismaClient().ingredient

export default Ingredient
export {
  serializeIngredient,
  serializeIngredients,
  deSerializeIngredient,
  deSerializeIngredients
}
