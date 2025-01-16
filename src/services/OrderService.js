import { axiosJWT } from './UserService'
export const createOrder = async (data, access_token) => {
  const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/order/create`, data, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}

export const getOrderByUserId = async (id, access_token) => {
  const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/order/get-all-orders/${id}`, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}
export const getAllOrderShipper = async () => {
  const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/order/get-ship-order`)
  return res.data
}

export const getShippedOrder = async (userid) => {
  const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/order/get-shipped-order/${userid}`)
  return res.data
}

export const getDetailsOrder = async (id, access_token) => {
  const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/order/get-details-orders/${id}`, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}

export const deliveryCheck = async (data) => {
  const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/order/delivery`, data)
  return res.data
}

export const cancelOrder = async (id, access_token) => {
  const res = await axiosJWT.delete(`${import.meta.env.VITE_API_URL_BACKEND}/order/cancel-order/${id}`, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  console.log(res)
  return res.data
}
