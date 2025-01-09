import { configureStore } from "@reduxjs/toolkit"
import settingsReducer from "./slices/settingsSlice"
import authReducer from "./slices/authSlice"
import userStatsReducer from "./slices/userStatsSlice"

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    auth: authReducer,
    userStats: userStatsReducer,
  },
})

export default store