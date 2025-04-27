// navigation/AppNavigator.js
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BiometricAuthScreen from '../screens/biometric';
import Dashboard from '../screens/ dashoard';
import CoinDetails from '../screens/coinDetails';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="BiometricAuthScreen" component={BiometricAuthScreen} />
    <Stack.Screen name="Dashboard" component={Dashboard} />
    <Stack.Screen name="CoinDetail" component={CoinDetails} />
  </Stack.Navigator>
);

export default AppNavigator;
