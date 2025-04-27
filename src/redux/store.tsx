import {configureStore} from '@reduxjs/toolkit';
import coinsReducer from './coinsSlice/coinsListSlice';
import coinDetailReducer from './coinsSlice/coinDetailSlice';
import coinsCategoryReducer from './coinsSlice/coinCatSlice';

export const store = configureStore({
  reducer: {
    coins: coinsReducer,
    coinDetail: coinDetailReducer,
    coinsCategory: coinsCategoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
