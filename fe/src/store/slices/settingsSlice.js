import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  language: "english",
  theme: "dark",
  wordCount: 20,
}

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setWordCount: (state, action) => {
      state.wordCount = action.payload
    },
  },
})

export const { setLanguage, setTheme, setWordCount } = settingsSlice.actions
export default settingsSlice.reducer