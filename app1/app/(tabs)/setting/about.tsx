import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  Text, 
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');

// --- Halaman Tentang Aplikasi ---
export default function AboutAppScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Tentang Aplikasi</Text>
                </View>

                {/* === Konten Tentang Aplikasi === */}
                <View style={styles.section}>
                    <Text style={styles.label}>Nama Aplikasi</Text>
                    <Text style={styles.value}>Belajarku</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Versi Aplikasi</Text>
                    <Text style={styles.value}>1.0.0</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Bahasa yang Digunakan</Text>
                    <Text style={styles.value}>React Native</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Deskripsi Singkat</Text>
                    <Text style={styles.value}>
                        Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod 
                        tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim 
                        veniam quis nostrud.
                    </Text>
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

    // === Konten tentang aplikasi ===
    section: {
        marginBottom: 20,
        alignItems: 'flex-start',
        width: '70%',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: 'white',
        paddingLeft: 10,
        lineHeight: 22,
    },
});