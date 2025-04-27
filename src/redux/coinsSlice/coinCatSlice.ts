import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getCoins} from '../../services/coinsService';
import {TLineChartDataProp} from 'react-native-wagmi-charts';

interface Coin {
  productId: number;
  id: string;
  currentPrice: number;
  name: string;
  image: string;
  priceChangePercentage24h: number;
  sparkline: TLineChartDataProp;
  symbol: string;
  marketCap: number;
  tradingVolume: number;
}

interface CoinsCatState {
  allCoins: Coin[];
  topMarketCapCoins: Coin[];
  topGainerCoins: Coin[];
  topLooserCoins: Coin[];
  catStatus: string;
  error: string | null | undefined;
}

export const fetchFeaturedCoinsAction = createAsyncThunk(
  'fetchFeaturedCoinsType',
  async ({pageNumber, pageSize}: {pageNumber: number; pageSize: number}) => {
    return await getCoins(pageNumber, pageSize);
  },
);

const initialState: CoinsCatState = {
  allCoins: [],
  topMarketCapCoins: [],
  topGainerCoins: [],
  topLooserCoins: [],
  catStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFeaturedCoinsAction.pending, state => {
        state.catStatus = 'loading';
      })
      .addCase(fetchFeaturedCoinsAction.fulfilled, (state, action) => {
        console.log('called line 53');
        console.log(action.payload.data);
        state.catStatus = 'succeeded';
        state.allCoins = JSON.parse(JSON.stringify(action.payload.data));
        const interimData = action.payload.data;
        state.topMarketCapCoins = interimData
          .sort(
            (firstVal: Coin, secondVal: Coin) =>
              secondVal.marketCap - firstVal.marketCap,
          )
          .slice(0, 20);
        const interimGainers = JSON.parse(JSON.stringify(state.allCoins));
        state.topGainerCoins = interimGainers
          .sort(
            (firstVal: Coin, secondVal: Coin) =>
              secondVal.priceChangePercentage24h -
              firstVal.priceChangePercentage24h,
          )
          .slice(0, 20);
        const interimLosers = JSON.parse(JSON.stringify(state.allCoins));
        state.topLooserCoins = interimLosers
          .sort(
            (firstVal: Coin, secondVal: Coin) =>
              firstVal.priceChangePercentage24h -
              secondVal.priceChangePercentage24h,
          )
          .slice(0, 20);
      })
      .addCase(fetchFeaturedCoinsAction.rejected, (state, action) => {
        state.catStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export default coinsSlice.reducer;

export type {CoinsCatState, Coin};
