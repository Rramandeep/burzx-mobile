import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getCoins} from '../../services/coinsService';
import {TLineChartPoint} from 'react-native-wagmi-charts';

interface Coin {
  productId: number;
  id: string;
  currentPrice: number;
  name: string;
  image: string;
  priceChangePercentage24h: number;
  sparkline: TLineChartPoint[];
  symbol: string;
  marketCap: number;
  tradingVolume: number;
}

interface CoinsState {
  coins: Coin[];
  status: string;
  error: string | null | undefined;
  hasMoreData: boolean;
  totalData: number;
}

export const fetchCoins = createAsyncThunk(
  'fetchCoins',
  async (page: number) => {
    return await getCoins(page);
  },
);

const initialState: CoinsState = {
  coins: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  hasMoreData: true,
  totalData: 0,
};

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCoins.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coins = [...state.coins, ...action.payload.data];
        state.hasMoreData =
          state.coins.length < action.payload.totalItems ? true : false;
        state.totalData = action.payload.totalItems;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default coinsSlice.reducer;

export type {CoinsState, Coin};
