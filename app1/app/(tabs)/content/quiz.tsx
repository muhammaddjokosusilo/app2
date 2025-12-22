import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  Text, 
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { BASE_URL } from '../config/api';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

const { width } = Dimensions.get('window');

interface Option {
  id: number;
  label: string;
}

interface QuizItem {
  id: number;
  question: string;
  correctOptionId: number; // ⬅️ tambahan
  options: Option[];
}


// NEW: Type untuk opsi jawaban

export default function QuizScreen() {
  const router = useRouter();
  const [quizData, setQuizData] = useState<QuizItem[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const { materiId, mapelId, levelId } = useLocalSearchParams<{ 
    materiId: string,
    mapelId: string,
    levelId: string, 
  }>();

  const submitQuiz = () => {
    let score = 0;

  quizData.forEach(q => {
    if (selectedAnswers[q.id] === q.correctOptionId) {
      score += 1;
    }
  });
    
  router.replace({
    pathname: '/content/result',
    params: {
      correct: score,
      total: quizData.length,
      materiId,
      mapelId,
      levelId,
    },
  });
  };
  
  useFocusEffect(
    useCallback(() => {
      return () => {
        setSelectedAnswers({});
      };
    }, [])
  );

  useEffect(() => {
    axios
      .get(`${BASE_URL}/quiz`, {
        params: { materiId },
      })
      .then(res => {
        console.log('QUIZ API RESPONSE:', res.data);
        setQuizData(res.data);
        setSelectedAnswers({}); // reset saat ganti materi
      });
  }, [materiId]);

  const chooseAnswer = (questionId: number, optionId: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };





  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => 
              router.push({
                pathname: '/content/sub_materi', // ✅ BENAR
                params: {
                  mapelId,
                  levelId,
                  materiId
                },
              })}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quiz</Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            padding: 20,
            backgroundColor: '#27AE60',
            flexGrow: 1,
          }}
        >
          {quizData.map((q, index) => (
            <View key={q.id} style={styles.quizCard}>
              <Text style={styles.question}>
                {`${index + 1}. ${q.question}`}
              </Text>

              <View style={styles.row}>
                {q.options.map(opt => {
                  const isSelected = selectedAnswers[q.id] === opt.id;

                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.option,
                        {
                          backgroundColor: 
                            selectedAnswers[q.id] && !isSelected ? '#c40101ff' : '#27AE60',
                          // opacity:
                          //   selectedAnswers[q.id] && !isSelected ? 0.4 : 1,
                        },
                      ]}
                      onPress={() => chooseAnswer(q.id, opt.id)}
                    >
                      <Text style={styles.optionText}>{opt.label}</Text>
                    </TouchableOpacity>
                  );
                })}

              </View>
            </View>
          ))}

          {quizData.length > 1 && (
            <TouchableOpacity style={styles.nextBtn} onPress={submitQuiz}>
              <Text style={styles.nextText}>Kirim Jawaban</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
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
  quizContainer: { 
    padding: 20, 
    backgroundColor: "#27AE60", 
    flexGrow: 1, 
    alignItems: "center", 
  }, 
  quizCard: { 
    backgroundColor: "white", 
    padding: 15, 
    borderRadius: 15, 
    width: "100%", 
    marginBottom: 20, 
  }, 
  question: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 15, 
    textAlign: "center", 
    color: "#333", 
  }, 
  row: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "center", 
    gap: 10, 
  }, 
  option: { 
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    borderRadius: 8, 
    minWidth: 100, 
    alignItems: "center", 
  }, 
  optionText: { 
    color: "white", 
    fontWeight: "bold", 
  }, 
  nextBtn: { 
    marginTop: 30, 
    backgroundColor: "#2ECC71", 
    paddingVertical: 12, 
    borderRadius: 10, 
    alignItems: "center" 
  }, 
  nextText: { 
    fontSize: 16, 
    color: "white", 
    fontWeight: "bold" 
  } 
});