import axios from 'axios'
export const createZaloPayOrder = async (orderInfo) => {
  try {
    // Gửi yêu cầu tới backend để tạo đơn hàng ZaloPay
    const response = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/payment/zalopay`, {
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
