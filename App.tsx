/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-reanimated';
import React from 'react';
import {Provider} from 'react-redux';
import {
  StatusBar,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  View,
} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/appNavigator';
import {store} from './src/redux/store';
import {Colors} from './src/constants/colors';

enableScreens();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <SafeAreaView style={[styles(isDarkMode).safeArea]}>
        <NavigationContainer>
          <GestureHandlerRootView>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={isDarkMode ? Colors.black : Colors.white}
            />
            <View style={[styles().container]}>
              <AppNavigator />
            </View>
          </GestureHandlerRootView>
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
}

const styles = (isDarkMode?: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? Colors.black : Colors.white,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
    },
  });

export default App;
