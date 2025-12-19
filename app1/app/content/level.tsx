import { useLocalSearchParams, router } from 'expo-router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';

type Level = {
  id: string;
  nama_tingkat: string;
};

export default function LevelPage() {
  const { mapelId } = useLocalSearchParams<{ mapelId: string }>();
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await axios.get(
          'http://localhost:3000/tingkat-pendidikan'
        );
        setLevels(res.data);
      } catch (err) {
        console.error('Fetch levels error:', err);
      }
    };

    fetchLevels();
  }, []);

  return (
    <View>
      <FlatList
        data={levels}
        keyExtractor={(item) => item.id}
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
            <Text>{item.nama_tingkat}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
