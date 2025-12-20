import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { BASE_URL } from '../config/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(311, width - 40);

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sekolah, setSekolah] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleContinue = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Nama wajib diisi');
      return;
    }

    if (!email.trim() || !validateEmail(email)) {
      Alert.alert('Error', 'Email tidak valid');
      return;
    }

    if (!sekolah.trim()) {
      Alert.alert('Error', 'Sekolah wajib diisi');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/check-email`, { email });

      if (res.data?.exists) {
        Alert.alert(
          'Email sudah terdaftar',
          'Silakan login',
          [{ text: 'OK', onPress: () => router.replace('/') }]
        );
        return;
      }
    } catch {
      // jika endpoint belum ada → lanjut saja
    }

    router.push({
      pathname: '/auth/newPassword',
      params: { name, email, sekolah },
    });

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Logo */}
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Step 1 of 2</Text>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Nama Lengkap"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />

              <TextInput
                placeholder="Email"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                placeholder="Nama Sekolah"
                style={styles.input}
                value={sekolah}
                onChangeText={setSekolah}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.disabled]}
              onPress={handleContinue}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Sudah punya akun?</Text>
              <Text
                style={styles.loginLink}
                onPress={() => router.replace('/')}
              >
                LOGIN
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#27AE60',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    height: 160,
    justifyContent: 'flex-end',
  },
  logo: {
    width: 260,
    height: 120,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#777',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#D9D9D9',
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#19A463',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  loginContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 12,
    color: '#666',
  },
  loginLink: {
    color: '#19A463',
    fontWeight: '700',
    marginTop: 4,
  },
});
