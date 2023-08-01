import { configureStore } from '@reduxjs/toolkit'
import dataReaderReducer from '../features/dataReader/dataReaderSlice'

export const store = configureStore({
  reducer: {
    dataReader: dataReaderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['dataReader/filterSpo2'],
      },
    }),
})