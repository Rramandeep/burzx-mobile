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
import {Icon} from 'react-native-paper';

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
        setIsBiometricCancelled(true);
        setBioMetryMessage('Biometric setup is done. pls Login.');
        setTimeout(() => {
          setBioMetryMessage('');
        }, 3000);
      }
    });
  };

  return (
    <View style={styles(isDarkMode).container}>
      <Text style={styles(isDarkMode).mainText}>Use Biometric to log in?</Text>
      <Image
        style={styles().biometricImage}
        resizeMode="cover"
        source={require('../assets/images/biometric.png')}
      />
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
        <TouchableOpacity
          style={styles().navForward}
          onPress={resetToDashBoard}>
          <Icon
            source={'arrow-right'}
            color={isDarkMode ? Colors.white : Colors.black}
            size={30}
          />
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
      backgroundColor: isDarkMode ? Colors.black : Colors.white,
    },
    biometricImage: {
      height: screenWidth * 1.4,
      width: screenWidth,
    },
    navForward: {
      position: 'absolute',
      top: 0,
      right: screenWidth * 0.02,
    },
    loginTextColor: {
      color: '#000',
    },
    mainText: {
      position: 'absolute',
      left: screenWidth * 0.05,
      top: Platform.OS === 'android' ? screenWidth * 0.1 : 0,
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
      width: screenWidth * 0.9,
      alignSelf: 'center',
      elevation: 10,
      paddingVertical: '3%',
      backgroundColor: Colors.green,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default BiometricAuthScreen;
