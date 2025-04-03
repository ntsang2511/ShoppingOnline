import axios from 'axios'
import { API_ROOT } from '../utils/constants'
export const axiosJWT = axios.create()

export const loginUser = async (data) => {
  const res = await axios.post(`${API_ROOT}/user/sign-in`, data)
  return res.data
}
export const signUpUser = async (data) => {
  const res = await axios.post(`${API_ROOT}/user/sign-up`, data)
  return res.data
}
export const getDetailsUser = async (id, access_token) => {
  const res = await axiosJWT.get(`${API_ROOT}/user/get-details/${id}`, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}
export const getAllUser = async (access_token) => {
  const res = await axiosJWT.get(`${API_ROOT}/user/get-all/`, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}
export const refreshToken = async (refreshToken) => {
  console.log('refreshToken', refreshToken)
  const res = await axios.post(
    `${API_ROOT}/user/refresh-token`,
    {},
    {
      headers: {
        token: `Bearer ${refreshToken}`
      }
    }
  )
  return res.data
}
export const logoutUser = async () => {
  const res = await axios.post(`${API_ROOT}/user/log-out`)
  return res.data
}

export const updateUser = async (id, data, access_token) => {
  const res = await axiosJWT.put(`${API_ROOT}/user/update-user/${id}`, data, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}
export const deleteUser = async (id, access_token) => {
  const res = await axiosJWT.delete(`${API_ROOT}/user/delete-user/${id}`, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}
export const deleteManyUser = async (ids, access_token) => {
  const res = await axiosJWT.post(`${API_ROOT}/user/delete-many`, ids, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}
