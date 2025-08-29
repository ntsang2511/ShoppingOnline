import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isShowSearch: false
}

const stateManagement = createSlice({
  name: 'stateManagement',
  initialState,
  reducers: {
    showSearch: (state) => {
      state.isShowSearch = true
    },
    hideSearch: (state) => {
      state.isShowSearch = false
    },
    toggleSearch: (state) => {
      state.isShowSearch = !state.isShowSearch
    }
  }
})

export const { showSearch, hideSearch, toggleSearch } = stateManagement.actions
export default stateManagement.reducer
