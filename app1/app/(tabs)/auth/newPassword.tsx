import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import axios, { AxiosError } from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BASE_URL } from '../config/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(311, width - 40);

function RequirementItem({
  label,
  valid,
}: {
  label: string;
  valid: boolean;
}) {
  return (
    <View style={styles.requirementItem}>
      <MaterialCommunityIcons
        name={valid ? 'check-circle' : 'close-circle'}
        size={16}
        color={valid ? '#19A463' : '#bbb'}
      />
      <Text
        style={[
          styles.requirementText,
          { color: valid ? '#19A463' : '#999' },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}


export default function NewPasswordScreen() {
  const { name, email, sekolah } = useLocalSearchParams<{
    name?: string;
    email?: string;
    sekolah?: string;
  }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const checkPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return Math.min(strength, 5);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordStrength(checkPasswordStrength(text));
  };

  const validatePassword = () => {
    if (password.length < 8) {
      Alert.alert('Password lemah', 'Minimal 8 karakter');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak sama');
      return false;
    }
    if (passwordStrength < 3) {
      Alert.alert('Password lemah', 'Gunakan kombinasi huruf & angka');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validatePassword()) return;
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/register`, {
        name,
        email,
        sekolah,
        password,
      });

      Alert.alert(
        'Registrasi Berhasil 🎉',
        'Silakan login menggunakan akun kamu',
        [{ text: 'OK', onPress: () => router.replace('/') }]
      );
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      Alert.alert('Registrasi gagal', err.response?.data?.error || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = ['#ff4444', '#ff8800', '#ffbb33', '#00C851', '#007E33'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.ConMain}>
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
              {/* User Info */}
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{name}</Text>
                <Text style={styles.userText}>{email}</Text>
                <Text style={styles.userText}>{sekolah}</Text>
              </View>

              {/* Inputs */}
              <View style={styles.inputContainer}>
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={showPassword}
                  />
                  <TouchableOpacity
                    style={styles.visibilityBtn}
                    onPress={toggleShowPassword}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color="#888"
                    />
                  </TouchableOpacity>
                </View>

                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={showPassword}
                  />
                </View>
              </View>

              {/* Password Strength */}
              {password.length > 0 && (
                <View style={styles.strengthBox}>
                  <View style={styles.barRow}>
                    {[...Array(5)].map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.bar,
                          {
                            backgroundColor:
                              i < passwordStrength
                                ? strengthColors[passwordStrength - 1]
                                : '#e0e0e0',
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text
                    style={{
                      color: strengthColors[passwordStrength - 1],
                      fontWeight: '600',
                      fontSize: 12,
                    }}
                  >
                    {strengthLabels[passwordStrength - 1]}
                  </Text>
                </View>
              )}

              {password.length > 0 && (
                <View style={styles.requirements}>
                  <RequirementItem
                    label="Minimal 8 karakter"
                    valid={password.length >= 8}
                  />
                  <RequirementItem
                    label="Mengandung huruf besar (A-Z)"
                    valid={/[A-Z]/.test(password)}
                  />
                  <RequirementItem
                    label="Mengandung angka (0-9)"
                    valid={/[0-9]/.test(password)}
                  />
                  <RequirementItem
                    label="Mengandung simbol (!@#...)"
                    valid={/[^A-Za-z0-9]/.test(password)}
                  />
                </View>
              )}


              {/* Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Kirim</Text>
                )}
              </TouchableOpacity>

              {/* Login */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Sudah punya akun?</Text>
                <Text
                  style={styles.registerLink}
                  onPress={() => router.replace('/')}
                >
                  LOGIN
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#27AE60' },
  container: { flexGrow: 1, alignItems: 'center' },
  ConMain: { width: 312, height: 560 },
  header: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  logo: { width: 300, height: 120 },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 40,
    paddingVertical: 24,
    alignItems: 'center',
    elevation: 8,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 14,
  },
  userName: { fontSize: 16, fontWeight: '700' },
  userText: { fontSize: 12, color: '#666' },

  inputContainer: { width: 245, gap: 12 },
  input: {
    backgroundColor: '#D9D9D9',
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  visibilityBtn: {
    position: 'absolute',
    right: 12,
    top: '25%',
  },
  strengthBox: {
    width: 245,
    marginTop: 12,
    alignItems: 'center',
  },
  barRow: { flexDirection: 'row', gap: 4, marginBottom: 4 },
  bar: { height: 6, width: 40, borderRadius: 3 },

  button: {
    marginTop: 30,
    backgroundColor: '#19A463',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 50,
  },
  buttonText: { color: '#fff', fontWeight: '700' },

  registerContainer: { marginTop: 20, alignItems: 'center' },
  registerText: { fontSize: 12, color: '#666' },
  registerLink: { color: '#19A463', fontWeight: '700' },
  requirements: {
  width: 245,
  marginTop: 10,
  backgroundColor: '#F6F6F6',
  borderRadius: 12,
  padding: 12,
  gap: 6,
},
requirementItem: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},
requirementText: {
  fontSize: 12,
  fontWeight: '500',
},

});
