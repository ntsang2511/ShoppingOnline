import axios from 'axios'
import { API_ROOT } from '../utils/constants'

export const getProductRating = async (data) => {
  const res = await axios.get(`${API_ROOT}/rating/get-product-rating/${data.name}`)
  return res.data
}

export const createProductRating = async (data) => {
  const res = await axios.post(`${API_ROOT}/rating/create`, data)
  return res.data
}
export const editProductRating = async (data) => {
  const res = await axios.put(`${API_ROOT}/rating/update`, data)
  return res.data
}

export const deleteproductRating = async (id) => {
  const res = await axios.delete(`${API_ROOT}/rating/delete/${id}`)
  return res.data
}
