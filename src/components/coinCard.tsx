import React from 'react';
import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {LineChart, Grid} from 'react-native-svg-charts';
import Text from '../components/text';
import {Coin} from '../redux/coinsSlice/coinsListSlice';
import styles from './coinCardStyle';
import {Colors} from '../constants/colors';

interface ChildProps {
  item: Coin;
  isSubCategory?: boolean;
}

const screenWidth = Dimensions.get('window').width;

const LineChartComponent: React.FC<ChildProps> = React.memo(({item}) => {
  return (
    <LineChart
      style={{height: screenWidth * 0.16, width: screenWidth * 0.4}}
      data={item.sparkline}
      svg={{
        stroke: item.priceChangePercentage24h >= 0 ? Colors.green : Colors.red,
      }}
      contentInset={{top: 10, bottom: 15}}>
      <Grid />
    </LineChart>
  );
});

const CardItem: React.FC<ChildProps> = React.memo(({item, isSubCategory}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const navigation: {navigate: (arg1: string, arg2: {}) => void} =
    useNavigation();

  const navigateToDetails = () => {
    navigation.navigate('CoinDetail', {...item});
  };

  return (
    <TouchableOpacity
      onPress={navigateToDetails}
      style={styles(isSubCategory, isDarkMode).card}>
      <View style={styles(isSubCategory).headerRow}>
        <Image
          style={{
            height: screenWidth * 0.13,
            width: screenWidth * 0.13,
          }}
          source={{uri: item.image}}
        />
        <View style={{marginLeft: screenWidth * 0.02}}>
          <Text
            style={{
              fontSize: screenWidth * 0.04,
              marginBottom: screenWidth * 0.02,
            }}>
            {item.symbol.toUpperCase()}
          </Text>
          <Text numberOfLines={1}>{item.name}</Text>
        </View>
      </View>

      {isSubCategory && <LineChartComponent item={item} />}
      {!isSubCategory && (
        <View style={[styles().conditionalView]}>
          <View
            style={[
              styles().pricePercentageView,
              styles().pricePercentageViewExt,
            ]}>
            <Text
              style={
                styles(item.priceChangePercentage24h >= 0).conditionalText
              }>
              {item.priceChangePercentage24h >= 0 ? '+' : ''}
              {item.priceChangePercentage24h.toFixed(2)}%
            </Text>
          </View>
          <LineChartComponent item={item} />
        </View>
      )}
      <View style={styles(isSubCategory).priceView}>
        <Text
          style={{
            fontSize: screenWidth * 0.04,
          }}>
          $ {item.currentPrice}
        </Text>
        {isSubCategory && (
          <View style={styles().pricePercentageView}>
            <Text
              style={
                styles(isSubCategory && item.priceChangePercentage24h >= 0)
                  .pricePercentage
              }>
              {item.priceChangePercentage24h >= 0 ? '+' : ''}
              {item.priceChangePercentage24h.toFixed(2)}%
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

export default CardItem;
