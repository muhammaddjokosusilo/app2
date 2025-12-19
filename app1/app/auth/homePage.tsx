// import React, { useEffect, useState } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   Button,
//   Alert,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   TouchableOpacity
// } from 'react-native';
// import axios from 'axios';
// import { router } from 'expo-router';
// import { useAuth } from '../context/authContext';
// import { BASE_URL } from '../config/api';

// type Subject = {
//   id: string;
//   nama_mapel: string;
//   image_url: string;
// };

// export default function HomeScreen() {
//   const { user, token, logout, isLoading } = useAuth();
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchSubjects();
//   }, []);

//   const handleLogout = () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Logout', 
//           style: 'destructive',
//           onPress: async () => {
//             await logout();
//             router.replace('/');
//           }
//         }
//       ]
//     );
//     router.replace('/');
//   };


//   const fetchSubjects = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/mata-pelajaran`);
//       setSubjects(response.data); // ⬅️ SEKARANG ARRAY
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };


  
//   const fetchUserData = async () => {
//     if (!token) {
//       Alert.alert('Error', 'No authentication token found');
//       return;
//     }
    
//     try {
//       const response = await axios.get(`${BASE_URL}/profile`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       Alert.alert('Profile', JSON.stringify(response.data, null, 2));
//     } catch (error) {
//       console.error('Fetch profile error:', error);
      
//       if (axios.isAxiosError(error) && error.response?.status === 401) {
//         Alert.alert('Session Expired', 'Please login again');
//         await logout();
//         router.replace('/');
//       } else {
//         Alert.alert('Error', 'Failed to fetch profile data');
//       }
//     }
//   };
  
//   // Tampilkan loading indicator
//   if (isLoading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#007AFF" />
//         <Text>Loading...</Text>
//       </View>
//     );
//   }
  
//   // Jika tidak ada user, redirect ke login
//   if (!user) {
//     return (
//       <View style={styles.centered}>
//         <Text>No user found. Please login.</Text>
//         <Button title="Go to Login" onPress={() => router.replace('/')} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.welcome}>Welcome Home, {user?.name}!</Text>
      
//       <View style={styles.userInfo}>
//         <Text style={styles.label}>Email:</Text>
//         <Text style={styles.value}>{user.email}</Text>
        
//         <Text style={styles.label}>User ID:</Text>
//         <Text style={styles.value}>{user.id}</Text>

//         <Text style={styles.label}>Name:</Text>
//         <Text style={styles.value}>{user.name}</Text>

//         <Text style={styles.label}>Sekolah:</Text>
//         <Text style={styles.value}>{user.sekolah}</Text>
//       </View>
      
//       <View style={styles.buttonContainer}>
//         <Button 
//           title="Get Profile Data" 
//           onPress={fetchUserData}
//           color="#4CAF50"
//         />
        
//         <View style={styles.spacer} />
        
//         <Button 
//           title="Logout" 
//           onPress={handleLogout}
//           color="#FF3B30"
//         />
//       </View>
//       <Text style={styles.header}>Daftar Mata Pelajaran</Text>
//       <FlatList
//         data={subjects}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <TouchableOpacity
//               onPress={() =>
//                 router.push({
//                   pathname: '../content/level',
//                   params: { mapelId: item.id }
//                 })
//               }
//             >
//               <Image
//                 source={{ uri: item.image_url }}
//                 style={styles.image}
//                 resizeMode="cover"
//               />
//               <Text style={styles.subjectName}>{item.nama_mapel}</Text>
//             </TouchableOpacity>          
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff'
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   welcome: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 30,
//     color: '#333'
//   },
//   userInfo: {
//     backgroundColor: '#f9f9f9',
//     padding: 20,
//     borderRadius: 10,
//     marginBottom: 30
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#666',
//     marginTop: 10
//   },
//   value: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 5
//   },
//   buttonContainer: {
//     marginTop: 20
//   },
//   spacer: {
//     height: 15
//   },
//   // Image
//   header: { 
//     fontSize: 22, 
//     fontWeight: 'bold', 
//     marginBottom: 20 
//   },
//   card: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     padding: 15, 
//     borderWidth: 1, 
//     borderColor: '#eee', 
//     borderRadius: 10, 
//     marginBottom: 10 
//   },
//   image: { 
//     width: 60, 
//     height: 60, 
//     borderRadius: 8, 
//     marginRight: 15 
//   },
//   subjectName: { 
//     fontSize: 18, 
//     fontWeight: '500' 
//   }
// });

import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { BASE_URL } from '../config/api';
import { Background } from '@react-navigation/elements';

type GridItemProps = {
  image: any;
  title: string;
};

const { width } = Dimensions.get('window');

// Interface untuk mata pelajaran
type Subject = {
  id: string;
  nama_mapel: string;
  image_url: string;
};

function GridItem({ image, title }: GridItemProps) {
  return (
    <TouchableOpacity style={gridStyles.gridItem} onPress={() => router.push('/content/level')}>
      <View style={[gridStyles.iconBox, { backgroundColor: "#fff" }]}>
        <View
          style={{
            width: 73,
            height: "70%",
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={image}
            style={{
              width: 48,
              height: 48,
              resizeMode: 'contain',
            }}
          />
        </View>
        <Text style={gridStyles.iconLabel}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function DashboardScreen() {
  const { user, token, logout, isLoading } = useAuth();
  const [search, setSearch] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  // Fetch data saat component mount
  useEffect(() => {
    if (user && token) {
      fetchUserProfile();
      fetchSubjects();
    }
  }, [user, token]);

  // Fungsi untuk mengambil data profil user dari backend
  const fetchUserProfile = async () => {
    if (!token) {
      Alert.alert('Error', 'No authentication token found');
      return;
    }
    
    try {
      const response = await axios.get(`${BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // setUserData(response.data.data);
      setUserData(response.data);
    } catch (error: any) {
      console.error('Fetch profile error:', error);
      
      // Jika token expired, logout
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again');
        await logout();
        router.replace('/');
      }
    }
    
  };

  // Fungsi untuk mengambil data mata pelajaran
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/mata-pelajaran`);
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      Alert.alert('Error', 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk logout
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
  };

  // Filter subjects berdasarkan pencarian
  const filteredSubjects = subjects.filter(subject =>
    subject.nama_mapel.toLowerCase().includes(search.toLowerCase())
  );

  // Jika masih loading auth
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#14A35A" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Jika tidak ada user, redirect ke login
  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.noUserText}>No user found. Please login.</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header dengan Card Profile dan Search */}
        <View style={styles.header}>
          <View style={styles.headerCard}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>
                Halo, {userData?.username || 'User'}!
              </Text>
              <View style={styles.searchBox}>
                <TextInput
                  style={styles.input}
                  placeholder="🔍  Kamu mau belajar apa hari ini ?"
                  placeholderTextColor="#ffffffcc"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={styles.avatarContainer}
                onPress={fetchUserProfile}
              >
                <Image 
                  source={userData?.picture ? { uri: userData.picture } : require('@/assets/images/default-avatar.png')}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              {/* <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>

        {/* Subjects Grid Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mata Pelajaran</Text>
          {loading && (
            <ActivityIndicator size="small" color="#14A35A" style={{ marginLeft: 10 }} />
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#14A35A" />
            <Text style={styles.loadingSubjectsText}>Memuat mata pelajaran...</Text>
          </View>
        ) : filteredSubjects.length > 0 ? (
          <View style={styles.gridWrapper}>
            {filteredSubjects.map((subject) => (
              <GridItem
                key={subject.id}
                image={{ uri: subject.image_url }}
                title={subject.nama_mapel}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {search ? 'Tidak ada mata pelajaran yang sesuai dengan pencarian' : 'Belum ada mata pelajaran tersedia'}
            </Text>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Belajarku Info</Text>
          <TouchableOpacity 
            style={styles.bannerCard}
            onPress={() => router.push('/')}
          >
            {/* <Image 
              source={require('@/assets/images/event1.png')}
              style={styles.bannerImage}
              resizeMode="cover"
            /> */}
            <Text style={styles.bannerText}>Event Tahunan 2024</Text>
          </TouchableOpacity>
        </View>

        {/* Refresh Button */}
        {/* <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => {
            fetchUserProfile();
            fetchSubjects();
          }}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>
            {loading ? 'Memuat ulang...' : 'Refresh Data'}
          </Text>
        </TouchableOpacity> */}
      </ScrollView>
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
  contentContainer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noUserText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#14A35A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Header Styles
  header: {
    marginTop: 20,
    marginBottom: 18,
    width: CARD_WIDTH + 60, // Lebih lebar dari card biasa
  },
  headerCard: {
    width: '100%',
    height: 160,
    backgroundColor: '#14A35A',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerLeft: {
    flex: 1,
    height: '100%',
    paddingRight: 10,
    justifyContent: 'center',
  },
  greeting: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
  },
  searchBox: {
    backgroundColor: '#ffffff22',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    color: '#fff',
    fontSize: 12,
  },
  headerRight: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // User Info Card
  userInfoCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userInfoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  userInfoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  
  // Subjects Section
  sectionHeader: {
    width: CARD_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  loadingContainer: {
    width: CARD_WIDTH,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSubjectsText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  gridWrapper: {
    width: CARD_WIDTH,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    width: CARD_WIDTH,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  
  // Info Section
  infoSection: {
    width: CARD_WIDTH,
    marginTop: 25,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  bannerCard: {
    width: '100%',
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#14A35A',
    overflow: 'hidden',
    alignItems: 'center',
    padding: 15,
  },
  bannerImage: {
    width: '100%',
    height: '70%',
    borderRadius: 10,
  },
  bannerText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  
  // Refresh Button
  refreshButton: {
    backgroundColor: '#14A35A',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

const GRID_CARD_WIDTH = Math.min(311, width - 40);

const gridStyles = StyleSheet.create({
  gridItem: {
    width: (GRID_CARD_WIDTH - 24) / 4,
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 3,
  },
  iconBox: {
    width: 73,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    color: '#7D7D7D',
    fontSize: 11,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
});