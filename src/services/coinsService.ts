import axios from 'axios';

// Async thunk for GET call
export const getCoins = async (page: number, pageSize: number = 10) => {
  const response = await axios.get(
    `https://coingeko.burjx.com/coin-prices-all?currency=usd&page=${page}&pageSize=${pageSize}`,
  );
  return response.data;
};

// Async thunk for GET call
export const getCoinDetail = async (
  productId: number,
  days: number | string,
) => {
  const response = await axios.get(
    `https://coingeko.burjx.com/coin-ohlc?productId=${productId}&days=${days}`,
  );
  return response.data;
};
