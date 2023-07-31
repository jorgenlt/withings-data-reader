import { configureStore } from '@reduxjs/toolkit'
import dataReaderReducer from '../features/dataReader/dataReaderSlice'

export const store = configureStore({
  reducer: {
    dataReader: dataReaderReducer,
  },
})