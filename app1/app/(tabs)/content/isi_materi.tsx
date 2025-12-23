import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../config/api';

export default function IsiMateriScreen() {
    const router = useRouter();
  const { subMateriId } = useLocalSearchParams<{ subMateriId: string }>();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const { materiId, mapelId, levelId } = useLocalSearchParams<{ 
    materiId: string,
    mapelId: string,
    levelId: string, 
  }>();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/sub-materi/detail`, {
        params: { subMateriId },
      })
      .then(res => {
        setPdfUrl(res.data.dokumen);
      })
      .finally(() => setLoading(false));
  }, [subMateriId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  if (!pdfUrl) {
    return (
      <View style={styles.center}>
        <Text>PDF tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
        {/* HEADER SELALU ADA */}
        <View style={styles.header}>
            <TouchableOpacity
            onPress={() =>
                router.push({
                pathname: '/content/sub_materi',
                params: { mapelId, levelId, materiId },
                })
            }
            style={styles.backButton}
            >
            <Ionicons name="arrow-back" size={22} color="#27AE60" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Materi</Text>
        </View>

        {/* CONTENT */}
        <View style={{ flex: 1, marginTop: 20 }}>
            {loading && (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#27AE60" />
            </View>
            )}

            {!loading && !pdfUrl && (
                <View style={styles.center}>
                    <Text>PDF tidak ditemukan</Text>
                </View>
            )}

            {!loading && pdfUrl && (
            <>
                <WebView
                source={{
                    uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                    pdfUrl
                    )}`,
                }}
                style={{ flex: 1 }}
                onLoadEnd={() => setPdfLoading(false)}
                />

                {pdfLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#27AE60" />
                    <Text style={styles.loadingText}>
                    Sedang menyiapkan materi…
                    </Text>
                </View>
                )}
            </>
            )}
        </View>
        </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    marginBottom: 30, 
    width: '100%', 
    zIndex: 10,
  }, 
  backButton: { 
    padding: 5, 
    marginRight: 20, 
    color: '#27AE60',
  }, 
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#27AE60', 
  }, 
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },

});
