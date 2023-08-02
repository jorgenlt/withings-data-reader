import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import dataReaderReducer from '../features/dataReader/dataReaderSlice'


// Configuration object for redux-persist.
// Only objects on the whitelist are stored.
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['files', 'status', 'error']
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, dataReaderReducer);

export const store = configureStore({
  reducer: {
    dataReader: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// The Redux persistor for persisting store state.
export const persistor = persistStore(store);
