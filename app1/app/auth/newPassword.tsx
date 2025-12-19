import React, { useState } from 'react';

import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import axios, { AxiosError } from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { BASE_URL } from '../config/api';

export default function NewPasswordScreen() {
  const { name, email } = useLocalSearchParams<{
    name?: string;
    email?: string;
  }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength checker
  const checkPasswordStrength = (pass: string) => {
    let strength = 0;
    
    // Length check
    if (pass.length >= 8) strength += 1;
    if (pass.length >= 12) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(pass)) strength += 1; // Uppercase
    if (/[a-z]/.test(pass)) strength += 1; // Lowercase
    if (/[0-9]/.test(pass)) strength += 1; // Numbers
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1; // Special chars
    
    return Math.min(strength, 5);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordStrength(checkPasswordStrength(text));
  };

  const validatePassword = () => {
    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return false;
    }

    if (passwordStrength < 3) {
      Alert.alert(
        'Weak Password',
        'Please use a stronger password with a mix of letters, numbers, and symbols'
      );
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
            password
        });
        
        router.replace('/');

        Alert.alert(
            'Registrasi Berhasil 🎉',
            'Akun kamu berhasil dibuat.\nSilakan login menggunakan email dan password.',
            [
            {
                text: 'Ke Halaman Login',
                onPress: () => {
                router.replace('/');
                }
            }
            ]
        );
    } catch (error) {
        const axiosError = error as AxiosError<{ error: string }>;
        const errorMessage =
            axiosError.response?.data?.error || 'Registrasi gagal';

        Alert.alert('Registrasi Gagal', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    const colors = ['#ff4444', '#ff8800', '#ffbb33', '#00C851', '#007E33'];
    return colors[passwordStrength] || '#ff4444';
  };

  const getStrengthText = () => {
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return texts[passwordStrength];
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior="padding"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>

          <Text style={styles.title}>Create Password</Text>
          <Text style={styles.subtitle}>Step 2 of 2: Security</Text>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Create a strong password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon 
                  name={showPassword ? "visibility-off" : "visibility"} 
                  size={24} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBarContainer}>
                  {[...Array(5)].map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.strengthBar,
                        {
                          backgroundColor: index < passwordStrength 
                            ? getStrengthColor() 
                            : '#e0e0e0',
                          flex: 1,
                          marginHorizontal: 2,
                        }
                      ]}
                    />
                  ))}
                </View>
                <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
                  {getStrengthText()}
                </Text>
              </View>
            )}

            {/* Password Requirements */}
            <View style={styles.requirements}>
              <Text style={styles.requirementsTitle}>Password must contain:</Text>
              <View style={styles.requirementItem}>
                <Icon 
                  name={password.length >= 8 ? "check-circle" : "radio-button-unchecked"} 
                  size={16} 
                  color={password.length >= 8 ? '#4CAF50' : '#999'} 
                />
                <Text style={styles.requirementText}>At least 8 characters</Text>
              </View>
              <View style={styles.requirementItem}>
                <Icon 
                  name={/[A-Z]/.test(password) ? "check-circle" : "radio-button-unchecked"} 
                  size={16} 
                  color={/[A-Z]/.test(password) ? '#4CAF50' : '#999'} 
                />
                <Text style={styles.requirementText}>One uppercase letter</Text>
              </View>
              <View style={styles.requirementItem}>
                <Icon 
                  name={/[0-9]/.test(password) ? "check-circle" : "radio-button-unchecked"} 
                  size={16} 
                  color={/[0-9]/.test(password) ? '#4CAF50' : '#999'} 
                />
                <Text style={styles.requirementText}>One number</Text>
              </View>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!loading}
            />
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Terms and Conditions */}
          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>{' '}
            and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    padding: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  userInfo: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#d1e7ff',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 15,
  },
  strengthContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  strengthBarContainer: {
    flexDirection: 'row',
    flex: 1,
    height: 6,
    marginRight: 10,
  },
  strengthBar: {
    borderRadius: 3,
  },
  strengthText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  requirements: {
    marginTop: 15,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#495057',
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6c757d',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: '#007AFF',
    fontWeight: '500',
  },
});