import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/authContext';
// import { router } from '.expo/types/router';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const { logout } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem('user').then(userStr => {
      const user = JSON.parse(userStr || '{}');

      axios
        .get(`${BASE_URL}/profile-page`, {
          params: { user_id: user.id },
        })
        .then(res => setProfile(res.data));
    });
  }, []);

    const handleLogout = () => {
        Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
            { text: 'Cancel', style: 'cancel' },
            { 
            text: 'Logout', 
            style: 'destructive',
            onPress: async () => {
                await logout();
                router.replace('/');
            }
            }
        ]
        );
    };

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
            {profile.picture ? (
                <Image
                    source={{ uri: profile.picture }}
                    style={styles.avatar}
                />
            ) : (
                <View style={styles.avatarFallback} />
            )}
        </View>

        <View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
        </View>
      </View>

      {/* Card Info */}
      <View style={styles.card}>
        <Text style={styles.label}>Profil</Text>

        <View style={styles.row}>
          <Text style={styles.key}>Sekolah</Text>
          <Text style={styles.value}>{profile.sekolah}</Text>
        </View>
      </View>

      {/* Action */}
      <View style={styles.card}>
        <TouchableOpacity>
          <Text style={styles.action}>Pengaturan</Text>
        </TouchableOpacity>

        <TouchableOpacity
        // style={styles.exitButton}
        onPress={handleLogout}
        >
            {/* <Ionicons name="exit-outline" size={20} color="#E74C3C" /> */}
            <Text style={{ color: '#E74C3C' }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#27AE60',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    marginBottom: 16,
    gap: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 12,
    color: '#666',
  },
    avatarWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },

    avatarFallback: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#000', // ⬅️ hitam polos
    },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  key: {
    color: '#555',
  },
  value: {
    fontWeight: 'bold',
  },
  action: {
    paddingVertical: 10,
    fontWeight: 'bold',
    color: '#27AE60',
  },
});
