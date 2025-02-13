import axios from 'axios'

export const getCart = async (userId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/cart/get-cart/${userId}`)
  return res.data
}

export const addItemCart = async (data) => {
  const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/cart/add-cart`, data)
  return res.data
}
export const removeItem = async (data) => {
  const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/cart/remove-cart`, data)
  return res.data
}

export const clearCart = async (data) => {
  const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/cart/clear-cart`, data)
  return res.data
}
export const updateItemAmount = async (data) => {
  const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/cart/update`, data)
  return res.data
}
