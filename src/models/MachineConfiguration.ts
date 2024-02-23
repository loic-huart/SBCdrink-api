import mongoose, { type ObjectId } from 'mongoose'
import { type IMachineConfiguration } from '../services/machineConfiguration/types'
import { type IModelMachineConfiguration } from './types'

const Schema = mongoose.Schema

const serializeRecipe = (recipe: IModelMachineConfiguration): IMachineConfiguration => ({
  id: recipe._id as unknown as string,
  ingredient: recipe.ingredient as unknown as string,
  slot: recipe.slot,
  measureVolume: recipe.measure_volume
})

const serializeRecipes = (recipes: IModelMachineConfiguration[]): IMachineConfiguration[] => {
  return recipes.map(recipe => serializeRecipe(recipe))
}

const deSerializeRecipe = (recipe: IMachineConfiguration): IModelMachineConfiguration => ({
  _id: recipe.id as unknown as ObjectId,
  ingredient: recipe.ingredient as unknown as ObjectId,
  slot: recipe.slot,
  measure_volume: recipe.measureVolume
})

const deSerializeRecipes = (recipes: IMachineConfiguration[]): IModelMachineConfiguration[] => {
  return recipes.map(recipe => deSerializeRecipe(recipe))
}

const recipeSchema = new Schema<IModelMachineConfiguration>({
  ingredient: {
    type: Schema.Types.ObjectId,
    ref: 'Ingredient'
  },
  slot: {
    type: Number,
    required: true
  },
  measure_volume: {
    type: Number,
    required: true
  }
})

const Recipe = mongoose.model('MachineConfiguration', recipeSchema)

export default Recipe
export {
  serializeRecipe,
  serializeRecipes,
  deSerializeRecipe,
  deSerializeRecipes
}
