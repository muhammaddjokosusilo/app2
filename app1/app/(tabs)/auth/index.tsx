import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/authContext';
import axios, { AxiosError } from 'axios';
import { BASE_URL } from '../config/api';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Gunakan endpoint yang benar (sesuaikan dengan backend)
      const res = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });

      const access_token = res.data.data?.session?.access_token;
      const user = res.data.data?.user;

      if (!access_token || !user) {
        throw new Error('Invalid response from server');
      }

      await login(access_token, user);
      router.replace('/(tabs)/dashboard/homePage');
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Terjadi kesalahan. Coba lagi.';
      
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ error?: string; code?: string }>;

        if (axiosError.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
          Alert.alert(
            'Email Belum Dikonfirmasi',
            'Silakan cek email Anda dan klik link verifikasi terlebih dahulu.'
          );
          return;
        }

        Alert.alert(
          'Login Gagal',
          axiosError.response?.data?.error || 'Terjadi kesalahan'
        );
      } else {
        Alert.alert('Login Gagal', 'Terjadi kesalahan');
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.ConMain}>
            {/* Header with Logo */}
            <View style={styles.header}>
              <Image
                source={require('../../../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Login Form Card */}
            <View style={styles.cardWrapper}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Login</Text>
                
                {/* Input Fields */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#9E9E9E"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      editable={!loading}
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#9E9E9E"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.visibilityBtn}
                      onPress={toggleShowPassword}
                    >
                      <MaterialCommunityIcons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="#aaa"
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.forgotPasswordLink}
                    onPress={() => router.push('./auth/forgot')}
                    disabled={loading}
                  >
                    <Text style={styles.forgotPasswordText}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.loginButtonText}>LOGIN</Text>
                  )}
                </TouchableOpacity>

                {/* Register Section */}
                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>Dont have an account?</Text>
                  <TouchableOpacity
                    onPress={() => router.push('/auth/registerPage')}
                    disabled={loading}
                  >
                    <Text style={styles.registerLink}>REGISTER</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const CARD_WIDTH = Math.min(311, width - 40);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#27AE60',
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ConMain: {
    width: 344,
    height: 544,
  },
  header: {
    height: 150,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 12,
  },
  logo: {
    width: 311,
    height: '100%',
  },

  cardWrapper: {
    alignItems: 'center',
    marginTop: 0,
  },
  card: {
    width: CARD_WIDTH,
    minHeight: 411,
    backgroundColor: '#fff',
    borderRadius: 40,
    paddingVertical: 28,
    paddingHorizontal: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    width: 245,
    marginTop: 18,
    gap: 12,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#D9D9D9',
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    color: '#747474',
    fontSize: 16,
  },
  visibilityBtn: {
    position: 'absolute',
    right: 10,
    top: '25%',
    zIndex: 1,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#27AE60',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#27AE60',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginTop: 40,
    minWidth: 150,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  
  
  registerContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  registerText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 6,
  },
  registerLink: {
    color: '#27AE60',
    fontWeight: '700',
    fontSize: 14,
  },
});