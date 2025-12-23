
import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Switch,
  StyleSheet,
  Text, 
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');

// --- Halaman Utama ---
export default function MathematicsScreen() {
    const router = useRouter();
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);


    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                {/* Header dengan tombol kembali dan judul */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push("/(tabs)/dashboard/homePage")} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Pengaturan</Text>
                </View>

                {/* Daftar Pilihan Materi*/}
                <View style={styles.cardListContainer}>
                    <View style={{ marginBottom: 20 }}>
                        {/* Tombol untuk ubah profile */}
                        <TouchableOpacity style={[styles.card, { backgroundColor: '#fff' }]} onPress={() => router.push('/(tabs)/setting/ubahProfile')}>
                            <Text style={[styles.cardText, { color: '#27AE60' }]}>Ubah Profile</Text>
                            <View>
                            {/* Menggunakan ikon panah sederhana, ganti dengan aset panah Anda */}
                            <Text style={[styles.arrowIcon, { color: '#27AE60' }]}>{'>'}</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Tombol untuk ubah tema */}
                        <View style={[styles.card, { backgroundColor: '#fff' }]}>
                            <Text style={[styles.cardText, { color: '#27AE60' }]}>Ubah Tema</Text>

                            <Switch
                                trackColor={{false: '#767577', true: '#81b0ff'}}
                                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                        </View>

                        {/* Tombol untuk lihat detail aplikasi */}
                        <TouchableOpacity style={[styles.card, { backgroundColor: '#fff' }]} onPress={() => router.push('/setting/about')}>
                            <Text style={[styles.cardText, { color: '#27AE60' }]}>Tentang Aplikasi</Text>
                            <View>
                            {/* Menggunakan ikon panah sederhana, ganti dengan aset panah Anda */}
                            <Text style={[styles.arrowIcon, { color: '#27AE60' }]}>{'>'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
               
            </View>
        </SafeAreaView>
    );
}

// Lebar kartu disesuaikan agar lebih fleksibel di dalam container hijau
const CARD_WIDTH = Math.min(311, width - 40); 

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

    cardListContainer: {
        width: '100%',
        alignItems: 'center', // Agar kartu berada di tengah
    },
    card: {
        width: CARD_WIDTH,
        height: 50, // Tinggi kartu agar sesuai dengan gambar
        backgroundColor: 'white',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        marginVertical: 5, // Jarak antar kartu
        
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
        color: '#27AE60', // Warna teks hijau
        flex: 1, // Agar teks mengambil ruang dan mendorong panah ke kanan
        textAlign: 'left',
        marginRight: 20,
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