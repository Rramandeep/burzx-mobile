import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getCoinDetail} from '../../services/coinsService';

interface ApiCoinDetail {
  aed: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
  usd: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
  date: number;
}

interface CoinDetail {
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: number;
}

interface CoinDetailState {
  coinDetail: CoinDetail[];
  status: string;
  error: string | null | undefined;
}

const initialState: CoinDetailState = {
  coinDetail: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchCoinDetail = createAsyncThunk(
  'fetchCoinDetail',
  async ({
    productId,
    selectedTimeFrame,
  }: {
    productId: number;
    selectedTimeFrame: number | string;
  }) => {
    const interimCoinDetail: ApiCoinDetail[] = await getCoinDetail(
      productId,
      selectedTimeFrame,
    );
    const coinDetail = interimCoinDetail.map(item => ({
      timestamp: item.date,
      ...item.usd,
    }));
    return coinDetail;
  },
);

const coinDetailSlice = createSlice({
  name: 'coinDetail',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCoinDetail.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchCoinDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coinDetail = action.payload;
      })
      .addCase(fetchCoinDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default coinDetailSlice.reducer;

export type {CoinDetailState, CoinDetail};
