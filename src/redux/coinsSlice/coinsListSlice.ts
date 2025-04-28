import {createSlice, createAsyncThunk, current} from '@reduxjs/toolkit';
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
  allCoins: Coin[];
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
  allCoins: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  hasMoreData: true,
  totalData: 0,
};

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    coinsFilter: (state, action) => {
      state.status = 'loading';
      const interimData = state.allCoins.filter(item =>
        item.name.toLowerCase().includes(action.payload.toLowerCase()),
      );
      state.coins = interimData;
      state.status = 'succeeded';
    },
    coinsReset: state => {
      state.status = 'loading';
      state.coins = JSON.parse(JSON.stringify(state.allCoins));
      state.status = 'succeeded';
    },
  },
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
        state.allCoins = [...state.coins, ...action.payload.data];
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {coinsFilter, coinsReset} = coinsSlice.actions;

export default coinsSlice.reducer;

export type {CoinsState, Coin};
