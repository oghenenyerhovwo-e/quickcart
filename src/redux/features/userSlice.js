import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: {},
    isIdentityLoadComplete: false,
}

const userSlice = createSlice({
  name: "userStore",
  initialState,
  reducers: {
    setCurrentUser(state, action){
        state.currentUser = action.payload
    },
    setIsIdentityLoadComplete(state, action){
        state.isIdentityLoadComplete = action.payload
    },
  }
})

export const { setCurrentUser, setIsIdentityLoadComplete } = userSlice.actions
export const userReducer = userSlice.reducer