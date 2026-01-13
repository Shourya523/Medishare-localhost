import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import uploadReducer from './slices/uploadSlice';
import ngoReducer from './slices/ngoSlice';
import healthReducer from './slices/healthSlice';
import donationReducer from './slices/donationSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice'
// Combine all reducers into one root reducer
const rootReducer = combineReducers({
  upload: uploadReducer,
  ngo: ngoReducer,
  health: healthReducer,
  donation: donationReducer,
  auth: authReducer,
  cart: cartReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [ 'donation', 'auth'], // Ensure auth is included
};

// Wrap the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
