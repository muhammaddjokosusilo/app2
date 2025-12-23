import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config/api';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChangeScreen() {
  const router = useRouter();

  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sekolah, setSekolah] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('user').then(userStr => {
      const user = JSON.parse(userStr || '{}');
      setUserId(user.id);

      axios
        .get(`${BASE_URL}/profile-page`, {
          params: { user_id: user.id },
        })
        .then(res => {
          setName(res.data.name);
          setEmail(res.data.email);
          setSekolah(res.data.sekolah);
        });
    });
  }, []);

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/profile-update`, {
        user_id: userId,
        name,
        email,
        sekolah,
      });

      Alert.alert('Sukses', 'Profil berhasil diperbarui', [
        {
          text: 'OK',
          onPress: () => router.push("/(tabs)/setting"),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Gagal update');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/setting")}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Pengaturan</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Input label="Username" value={name} onChangeText={setName} />
        {/* <Input label="Email" value={email} onChangeText={setEmail} /> */}
        <Input
          label="Tingkatan Sekolah"
          value={sekolah}
          onChangeText={setSekolah}
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Ganti</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const Input = ({ label, ...props }: any) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#27AE60',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: '#27AE60',
  },
  label: {
    color: '#fff',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#6C8CFF',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
