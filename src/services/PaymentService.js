import axios from 'axios'
import { API_ROOT } from '../utils/constants'
export const createZaloPayOrder = async (orderInfo) => {
  console.log(orderInfo)
  try {
    // Gửi yêu cầu tới backend để tạo đơn hàng ZaloPay
    const response = await axios.post(`${API_ROOT}/payment/zalopay`, {
      amount: orderInfo.totalPrice, // Tổng tiền
      bankCode: 'zalopayapp',
      orderId: orderInfo.orderId, // Mã đơn hàng
      description: orderInfo.orderInfo, // Mô tả đơn hàng
      items: orderInfo.items,
      user: orderInfo.user
    })
    return response.data
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu thanh toán ZaloPay:', error)
  }
}
