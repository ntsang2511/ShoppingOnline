import axios from 'axios'

export const getProductRating = async (data) => {
  console.log(data)
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL_BACKEND}/rating/get-product-rating/${data.name}?limit=${data.limit}&page=${data.page}`
  )
  return res.data
}

export const createProductRating = async (data) => {
  console.log(data)
  const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/rating/create`, data)
  return res.data
}
export const editProductRating = async (data) => {
  const res = await axios.put(`${import.meta.env.VITE_API_URL_BACKEND}/rating/update`, data)
  return res.data
}

export const deleteproductRating = async (id) => {
  const res = await axios.delete(`${import.meta.env.VITE_API_URL_BACKEND}/rating/delete/${id}`)
  return res.data
}
