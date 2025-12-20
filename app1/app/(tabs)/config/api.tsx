import { Platform } from 'react-native';

const LOCAL_IP = '192.168.100.137';

export const BASE_URL = Platform.select({
  web: `http://${LOCAL_IP}:3000`,
  android: Platform.OS === 'android' ? 'http://10.0.2.2:3000' : `http://${LOCAL_IP}:3000`,
  ios: `http://${LOCAL_IP}:3000`,
  default: `http://${LOCAL_IP}:3000`,
});
