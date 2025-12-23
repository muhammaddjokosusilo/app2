import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { BASE_URL } from '../config/api';

export default function LibraryScreen() {
  const [data, setData] = useState([]);
  const router = useRouter();

    useFocusEffect(
      useCallback(() => {
        fetchLibrary();
      }, [])
    );

  const fetchLibrary = async () => {
    const userStr = await AsyncStorage.getItem('user');
    const user = JSON.parse(userStr || '{}');

    const res = await axios.get(`${BASE_URL}/library`, {
      params: { user_id: user.id },
    });

    setData(res.data);
  };

  // useEffect(() => {
  //   AsyncStorage.getItem('user').then(userStr => {
  //     const user = JSON.parse(userStr || '{}');

  //     axios
  //       .get(`${BASE_URL}/library`, { params: { user_id: user.id } })
  //       .then(res => setData(res.data));
  //   });
  // }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#27AE60' }}>
      <Text style={{ color: '#fff', fontSize: 24, margin: 16 }}>
        My Library
      </Text>

        {data.map((item: any) => {
            const styleByTingkat = getStyleByTingkat(
                item.tingkat_pendidikan?.nama_tingkat
            );

            return (
                <TouchableOpacity
                key={item.id}
                style={[
                    styles.card,
                    { backgroundColor: styleByTingkat.cardColor },
                ]}
                onPress={() =>
                    router.push({
                    pathname: '/content/sub_materi',
                    params: {
                        mapelId: item.mapel_id,
                        levelId: item.level_id,
                        materiId: item.materi_id,
                    },
                    })
                }
                >
                <Text style={styles.title}>
                    {item.materi?.judul}
                </Text>

                <Text style={styles.sub}>
                    {item.mata_pelajaran?.nama_mapel} - {item.tingkat_pendidikan?.nama_tingkat}

                </Text>

                <View
                    style={[
                    styles.btn,
                    { backgroundColor: styleByTingkat.buttonColor },
                    ]}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    Buka PDF
                    </Text>
                </View>
            </TouchableOpacity>
        );
        })}

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  card: {
    // backgroundColor: '#E74C3C',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sub: {
    color: '#fff',
    opacity: 0.9,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: '#2ECC71',
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
});

const getStyleByTingkat = (namaTingkat?: string) => {
  switch (namaTingkat?.toLowerCase()) {
    case 'sd':
      return {
        cardColor: '#E74C3C',   // merah
        buttonColor: '#2ECC71', // hijau
      };
    case 'smp':
      return {
        cardColor: '#2980B9',   // biru
        buttonColor: '#27AE60',
      };
    case 'sma':
      return {
        cardColor: '#8E44AD',   // ungu
        buttonColor: '#F39C12',
      };
    default:
      return {
        cardColor: '#34495E',   // abu gelap (fallback)
        buttonColor: '#2ECC71',
      };
  }
};

