import { createSlice } from '@reduxjs/toolkit'
import { error, success } from '../../components/Message/Message'
const initialState = {
  orderItems: [],
  orderItemsSelected: [],
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
      const itemOrder = state?.orderItems?.find((item) => {
        return item?.product === orderItems.product
      })
      if (itemOrder) {
        success('Đã thêm sản phẩm thành công')
        itemOrder.amount += orderItems.amount
      } else {
        success('Đã thêm sản phẩm thành công')
        state.orderItems.push(orderItems)
      }
    },
    increaseAmount: (state, action) => {
      const { idProduct } = action.payload
      const itemOrder = state?.orderItems?.find((item) => {
        return item?.product === idProduct
      })
      const itemOrderSelected = state?.orderItemsSelected?.find((item) => {
        return item?.product === idProduct
      })
      if (itemOrder.amount < itemOrder.countInStock) {
        itemOrder.amount++
      } else {
        error('Đã quá số lượng hàng có trong shop')
      }
      if (itemOrderSelected) {
        itemOrderSelected.amount++
      }
    },
    decreaseAmount: (state, action) => {
      const { idProduct } = action.payload
      const itemOrder = state?.orderItems?.find((item) => {
        return item?.product === idProduct
      })
      const itemOrderSelected = state?.orderItemsSelected?.find((item) => {
        return item?.product === idProduct
      })
      if (itemOrder.amount > 1) {
        itemOrder.amount--
      }
      if (itemOrderSelected && itemOrderSelected.amount > 1) {
        itemOrderSelected.amount--
      }
    },
    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload
      const itemOrder = state?.orderItems?.filter((item) => {
        return item?.product !== idProduct
      })
      const itemOrderSelected = state?.orderItemsSelected?.filter((item) => {
        return item?.product !== idProduct
      })
      state.orderItems = itemOrder
      state.orderItemsSelected = itemOrderSelected
    },
    removeAllOrderProduct: (state, action) => {
      const { listChecked } = action.payload
      const itemOrders = state?.orderItems?.filter((item) => {
        return !listChecked.includes(item.product)
      })
      const itemOrderSelected = state?.orderItemsSelected?.filter((item) => {
        return !listChecked.includes(item.product)
      })
      state.orderItems = itemOrders
      state.orderItemsSelected = itemOrderSelected
    },
    selectedOrder: (state, action) => {
      const { listChecked } = action.payload
      const orderSelected = []
      state.orderItems.forEach((order) => {
        if (listChecked.includes(order.product)) {
          orderSelected.push(order)
        }
      })
      state.orderItemsSelected = orderSelected
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  addOrderProduct,
  removeOrderProduct,
  increaseAmount,
  decreaseAmount,
  removeAllOrderProduct,
  selectedOrder
} = orderSlice.actions

export default orderSlice.reducer
