import axios from 'axios'
import { axiosJWT } from './UserService'
import { API_ROOT } from '../utils/constants'
export const getProductBySearch = async (search, limit) => {
  let res = {}
  if (search && search.length > 0) {
    res = await axios.get(`${API_ROOT}/product/get-all?filter=name&filter=${search}&limit=${limit}`)
  } else {
    res = await axios.get(`${API_ROOT}/product/get-all?limit=${limit}`)
  }
  return res.data
}

export const getAllProduct = async (page, limit) => {
  const res = await axios.get(`${API_ROOT}/product/get-all?page=${page}&limit=${limit}`)
  return res.data
}
export const getProductType = async (type, page, limit) => {
  if (type) {
    const res = await axios.get(`${API_ROOT}/product/get-all?filter=type&filter=${type}&limit=${limit}&page=${page}`)
    return res.data
  }
}

export const createProduct = async (data) => {
  const res = await axios.post(`${API_ROOT}/product/create`, data)
  return res.data
}
export const getDetailsProduct = async (id) => {
  const res = await axios.get(`${API_ROOT}/product/get-details/${id}`)
  return res.data
}

export const updateProduct = async (id, access_token, data) => {
  const res = await axiosJWT.put(`${API_ROOT}/product/update/${id}`, data, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}

export const deleteProduct = async (id, access_token) => {
  const res = await axiosJWT.delete(`${API_ROOT}/product/delete/${id}`, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}

export const deleteManyProduct = async (ids, access_token) => {
  const res = await axiosJWT.post(`${API_ROOT}/product/delete-many`, ids, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}
export const getAllTypeProduct = async () => {
  const res = await axios.get(`${API_ROOT}/product/get-all-type`)
  return res.data
}
