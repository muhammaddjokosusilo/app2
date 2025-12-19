import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useAuth } from './context/authContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth(); // ✅ DI DALAM COMPONENT

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/login', {
        email,
        password
      });

      // ✅ PERBAIKAN: Pastikan struktur response sesuai
      const access_token = res.data.data?.session?.access_token;
      const user = res.data.data?.user;

      if (!access_token || !user) {
        throw new Error('Invalid response from server');
      }

      // AMBIL DATA DARI RESPONSE YANG SUDAH KITA GABUNGKAN DI BACKEND
      const formattedUser = {
        id: user.id,
        email: user.email,
        name: user.display_name || 'User', // Ambil dari display_name bentukan backend
        sekolah: user.sekolah || 'Tidak Diketahui', // SEKARANG INI AKAN TERISI
      };

      await login(access_token, formattedUser);

      // ✅ PINDAH KE HOME
      router.replace('/auth/homePage'); // Gunakan replace bukan push

    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'Terjadi kesalahan. Coba lagi.';
      
      if (axios.isAxiosError(err)) {
        // Handle Axios error
        const axiosError = err as AxiosError<{ error?: string }>;
        errorMessage = axiosError.response?.data?.error || 
                      axiosError.message || 
                      'Network error';
        
        // Log detail untuk debugging
        console.log('Response status:', axiosError.response?.status);
        console.log('Response data:', axiosError.response?.data);
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      if (Platform.OS === 'web') {
        alert(`Login Failed: ${errorMessage}`);
      } else {
        Alert.alert('Login Failed', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />

      <TouchableOpacity
        onPress={() => router.push('/auth/registerPage')}
        style={styles.link}
      >
        <Text style={styles.linkText}>
          Don't have an account? Register here
        </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333'
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'white'
  },
  link: {
    marginTop: 20,
    alignItems: 'center'
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16
  }
});