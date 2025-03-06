import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: '',
  access_token: '',
  id: '',
  isAdmin: false,
  isShipper: false,
  city: '',
  refreshToken: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const {
        name = '',
        email = '',
        access_token = '',
        address = '',
        phone = '',
        avatar = '',
        _id = '',
        city = '',
        isAdmin = false,
        isShipper = false,
        refreshToken = ''
      } = action.payload
      state.name = name
      state.email = email
      state.phone = phone
      state.address = address
      state.avatar = avatar
      state.id = _id
      state.access_token = access_token
      state.isAdmin = isAdmin
      state.isShipper = isShipper
      state.city = city
      state.refreshToken = refreshToken
    },
    resetUser: (state) => {
      state.name = ''
      state.email = ''
      state.phone = ''
      state.address = ''
      state.avatar = ''
      state.access_token = ''
      state.city = ''
      state.isAdmin = false
      state.isShipper = false
      state.refreshToken = ''
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer
