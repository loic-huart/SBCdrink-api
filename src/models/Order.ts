import mongoose, { type ObjectId } from 'mongoose'
import { type IOrderStep, type IOrder, OrderStatus } from '../services/order/types'
import { type IModelOrder } from './types'
import Recipe, { deSerializeRecipe, serializeRecipe } from './Recipe'
import Ingredient, { deSerializeIngredient, serializeIngredient } from './Ingredient'

const Schema = mongoose.Schema

const serializeOrder = (order: IModelOrder): IOrder => ({
  id: order._id as unknown as string,
  status: order.status,
  progress: order.progress,
  recipe: serializeRecipe(order.recipe),
  steps: order.steps.map(step => ({
    id: step._id as unknown as string,
    status: step.status,
    order: step.order,
    quantity: step.quantity,
    ingredient: serializeIngredient(step.ingredient)
  })),
  createdAt: order.created_at,
  updatedAt: order.updated_at
})

const serializeOrders = (orders: IModelOrder[]): IOrder[] => {
  return orders.map(order => serializeOrder(order))
}

const deSerializeOrder = (order: IOrder): IModelOrder => ({
  _id: order.id as unknown as ObjectId,
  status: order.status,
  progress: order.progress,
  recipe: deSerializeRecipe(order.recipe),
  steps: order.steps.map((step: IOrderStep) => ({
    _id: step.id as unknown as ObjectId,
    status: step.status,
    order: step.order,
    quantity: step.quantity,
    ingredient: deSerializeIngredient(step.ingredient)
  })),
  created_at: order.createdAt,
  updated_at: order.updatedAt
})

const deSerializeOrders = (orders: IOrder[]): IModelOrder[] => {
  return orders.map(order => deSerializeOrder(order))
}

const orderSchema = new Schema<IModelOrder>({
  status: {
    type: String,
    enum: OrderStatus,
    required: true
  },
  progress: {
    type: Number,
    required: true
  },
  recipe: Recipe.schema,
  steps: [
    {
      status: {
        type: String,
        enum: OrderStatus,
        required: true
      },
      order: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      ingredient: Ingredient.schema
    }
  ],
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now
  }
})

const Order = mongoose.model('Order', orderSchema)

export default Order
export {
  serializeOrder,
  serializeOrders,
  deSerializeOrder,
  deSerializeOrders
}
