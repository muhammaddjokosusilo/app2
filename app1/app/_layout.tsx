import { Stack } from "expo-router";
import { AuthProvider } from "./context/authContext";  // Baru: Import AuthProvider

export default function RootLayout() {
  return (
    <AuthProvider> 
      <Stack 
        screenOptions={{
          headerShown: false, // ⬅️ MATIKAN NAVBAR TOP
        }}
      />
    </AuthProvider>
  );
}
