import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text, 
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from "expo-router";
const { width } = Dimensions.get('window');

type Props = {
  level: string;
  imageSource: any;
};

export default function CardLevelEdu({ level, imageSource}: Props) {
  const router = useRouter();
  return (

    <TouchableOpacity style={styles.card} onPress={() => router.push('/content/materi')}>
        <Image source={imageSource} style={styles.cardImage} resizeMode="contain" />
        <Text style={styles.cardText}>{level}</Text>
        <View style={styles.arrowContainer}>
        {/* Menggunakan ikon panah sederhana, ganti dengan aset panah Anda */}
        <Text style={styles.arrowIcon}>{'>'}</Text>
        </View>
    </TouchableOpacity>
)};

const CARD_WIDTH = Math.min(311, width - 40); 

const styles = StyleSheet.create({
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
        height: 100, // Tinggi gambar
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