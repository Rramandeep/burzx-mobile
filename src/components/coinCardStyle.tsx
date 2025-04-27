import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../constants/colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = (customStyle?: boolean | string, isDarkMode?: boolean) =>
  StyleSheet.create({
    card: {
      overflow: 'hidden',
      elevation: 0,
      opacity: isDarkMode ? 0.8 : 1,
      backgroundColor: isDarkMode ? Colors.cardGrey : '#e0e0e0',
      margin: 2,
      padding: 15,
      height: customStyle ? screenHeight * 0.2 : screenHeight * 0.17,
      width: customStyle ? screenWidth / 2 : screenWidth * 0.95,
      borderRadius: screenWidth * 0.05,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    conditionalText: {
      fontSize: screenWidth * 0.03,
      color: customStyle ? Colors.green : Colors.red,
    },
    conditionalView: {
      alignSelf: 'center',
      position: 'absolute',
      right: screenWidth * 0.02,
      top: screenWidth * 0.04,
    },
    priceView: {
      paddingTop: !customStyle ? screenWidth * 0.1 : 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: screenWidth * 0.005,
    },
    pricePercentageView: {
      elevation: 10,
      alignItems: 'center',
      backgroundColor: '#808080',
      borderRadius: 6,
      paddingVertical: 1,
      paddingHorizontal: 3,
    },
    pricePercentageViewExt: {
      alignSelf: 'flex-end',
      height: screenWidth * 0.05,
      width: screenWidth * 0.13,
      marginBottom: screenWidth * 0.05,
    },
    pricePercentage: {
      alignItems: 'center',
      fontSize: screenWidth * 0.03,
      color: customStyle ? Colors.green : Colors.red,
      paddingVertical: 4,
      borderRadius: 5,
    },
  });

export default styles;
