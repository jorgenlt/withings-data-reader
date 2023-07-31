import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
  error: null,
  spo2Auto: []
}

export const dataReader = createSlice({
  name: 'dataReader',
  initialState,
  reducers: {
    updateSpo2Auto: (state, action) => {
      state.spo2Auto = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { testRedux, updateSpo2Auto } = dataReader.actions

export default dataReader.reducer