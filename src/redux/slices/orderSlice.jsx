import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  orderItems: [],
  shippingAddress: {},
  paymentMethod: '',
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: '',
  isPaid: false,
  paidAt: '',
  isDelivered: false,
  deliveredAt: ''
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItems } = action.payload
      console.log(orderItems)
      const itemOrder = state?.orderItems?.find((item) => {
        item?.product === orderItems.product
      })

      if (itemOrder) {
        itemOrder.amount += orderItems.amout
      } else {
        state.orderItems.push(orderItems)
      }
    },
    increaseAmount: (state, action) => {
      const { idProduct } = action.payload
      const itemOrder = state?.orderItems?.find((item) => {
        return item?.product === idProduct
      })
      itemOrder.amount++
    },
    decreaseAmount: (state, action) => {
      const { idProduct } = action.payload
      const itemOrder = state?.orderItems?.find((item) => {
        return item?.product === idProduct
      })
      if (itemOrder.amount > 1) {
        itemOrder.amount--
      }
    },
    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload
      const itemOrder = state?.orderItems?.filter((item) => {
        return item?.product !== idProduct
      })
      state.orderItems = itemOrder
    },
    removeAllOrderProduct: (state, action) => {
      const { listChecked } = action.payload
      const itemOrders = state?.orderItems?.filter((item) => {
        return !listChecked.includes(item.product)
      })
      state.orderItems = itemOrders
    }
  }
})

// Action creators are generated for each case reducer function
export const { addOrderProduct, removeOrderProduct, increaseAmount, decreaseAmount, removeAllOrderProduct } =
  orderSlice.actions

export default orderSlice.reducer
