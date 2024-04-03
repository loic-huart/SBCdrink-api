import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import { type IIngredient } from '../services/ingredient/types'
import { type IModelIngredient } from './types'

const Schema = mongoose.Schema

const serializeIngredient = (ingredient: IModelIngredient): IIngredient => ({
  id: ingredient._id.toString(),
  name: ingredient.name,
  isAlcohol: ingredient.is_alcohol,
  alcoholDegree: ingredient.alcohol_degree
})

const serializeIngredients = (ingredients: IModelIngredient[]): IIngredient[] => {
  return ingredients.map(ingredient => serializeIngredient(ingredient))
}

const deSerializeIngredient = (ingredient: IIngredient): IModelIngredient => ({
  _id: new ObjectId(ingredient.id),
  name: ingredient.name,
  is_alcohol: ingredient.isAlcohol,
  alcohol_degree: ingredient.alcoholDegree
})

const deSerializeIngredients = (ingredients: IIngredient[]): IModelIngredient[] => {
  return ingredients.map(ingredient => deSerializeIngredient(ingredient))
}

const ingredientSchema = new Schema<IModelIngredient>({
  name: {
    type: String,
    required: true
  },
  is_alcohol: {
    type: Boolean,
    required: true
  },
  alcohol_degree: {
    type: Number,
    required: true
  }
})

const Ingredient = mongoose.model('Ingredient', ingredientSchema)

export default Ingredient
export {
  serializeIngredient,
  serializeIngredients,
  deSerializeIngredient,
  deSerializeIngredients
}
