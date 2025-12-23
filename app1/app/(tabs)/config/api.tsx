import { Platform } from 'react-native';
import * as Device from 'expo-device';

const LOCAL_IP = '10.190.110.16';
const PORT = 3000;

export const BASE_URL = (() => {
  // WEB
  if (Platform.OS === 'web') {
    return `http://localhost:${PORT}`;
  }

  // ANDROID
  if (Platform.OS === 'android') {
    if (!Device.isDevice) {
      // Android Emulator
      return `http://10.0.2.2:${PORT}`;
    }
    // Android HP fisik
    return `http://${LOCAL_IP}:${PORT}`;
  }

  // iOS Simulator / Device
  return `http://${LOCAL_IP}:${PORT}`;
})();
