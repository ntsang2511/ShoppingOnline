import axios from 'axios'
import { API_ROOT } from '../utils/constants'

export const getCart = async (userId) => {
  const res = await axios.get(`${API_ROOT}/cart/get-cart/${userId}`)
  return res.data
}

export const addItemCart = async (data) => {
  const res = await axios.post(`${API_ROOT}/cart/add-cart`, data)
  return res.data
}
export const removeItem = async (data) => {
  const res = await axios.post(`${API_ROOT}/cart/remove-cart`, data)
  return res.data
}

export const clearCart = async (data) => {
  const res = await axios.post(`${API_ROOT}/cart/clear-cart`, data)
  return res.data
}
export const updateItemAmount = async (data) => {
  const res = await axios.post(`${API_ROOT}/cart/update`, data)
  return res.data
}
