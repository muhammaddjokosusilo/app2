
import React, { useState, useCallback, useEffect } from 'react';
import YoutubePlayer from "react-native-youtube-iframe";
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    View,
    StyleSheet,
    Text, 
    Dimensions,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLocalSearchParams, router} from 'expo-router';
import { BASE_URL } from '../config/api';
import { Platform } from 'react-native';

import CardSubContent from '../../component/cardSubMateri';

type SubMateri = {
  id: string;
  nama_subMateri: string;
  video_sub_materi?: {
    video_subMateri: string;
  };
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(311, width - 40);

export default function LoginScreen() {
  // const { materiId } = useLocalSearchParams();
  const [subMateri, setSubMateri] = useState<SubMateri[]>([]);
  const [videoId, setVideoId] = useState<string | null>(null);
  const { materiId } = useLocalSearchParams<{ materiId: string }>();

  const router = useRouter()

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: string) => {
      if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
      }
  }, []);

  useEffect(() => {
  axios
    .get(`${BASE_URL}/sub-materi`, {
      params: { materiId }
    })
    .then(res => {
      setSubMateri(res.data);

      // ambil video dari data pertama saja
      if (res.data.length > 0) {
        setVideoId(res.data[0]?.video_sub_materi?.video_subMateri || null);
      }
    });
}, []);


  return (
      <SafeAreaView style={styles.screen}>
          <View style={styles.container}>
                {/* Header dengan tombol kembali dan judul */}
              {/* Header dengan tombol kembali dan judul */}
              <View style={styles.header}>
                  <TouchableOpacity onPress={() => router.push("/content/materi")} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={22} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.headerTitle}>Sub Materi</Text>
              </View>

              <View style={styles.content}>  
                <View style={{ marginHorizontal: 50 }}>
                  {videoId && (
                    <View style={{ marginHorizontal: 50 }}>
                      {Platform.OS === 'web' ? (
                        <iframe
                          width="100%"
                          height="200"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      ) : (
                        <YoutubePlayer
                          height={200}
                          videoId={videoId}
                          onChangeState={onStateChange}
                        />
                      )}
                    </View>
                  )}
                </View>

                {/* Daftar Pilihan Materi */}
                <View style={styles.cardListContainer}>
                    {subMateri.map(item => (
                        <View style={{ marginBottom: 20 }} key={item.id}>
                            <CardSubContent
                              title={item.nama_subMateri}
                              onPress={() =>
                                router.push({
                                  pathname: '/content/sub_materi',
                                  params: { materiId: item.id },
                                })
                              } 
                            />
                        </View>
                    ))}
                    <View style={{ marginBottom: 20 }}>
                      <CardSubContent 
                        title='Download'
                        onPress={() => 
                          router.push({
                            pathname: '/content/quiz'
                          })
                        }
                        bgColor='#27AE60'
                        color='#FFFFFF'
                      />
                    </View>
                    <View style={{ marginBottom: 20 }}>
                      <TouchableOpacity
                        style={[ buttonCustomStyles.card, {backgroundColor: '#6E8CFB'} ]}
                        onPress={() =>
                          router.push({
                            pathname: '/content/quiz', // ✅ BENAR
                            params: {
                              materiId
                            },
                          })
                        }
                      >
                        <Text style={[buttonCustomStyles.cardText]}>Quiz</Text>
                        <Text style={[buttonCustomStyles.arrowIcon]}>{'>'}</Text>
                    </TouchableOpacity>
                    </View>
                    
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
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 30, // Jarak antara header dan kartu
        width: '100%',
    },
    backButton: {
        padding: 5,
        marginRight: 20,
    },
    backIcon: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    // Content
    content: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    // Card Materi
    cardListContainer: {
        width: '100%',
        alignItems: 'center', // Agar kartu berada di tengah
    },
    card: {
        width: CARD_WIDTH,
        height: 120, // Tinggi kartu agar sesuai dengan gambar
        backgroundColor: 'white',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginVertical: 15, // Jarak antar kartu
        
        // Gaya bayangan kartu yang lebih halus
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    cardImage: {
        width: 100, // Lebar gambar
        height: 80, // Tinggi gambar
    },
    cardText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#27AE60', // Warna teks hijau
        flex: 1, // Agar teks mengambil ruang dan mendorong panah ke kanan
        textAlign: 'right',
        marginRight: 20,
    },
    arrowContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderColor: '#27AE60',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowIcon: {
        fontSize: 20,
        color: '#27AE60',
        fontWeight: 'bold',
        // Sedikit penyesuaian untuk sentrasi visual panah '>'
        marginTop: -3, 
        marginLeft: 2, 
    }
});

const buttonCustomStyles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 70, // Tinggi kartu agar sesuai dengan gambar
    backgroundColor: 'white',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginVertical: 3, // Jarak antar kartu
    
    // Gaya bayangan kartu yang lebih halus
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF', // Warna teks hijau
    flex: 1, // Agar teks mengambil ruang dan mendorong panah ke kanan
    textAlign: 'left',
    marginRight: 20,
  },
  arrowIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    // Sedikit penyesuaian untuk sentrasi visual panah '>'
    marginTop: -3, 
    marginLeft: 2, 
}
})