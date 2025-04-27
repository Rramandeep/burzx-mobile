import React, {useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  useColorScheme,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityIndicator, Icon} from 'react-native-paper';
import {LineChart, CandlestickChart} from 'react-native-wagmi-charts';
import {useNavigation, useRoute} from '@react-navigation/native';
import Text from '../components/text';
import type {RootState, AppDispatch} from '../redux/store';
import {
  CoinDetailState,
  fetchCoinDetail,
} from '../redux/coinsSlice/coinDetailSlice';
import coinCardStyle from '../components/coinCardStyle';
import {Colors} from '../constants/colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function MyPriceLabels({type}: {type: string}) {
  const domainData = CandlestickChart.useChart();
  const domainDataLine = LineChart.useChart();
  let yMin = domainData.domain?.[0] || 0;
  let yMax = domainData.domain?.[1] || 1;
  if (type === 'line') {
    yMin = domainDataLine.domain?.[0] || 0;
    yMax = domainDataLine.domain?.[1] || 1;
  }
  const labelCount = 5; // Number of labels to display
  const labels = [];

  for (let i = 0; i < labelCount; i++) {
    const value = yMin + (i / (labelCount - 1)) * (yMax - yMin);
    labels.unshift(value.toFixed(0)); // Format the price
  }

  return (
    <View style={styles().yAxisLabels}>
      {labels.map((label, index) => (
        <Text key={index} style={styles().labelText}>
          ${label}
        </Text>
      ))}
    </View>
  );
}

const CoinDetails: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string | number>(
    1,
  );
  const [selectedChart, setSelectedChart] = useState<string>('bar');

  const {
    productId,
    name,
    symbol,
    image,
    currentPrice,
    priceChangePercentage24h,
  }: any = route.params;
  const timeframes = [
    {days: 1, label: '1D'},
    {days: 7, label: '1W'},
    {days: 30, label: '1M'},
    {days: 180, label: '6M'},
    {days: 365, label: '1Y'},
    {days: 'max', label: 'All'},
  ];

  const dispatch = useDispatch<AppDispatch>();
  const {coinDetail, status}: CoinDetailState = useSelector(
    (state: RootState) => state.coinDetail,
  );

  useEffect(() => {
    dispatch(fetchCoinDetail({productId, selectedTimeFrame}));
  }, [dispatch, productId, selectedTimeFrame, selectedChart]);

  const handleTimeframePress = (daysValue: string | number) => {
    setSelectedTimeFrame(daysValue);
  };

  const chartData = useMemo(() => {
    if (selectedChart === 'line') {
      return coinDetail.map(v => ({value: v.close, timestamp: v.timestamp}));
    }
    return [
      {
        timestamp: +new Date(),
        value: 0,
      },
    ];
  }, [coinDetail, selectedChart]);

  return (
    <View style={styles(false, isDarkMode).mainContainer}>
      <ImageBackground
        style={styles().imgBg}
        resizeMode="stretch"
        height={screenHeight * 0.7}
        source={require('../assets/images/detailBg.png')}>
        {status === 'pending ' ? (
          <ActivityIndicator size={30} />
        ) : (
          <>
            <View>
              <View style={styles().headerContainer}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles().navButton}>
                  <Image source={require('../assets/images/navBack.png')} />
                </TouchableOpacity>
                <View style={styles().headerIconContainer}>
                  <Image
                    height={30}
                    width={30}
                    source={{uri: image}}
                    loadingIndicatorSource={image}
                  />
                  <Text style={styles().headerTitle}>{name}</Text>
                  <Text>({symbol.toUpperCase()})</Text>
                </View>
              </View>
              <View style={styles().priceContainer}>
                <View>
                  <Text
                    style={[
                      coinCardStyle().priceView,
                      {
                        fontSize: coinCardStyle().pricePercentage.fontSize * 2,
                      },
                    ]}>
                    $ {currentPrice}
                  </Text>
                  <Text
                    style={[
                      coinCardStyle(priceChangePercentage24h >= 0)
                        .pricePercentage,
                      {
                        width: screenWidth * 0.13,
                      },
                    ]}>
                    {priceChangePercentage24h >= 0 ? '+' : ''}
                    {priceChangePercentage24h.toFixed(2)} %
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedChart(prev => (prev === 'bar' ? 'line' : 'bar'));
                  }}>
                  <Icon
                    source={`chart-${selectedChart === 'bar' ? 'line' : 'bar'}`}
                    size={25}
                    color="red"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles().chartContainer}>
              {selectedChart === 'bar' ? (
                <CandlestickChart.Provider data={coinDetail}>
                  <CandlestickChart
                    width={screenWidth * 0.8}
                    height={screenHeight * 0.3}>
                    <CandlestickChart.Candles />
                    <CandlestickChart.Crosshair>
                      <CandlestickChart.Tooltip
                        style={styles().candleChartStyle}
                        textStyle={{
                          color: '#fff',
                        }}
                      />
                    </CandlestickChart.Crosshair>
                    <CandlestickChart.DatetimeText />
                  </CandlestickChart>
                  <MyPriceLabels type={selectedChart} />
                </CandlestickChart.Provider>
              ) : (
                <LineChart.Provider data={chartData}>
                  <LineChart
                    width={screenWidth * 0.8}
                    height={screenHeight * 0.3}>
                    <LineChart.Path color="#3b82f6" />
                    <LineChart.CursorCrosshair color="#3b82f6">
                      <LineChart.Tooltip textStyle={styles().lineChartStyle} />
                    </LineChart.CursorCrosshair>
                  </LineChart>
                  <MyPriceLabels type={selectedChart} />
                </LineChart.Provider>
              )}
            </View>
            <View style={styles().xAxisContainer}>
              {timeframes.map(timeframe => (
                <TouchableOpacity
                  key={timeframe.label}
                  style={
                    styles(selectedTimeFrame === timeframe.days).xAxisButton
                  }
                  onPress={() => handleTimeframePress(timeframe.days)}>
                  <Text
                    style={
                      styles(selectedTimeFrame === timeframe.days, isDarkMode)
                        .xAxisLabel
                    }>
                    {timeframe.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = (custom?: boolean | string, isDarkMode?: boolean) =>
  StyleSheet.create({
    lineChartStyle: {
      backgroundColor: 'black',
      borderRadius: 4,
      color: '#fff',
      fontSize: screenWidth * 0.04,
      paddingHorizontal: 2,
    },
    candleChartStyle: {
      backgroundColor: 'black',
      paddingHorizontal: 2,
      paddingVertical: 0,
      borderRadius: 5,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitle: {
      marginHorizontal: screenWidth * 0.02,
    },
    headerIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    navButton: {
      borderRadius: 50,
      opacity: isDarkMode ? 0.5 : 1,
      backgroundColor: isDarkMode ? Colors.white : Colors.cardGrey,
      top: screenHeight * 0.034,
      position: 'absolute',
      left: 0,
    },
    headerContainer: {
      width: screenWidth,
      paddingTop: screenHeight * 0.04,
      paddingLeft: screenWidth * 0.01,
      alignItems: 'center',
    },
    imgBg: {
      paddingBottom: 20,
      paddingLeft: screenWidth * 0.05,
    },
    mainContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? Colors.black : Colors.white,
    },
    yAxisLabels: {
      height: screenHeight * 0.3,
      width: 50, // Adjust width as needed
      justifyContent: 'space-between',
      paddingVertical: 10, // Adjust vertical padding
    },
    labelText: {
      fontSize: 12,
      textAlign: 'right',
    },
    chartContainer: {
      flexDirection: 'row',
      paddingTop: screenHeight * 0.08,
    },
    xAxisContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderColor: '#ccc',
    },
    xAxisButton: {
      borderRadius: 10,
      backgroundColor: custom ? '#CDFF00' : 'transparent',
      paddingHorizontal: 8,
      paddingVertical: 5,
    },
    xAxisLabel: {
      fontSize: screenWidth * 0.03,
      fontWeight: 'bold',
      color: custom
        ? Colors.black
        : isDarkMode
        ? Colors.white
        : Colors.cardGrey,
      opacity: 0.5,
    },
  });

export default CoinDetails;
