import { useLocalSearchParams, router } from 'expo-router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';

type Materi = {
  id: string;
  judul: string;  
};

export default function MateriPage() {
  const { mapelId, levelId } = useLocalSearchParams();
  const [materi, setMateri] = useState<Materi[]>([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/materi`, {
        params: { mapelId, levelId }
      })
      .then(res => setMateri(res.data));
  }, []);

  return (
    <View>
      {/* {materi.map((item) => (
        <Text key={item.id}>{item.judul}</Text>
      ))} */}
      <FlatList
        data={materi}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/content/sub_materi', // ✅ BENAR
                params: {
                  materiId: item.id,
                },
              })
            }
          >
            <Text>{item.judul}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
