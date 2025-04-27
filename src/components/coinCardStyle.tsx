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
      alignSelf: 'flex-end',
      width: screenWidth * 0.12,
      fontSize: screenWidth * 0.03,
      backgroundColor: 'grey',
      color: customStyle ? Colors.green : Colors.red,
      padding: 4,
      borderRadius: 5,
      marginBottom: screenWidth * 0.05,
    },
    conditionalView: {
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
    pricePercentage: {
      fontSize: screenWidth * 0.03,
      backgroundColor: 'grey',
      color: customStyle ? Colors.green : Colors.red,
      padding: 4,
      borderRadius: 5,
    },
  });

export default styles;
