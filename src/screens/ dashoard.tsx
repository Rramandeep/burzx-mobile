import React, {useState, useRef, useEffect, startTransition} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  useColorScheme,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import {CoinsState, fetchCoins} from '../redux/coinsSlice/coinsListSlice';
import CardItem from '../components/coinCard';
import {ActivityIndicator, TextInput} from 'react-native-paper';
import Text from '../components/text';
import type {RootState, AppDispatch} from '../redux/store';
import {
  CoinsCatState,
  fetchFeaturedCoinsAction,
} from '../redux/coinsSlice/coinCatSlice';
import {Colors} from '../constants/colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Dashboard: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useDispatch<AppDispatch>();
  const {coins, status, hasMoreData, totalData}: CoinsState = useSelector(
    (state: RootState) => state.coins,
  );
  const {topMarketCapCoins, topGainerCoins, topLooserCoins}: CoinsCatState =
    useSelector((state: RootState) => state.coinsCategory);
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState<string>('Featured');
  const flatListRef = useRef<FlatList | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    dispatch(fetchCoins(page));
  }, [dispatch, page]);

  useEffect(() => {
    console.log('ispending', topGainerCoins);
    console.log(topGainerCoins);
  }, [topGainerCoins, topLooserCoins]);

  useEffect(() => {
    if (totalData && topMarketCapCoins.length === 0) {
      const pageNumber = 1;
      const pageSize = totalData;
      startTransition(() => {
        dispatch(fetchFeaturedCoinsAction({pageNumber, pageSize}));
      });
    }
  }, [dispatch, totalData, selectedTab, topMarketCapCoins]);

  const handleTabPress = (tab: string, index: number) => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: false});
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * (screenWidth / 2),
        animated: true,
      });
    }
    setSelectedTab(tab);
  };

  const renderCoinsCategory = () => (
    <View style={styles(isDarkMode).categoryContainer}>
      <FlatList
        ListEmptyComponent={
          <View style={styles(isDarkMode).emptyContainer}>
            <ActivityIndicator style={styles(isDarkMode).loader} size={30} />
          </View>
        }
        ref={flatListRef}
        data={
          selectedTab === 'Featured'
            ? topMarketCapCoins
            : selectedTab === 'Top Gainers'
            ? topGainerCoins
            : topLooserCoins
        }
        // data={[]}
        contentContainerStyle={styles(isDarkMode).categoryContent}
        showsHorizontalScrollIndicator={false}
        horizontal
        renderItem={({item}) => <CardItem isSubCategory={true} item={item} />}
        extraData={selectedTab}
        keyExtractor={item => item.id}
      />
    </View>
  );

  const handleOnEndReached = () => {
    if (hasMoreData) {
      setPage(prev => prev + 1);
    }
  };

  const renderAllCoins = () => (
    <View style={styles(isDarkMode).allCoinsContainer}>
      <View style={styles(isDarkMode).headerContainer}>
        <Text style={styles(isDarkMode).headerText}>All Coins</Text>
        <TextInput
          style={styles(isDarkMode).searchInput}
          outlineStyle={styles(isDarkMode).searchOutline}
          contentStyle={styles(isDarkMode).searchContent}
          mode="outlined"
          placeholder="Search..."
          right={
            <TextInput.Icon
              style={{
                marginTop: screenWidth * 0.1,
              }}
              icon="magnify"
            />
          }
        />
      </View>
      <FlashList
        ListEmptyComponent={<ActivityIndicator size={30} />}
        estimatedItemSize={100}
        data={coins}
        contentContainerStyle={styles(isDarkMode).flashListContent}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => <CardItem isSubCategory={false} item={item} />}
        keyExtractor={item => item.id}
        onEndReachedThreshold={1}
        onEndReached={handleOnEndReached}
        ListFooterComponent={
          status === 'loading' && totalData !== coins.length ? (
            <ActivityIndicator size={30} />
          ) : null
        }
      />
    </View>
  );

  return (
    <View style={[styles(isDarkMode).screenContainer]}>
      <View style={styles(isDarkMode).tabHeader}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles(isDarkMode).tabBar}>
          {['Featured', 'Top Gainers', 'Top Losers'].map((tab, index) => (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabPress(tab, index)}
              style={[
                styles(isDarkMode).tab,
                selectedTab === tab && styles(isDarkMode).selectedTab,
              ]}>
              <Image
                source={
                  tab === 'Featured'
                    ? require('../assets/images/star.png')
                    : tab === 'Top Gainers'
                    ? require('../assets/images/rocket.png')
                    : require('../assets/images/flag.png')
                }
              />
              <Text
                style={[
                  styles(isDarkMode).tabText,
                  {
                    opacity: selectedTab === tab ? 1 : 0.4,
                  },
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {renderCoinsCategory()}
      {renderAllCoins()}
    </View>
  );
};

const styles = (custom?: boolean) =>
  StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: custom ? Colors.black : 'transparent',
    },
    tabHeader: {
      height: screenHeight * 0.065,
    },
    categoryContainer: {
      height: screenHeight / 4,
    },
    emptyContainer: {
      width: screenWidth,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loader: {
      alignSelf: 'center',
    },
    categoryContent: {
      paddingLeft: screenWidth * 0.03,
    },
    allCoinsContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    headerContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: screenWidth * 0.04,
    },
    headerText: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: Colors.green,
      marginHorizontal: screenWidth * 0.05,
      fontSize: screenWidth * 0.05,
    },
    searchInput: {
      height: 10,
      marginLeft: screenWidth * 0.1,
      backgroundColor: custom ? Colors.cardGrey : '#e0e0e0',
    },
    searchOutline: {
      borderRadius: 50,
      borderWidth: 0,
    },
    searchContent: {
      width: screenWidth * 0.32,
      borderRadius: 20,
    },
    flashListContent: {
      paddingLeft: screenWidth * 0.02,
      paddingBottom: screenWidth * 0.025,
    },
    tabBar: {
      paddingLeft: screenWidth * 0.05,
      backgroundColor: custom ? Colors.black : '#fff',
      height: screenHeight * 0.055,
      borderBottomWidth: 0.5,
      color: Colors.cardGrey,
    },
    tab: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      width: screenWidth / 2.5,
      padding: 10,
    },
    selectedTab: {
      borderBottomWidth: 2,
      borderBottomColor: Colors.green,
    },
    tabText: {
      marginLeft: 4,
      fontSize: screenWidth * 0.04,
      fontWeight: 'bold',
      color: custom ? Colors.white : Colors.black,
    },
  });

export default Dashboard;
