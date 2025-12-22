import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../config/api';

import axios from 'axios';
import CardSubContent from '../../component/cardSubMateri';

type Materi = {
  id: string;
  judul: string;  
};

export default function MateriPage() {
  const { mapelId, levelId } = useLocalSearchParams<{
    mapelId: string;
    levelId: string;
  }>();

  const [materi, setMateri] = useState<Materi[]>([]);
  const { materiId } = useLocalSearchParams<{ materiId?: string }>();

  console.log('materiId di halaman materi:', materiId);  // Tambahkan ini untuk debug

  useEffect(() => {
    axios.get(`${BASE_URL}/materi`, {
      params: { mapelId, levelId, materiId}
    }).then(res => setMateri(res.data));
  }, [mapelId, levelId, materiId]);

  return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/content/level', // ✅ BENAR
                  params: {
                    mapelId
                  },
                })
              }
            >
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Materi</Text>
          </View>

          {/* Content */}
          <View>
            <View style={styles.cardListContainer}>
              {materi.map(item => (
                <View key={item.id} style={{ marginBottom: 20 }}>
                  <CardSubContent
                    title={item.judul}
                    onPress={() =>
                      router.push({
                        pathname: '/content/sub_materi',
                        params: { 
                          mapelId,
                          levelId,
                          materiId: item.id 
                        },
                      })
                    }
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        

      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#27AE60',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 30,
    width: '100%',
  },
  backButton: {
    padding: 5,
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  cardListContainer: {
    width: '100%',
    alignItems: 'center',
  },
});