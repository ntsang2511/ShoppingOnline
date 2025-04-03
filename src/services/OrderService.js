import { axiosJWT } from './UserService'
import { API_ROOT } from '../utils/constants'
export const createOrder = async (data, access_token) => {
  const res = await axiosJWT.post(`${API_ROOT}/order/create`, data, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}

export const getOrderByUserId = async (id, access_token) => {
  const res = await axiosJWT.get(`${API_ROOT}/order/get-all-orders/${id}`, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}
export const getAllOrderShipper = async () => {
  const res = await axiosJWT.get(`${API_ROOT}/order/get-ship-order`)
  return res.data
}

export const getShippedOrder = async (userid) => {
  const res = await axiosJWT.get(`${API_ROOT}/order/get-shipped-order/${userid}`)
  return res.data
}

export const getDetailsOrder = async (id, access_token) => {
  const res = await axiosJWT.get(`${API_ROOT}/order/get-details-orders/${id}`, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}

export const getAllOrderForAdmin = async (id, access_token) => {
  const res = await axiosJWT.get(`${API_ROOT}/order/get-all-ord-admin`, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}

export const deliveryCheck = async (data) => {
  const res = await axiosJWT.post(`${API_ROOT}/order/delivery`, data)
  return res.data
}

export const cancelOrder = async (id, access_token) => {
  const res = await axiosJWT.delete(`${API_ROOT}/order/cancel-order/${id}`, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}
