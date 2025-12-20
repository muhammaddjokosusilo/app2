// import { useLocalSearchParams, router } from 'expo-router';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { Text, View, TouchableOpacity, FlatList } from 'react-native';
// import { BASE_URL } from '../config/api';

// type Level = {
//   id: string;
//   nama_tingkat: string;
// };

// export default function LevelPage() {
//   const { mapelId } = useLocalSearchParams<{ mapelId: string }>();
//   const [levels, setLevels] = useState<Level[]>([]);

//   useEffect(() => {
//     const fetchLevels = async () => {
//       try {
//         const res = await axios.get(
//           `${BASE_URL}/tingkat-pendidikan`
//         );
//         setLevels(res.data);
//       } catch (err) {
//         console.error('Fetch levels error:', err);
//       }
//     };

//     fetchLevels();
//   }, []);

//   return (
//     <View>
//       <FlatList
//         data={levels}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={() =>
//               router.push({
//                 pathname: '/content/materi', // ✅ BENAR
//                 params: {
//                   mapelId,
//                   levelId: item.id,
//                 },
//               })
//             }
//           >
//             <Text>{item.nama_tingkat}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

import CardLevelEdu from '../../component/cardLevelEdu';
import { BASE_URL } from '../config/api';

const { width } = Dimensions.get('window');

type Level = {
  id: string;
  nama_tingkat: string;
};

export default function LevelEducationScreen() {
  const router = useRouter();
  const { mapelId } = useLocalSearchParams<{ mapelId: string }>();

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tingkat-pendidikan`);
        setLevels(res.data);
      } catch (err) {
        console.error('Fetch levels error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Level Education</Text>
        </View>

        {/* Content */}
        <View style={styles.cardListContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#27AE60" />
          ) : (
              <FlatList
                data={levels}
                keyExtractor={(item) => item.id}
                style={{ marginBottom: 20 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '/content/materi', // ✅ BENAR
                        params: {
                          mapelId,
                          levelId: item.id,
                        },
                      })
                    }
                  >
                    <CardLevelEdu
                      level={item.nama_tingkat}
                      imageSource={
                        item.nama_tingkat === 'SD'
                          ? require('../../../assets/images/sd.png')
                          : item.nama_tingkat === 'SMP'
                          ? require('../../../assets/images/smp.png')
                          : require('../../../assets/images/sma.png')
                      }
                    />
                  </TouchableOpacity>
                )}
              />
            )}
        </View>
      </View>
    </SafeAreaView>
  );
}


const CARD_WIDTH = Math.min(311, width - 40);

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
