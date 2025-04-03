let apiRoot = ''

if (import.meta.env.MODE === 'development') {
  apiRoot = 'http://localhost:3001/api'
}
if (import.meta.env.MODE === 'production') {
  apiRoot = 'https://shoppingonlinebackend.onrender.com/api'
}

export const API_ROOT = apiRoot
