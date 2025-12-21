import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  Text, 
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
const { width } = Dimensions.get('window');
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


// NEW: Type untuk opsi jawaban
interface Option {
  id: number;
  label: string;
  color: string;
}

interface QuizItem {
  id: number;
  question: string;
  options: Option[];
  correctOptionId: number;
}

export default function TemplateScreen() {
  const router = useRouter();

  // ❗ Pindahkan quizData ke atas sebelum useState
  const quizData: QuizItem[] = [
    {
      id: 1,
      question: "Rumus keliling lingkaran adalah...",
      options: [
        { id: 1, label: "K=2×πr", color: "#3498DB" },
        { id: 2, label: "K=π×d", color: "#E74C3C" },
        { id: 3, label: "K=2πr", color: "#27AE60" },
        { id: 4, label: "K=π×r×d", color: "#F1C40F" },
      ],
      correctOptionId: 3,
    },
    {
      id: 2,
      question: "Jari-jari 9 cm. Keliling lingkaran adalah...",
      options: [
        { id: 1, label: "50,25", color: "#3498DB" },
        { id: 2, label: "56,52", color: "#E74C3C" },
        { id: 3, label: "62,25", color: "#F39C12" },
        { id: 4, label: "65,25", color: "#27AE60" },
      ],
      correctOptionId: 2,
    },
  ];

  // NEW: Jawaban per soal
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    Array(quizData.length).fill(null)
  );

  const chooseAnswer = (questionIndex: number, optionId: number) => {
    const updated = [...selectedAnswers];
    updated[questionIndex] = optionId;
    setSelectedAnswers(updated);
  };

  const checkAnswers = () => {
    let count = 0;

    quizData.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctOptionId) count++;
    });

    router.push({
      pathname: "/content/result",
      params: {
        correct: count,
        total: quizData.length,
      },
    });
  };

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
          <Text style={styles.headerTitle}>Quiz</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.quizContainer}
          showsVerticalScrollIndicator={false}
        >

          {quizData.map((q, index) => (
            <View key={q.id} style={styles.quizCard}>
              <Text style={styles.question}>{`${index + 1}. ${q.question}`}</Text>

              <View style={styles.row}>
                {q.options.map(opt => {
                  const isSelected = selectedAnswers[index] === opt.id;

                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.option,
                        {
                          backgroundColor: opt.color,
                          opacity: selectedAnswers[index] && !isSelected ? 0.4 : 1,
                        },
                      ]}
                      onPress={() => chooseAnswer(index, opt.id)}
                    >
                      <Text style={styles.optionText}>{opt.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          <TouchableOpacity 
            style={styles.nextBtn}
            onPress={checkAnswers} 
          >
            <Text style={styles.nextText}>Lihat Hasil</Text>
          </TouchableOpacity>

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
    width: "85%",
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