import { useLocalSearchParams, router } from 'expo-router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { BASE_URL } from '../config/api';

type SubMateri = {
  id: string;
  nama_subMateri: string;  
};

export default function MateriPage() {
  const { materiId } = useLocalSearchParams();
  const [subMateri, setSubMateri] = useState<SubMateri[]>([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/sub-materi`, {
        params: { materiId }
      })
      .then(res => setSubMateri(res.data));
  }, []);

  return (
    <View>
      <FlatList
        data={subMateri}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            // onPress={() =>
            //   router.push({
            //     pathname: '/content/sub_materi', // ✅ BENAR
            //     params: {
            //       materiId: item.id,
            //     },
            //   })
            // }
          >
            <Text>{item.nama_subMateri}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
