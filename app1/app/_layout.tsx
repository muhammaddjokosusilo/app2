import { Stack } from 'expo-router';
import { AuthProvider } from './(tabs)/context/authContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}