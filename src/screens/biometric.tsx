import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  useColorScheme,
  Platform,
} from 'react-native';
import Text from '../components/text';
import ReactNativeBiometrics from 'react-native-biometrics';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Colors} from '../constants/colors';

const rnBiometrics = new ReactNativeBiometrics({allowDeviceCredentials: true});
const screenWidth = Dimensions.get('window').width;

const BiometricAuthScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const [biometryMessage, setBioMetryMessage] = useState<string>('');
  const [isBiometricCancelled, setIsBiometricCancelled] =
    useState<boolean>(false);
  const [isBiometricAvailable, setIsBiometricAvailable] =
    useState<boolean>(true);
  const resetToDashBoard = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Dashboard'}], // Or whatever screen you want to land on
      }),
    );
  }, [navigation]);

  const handleBiometricAuth = useCallback(async (): Promise<void> => {
    try {
      const {available, biometryType} = await rnBiometrics.isSensorAvailable();

      if (!available) {
        setIsBiometricAvailable(false);
        setBioMetryMessage('BioMetric not available');
        setTimeout(() => {
          setBioMetryMessage('');
        }, 3000);
        return;
      }

      const {keysExist} = await rnBiometrics.biometricKeysExist();

      if (keysExist) {
        const {success} = await rnBiometrics.simplePrompt({
          promptMessage: `Confirm ${biometryType}`,
        });

        if (success) {
          resetToDashBoard();
        } else {
          setIsBiometricCancelled(true);
          setBioMetryMessage('User cancelled biometric.');
          setTimeout(() => {
            setBioMetryMessage('');
          }, 3000);
        }
      } else {
        setBioMetryMessage(
          'Biometric key does not exist. please setup up biometric',
        );
        setTimeout(() => {
          setBioMetryMessage('');
        }, 3000);
      }
    } catch (error) {
      setBioMetryMessage('Biometric authentication failed.');
      setTimeout(() => {
        setBioMetryMessage('');
      }, 3000);
    }
  }, [resetToDashBoard]);

  useEffect(() => {
    handleBiometricAuth();
  }, [handleBiometricAuth]);

  const createBiometricKeys = () => {
    rnBiometrics.createKeys().then(resultObject => {
      const {publicKey} = resultObject;
      if (publicKey) {
        setBioMetryMessage('Biometric setup is done.');
        setTimeout(() => {
          setBioMetryMessage('');
        }, 3000);
      }
    });
  };

  return (
    <View style={styles(isDarkMode).container}>
      <Text style={styles(isDarkMode).mainText}>Use Biometric to log in?</Text>
      <Image source={require('../assets/images/biometric.png')} />
      {isBiometricAvailable && (
        <TouchableOpacity
          style={[styles().Button]}
          onPress={
            isBiometricCancelled ? handleBiometricAuth : createBiometricKeys
          }>
          <Text style={styles().loginTextColor}>
            {isBiometricCancelled ? 'Login' : 'Set Up'}
          </Text>
        </TouchableOpacity>
      )}
      {Platform.OS === 'ios' && (
        <TouchableOpacity style={[styles().Button]} onPress={resetToDashBoard}>
          <Text style={styles().loginTextColor}>Login</Text>
        </TouchableOpacity>
      )}

      {!isBiometricAvailable && (
        <TouchableOpacity style={[styles().Button]} onPress={resetToDashBoard}>
          <Text style={styles().loginTextColor}>Login</Text>
        </TouchableOpacity>
      )}
      {biometryMessage && (
        <View style={styles().toastMessage}>
          <Text
            style={{
              color: Colors.white,
            }}>
            {biometryMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = (isDarkMode?: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 24,
      backgroundColor: isDarkMode ? Colors.black : Colors.white,
    },
    loginTextColor: {
      color: '#000',
    },
    mainText: {
      width: screenWidth * 0.54,
      color: isDarkMode ? Colors.white : Colors.black,
      fontSize: screenWidth * 0.08,
    },
    toastMessage: {
      position: 'absolute',
      alignSelf: 'center',
      bottom: 20,
      paddingVertical: '5%',
      paddingHorizontal: '5%',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.cardGrey,
    },
    Button: {
      elevation: 10,
      paddingVertical: '3%',
      backgroundColor: Colors.green,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default BiometricAuthScreen;
