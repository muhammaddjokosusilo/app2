import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Button,
  Alert,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import { useAuth } from '../context/authContext';

type Subject = {
  id: string;
  nama_mapel: string;
  image_url: string;
};

export default function HomeScreen() {
  const { user, token, logout, isLoading } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        }
      ]
    );
    router.replace('/');
  };


  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/mata-pelajaran');
      setSubjects(response.data); // ⬅️ SEKARANG ARRAY
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  
  const fetchUserData = async () => {
    if (!token) {
      Alert.alert('Error', 'No authentication token found');
      return;
    }
    
    try {
      const response = await axios.get('http://localhost:3000/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      Alert.alert('Profile', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Fetch profile error:', error);
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again');
        await logout();
        router.replace('/');
      } else {
        Alert.alert('Error', 'Failed to fetch profile data');
      }
    }
  };
  
  // Tampilkan loading indicator
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading...</Text>
      </View>
    );
  }
  
  // Jika tidak ada user, redirect ke login
  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>No user found. Please login.</Text>
        <Button title="Go to Login" onPress={() => router.replace('/')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome Home, {user?.name}!</Text>
      
      <View style={styles.userInfo}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>
        
        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{user.id}</Text>

        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user.name}</Text>

        <Text style={styles.label}>Sekolah:</Text>
        <Text style={styles.value}>{user.sekolah}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Get Profile Data" 
          onPress={fetchUserData}
          color="#4CAF50"
        />
        
        <View style={styles.spacer} />
        
        <Button 
          title="Logout" 
          onPress={handleLogout}
          color="#FF3B30"
        />
      </View>
      <Text style={styles.header}>Daftar Mata Pelajaran</Text>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '../content/level',
                  params: { mapelId: item.id }
                })
              }
            >
              <Image
                source={{ uri: item.image_url }}
                style={styles.image}
                resizeMode="cover"
              />
              <Text style={styles.subjectName}>{item.nama_mapel}</Text>
            </TouchableOpacity>          
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 30,
    color: '#333'
  },
  userInfo: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 10
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5
  },
  buttonContainer: {
    marginTop: 20
  },
  spacer: {
    height: 15
  },
  // Image
  header: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderWidth: 1, 
    borderColor: '#eee', 
    borderRadius: 10, 
    marginBottom: 10 
  },
  image: { 
    width: 60, 
    height: 60, 
    borderRadius: 8, 
    marginRight: 15 
  },
  subjectName: { 
    fontSize: 18, 
    fontWeight: '500' 
  }
});