import { type IOrderStep, type IOrder, type OrderStatus } from '../services/order/types'
import { type IModelOrderStatus, type IModelOrder } from './types'
import { deSerializeRecipe, serializeRecipe } from './Recipe'
import { deSerializeIngredient, serializeIngredient } from './Ingredient'
import { PrismaClient } from '@prisma/client'

const serializeOrder = (order: IModelOrder): IOrder => ({
  id: order.id,
  status: order.status as OrderStatus,
  progress: order.progress,
  recipe: serializeRecipe(order.recipe, true, true),
  steps: order.steps.map(step => ({
    id: step.id,
    status: step.status as OrderStatus,
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
  id: order.id,
  status: order.status as IModelOrderStatus,
  progress: order.progress,
  recipe: deSerializeRecipe(order.recipe, true, true),
  steps: order.steps.map((step: IOrderStep) => ({
    id: step.id,
    status: step.status as IModelOrderStatus,
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

const Order = new PrismaClient().order

export default Order
export {
  serializeOrder,
  serializeOrders,
  deSerializeOrder,
  deSerializeOrders
}
