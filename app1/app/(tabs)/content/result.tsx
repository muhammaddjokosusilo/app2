import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface UserData {
  id: string;
  email: string;
  name: string;
}

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const correct = parseInt(params.correct as string) || 0;
  const total = parseInt(params.total as string) || 1;
  const materiId = params.materiId as string;
  
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const score = (correct / total) * 100;
  const isPassed = score >= 70;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareResult = async () => {
    try {
      const message = `🎯 Hasil Quiz Saya:\n✅ ${correct} dari ${total} benar\n📊 Score: ${score.toFixed(1)}%\n${isPassed ? '🎉 LULUS!' : '📚 Belajar lagi yuk!'}`;
      
      await Share.share({
        message,
        title: 'Hasil Quiz Saya',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getScoreColor = () => {
    if (score >= 80) return '#27AE60';
    if (score >= 60) return '#F39C12';
    return '#E74C3C';
  };

  const getScoreMessage = () => {
    if (score >= 90) return 'Luar Biasa! 🎉';
    if (score >= 80) return 'Bagus Sekali! 👍';
    if (score >= 70) return 'Bagus! 😊';
    if (score >= 60) return 'Cukup Baik! 💪';
    return 'Belajar Lagi Yuk! 📚';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Memuat hasil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.push("/content/materi")} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hasil Quiz</Text>
        </View>

        <View style={styles.content}>
          {/* Score Circle */}
          <View style={styles.scoreContainer}>
            <View style={[styles.scoreCircle, { borderColor: getScoreColor() }]}>
              <Text style={styles.scoreText}>{score.toFixed(1)}%</Text>
              <Text style={styles.scoreLabel}>Nilai</Text>
            </View>
            
            <Text style={[styles.scoreMessage, { color: getScoreColor() }]}>
              {getScoreMessage()}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#2ECC71' }]}>
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>{correct}</Text>
              <Text style={styles.statLabel}>Jawaban Benar</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#E74C3C' }]}>
                <Ionicons name="close-circle" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>{total - correct}</Text>
              <Text style={styles.statLabel}>Jawaban Salah</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#3498DB' }]}>
                <Ionicons name="list-circle" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>{total}</Text>
              <Text style={styles.statLabel}>Total Soal</Text>
            </View>
          </View>

          {/* User Info */}
          {user && (
            <View style={styles.userInfo}>
              <Ionicons name="person-circle" size={40} color="#FFFFFF" />
              <View style={styles.userText}>
                <Text style={styles.userName}>{user.name || user.email}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.retryBtn]}
              onPress={() => router.push({
                pathname: "/content/quiz",
                params: { materiId }
              })}
            >
              <Ionicons name="refresh" size={20} color="#27AE60" />
              <Text style={[styles.actionText, { color: '#27AE60' }]}>
                Coba Lagi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionBtn, styles.shareBtn]}
              onPress={shareResult}
            >
              <Ionicons name="share-social" size={20} color="#3498DB" />
              <Text style={[styles.actionText, { color: '#3498DB' }]}>
                Bagikan
              </Text>
            </TouchableOpacity>
          </View>

          {/* Main Action */}
          <TouchableOpacity 
            style={[styles.mainActionBtn, !isPassed && { backgroundColor: '#E74C3C' }]}
            onPress={() => router.push("/content/materi")}
          >
            <Ionicons 
              name={isPassed ? "checkmark-circle" : "arrow-redo"} 
              size={22} 
              color="#FFFFFF" 
            />
            <Text style={styles.mainActionText}>
              {isPassed ? 'Kembali ke Materi' : 'Pelajari Kembali'}
            </Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: '100%',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  scoreMessage: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 30,
  },
  userText: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  actionsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  retryBtn: {
    borderWidth: 2,
    borderColor: '#27AE60',
  },
  shareBtn: {
    borderWidth: 2,
    borderColor: '#3498DB',
  },
  actionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  mainActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ECC71',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
  },
  mainActionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
});