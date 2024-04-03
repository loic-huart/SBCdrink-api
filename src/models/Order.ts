import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import { type IOrderStep, type IOrder, OrderStatus } from '../services/order/types'
import { type IModelOrder } from './types'
import Recipe, { deSerializeRecipe, serializeRecipe } from './Recipe'
import Ingredient, { deSerializeIngredient, serializeIngredient } from './Ingredient'

const Schema = mongoose.Schema

const serializeOrder = (order: IModelOrder): IOrder => ({
  id: order._id.toString(),
  status: order.status,
  progress: order.progress,
  recipe: serializeRecipe(order.recipe),
  steps: order.steps.map(step => ({
    id: step._id.toString(),
    status: step.status,
    orderIndex: step.order_index,
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
  _id: new ObjectId(order.id),
  status: order.status,
  progress: order.progress,
  recipe: deSerializeRecipe(order.recipe),
  steps: order.steps.map((step: IOrderStep) => ({
    _id: new ObjectId(step.id),
    status: step.status,
    order_index: step.orderIndex,
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
    required: true,
    default: OrderStatus.CREATED
  },
  progress: {
    type: Number,
    required: true,
    default: 0
  },
  recipe: Recipe.schema,
  steps: [
    {
      status: {
        type: String,
        enum: OrderStatus,
        required: true,
        default: OrderStatus.CREATED
      },
      order_index: {
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
