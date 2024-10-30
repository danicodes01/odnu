import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_AUTH } from "@/firebase-config";
import { View, ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/components/ctx/AuthContext";

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const subscriber = onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      setUser(authUser);
      setInitializing(false);
    });
    return subscriber; 
  }, []);

  useEffect(() => {
    if (initializing) return; 

    if (user) {
      // If the user is authenticated, go to home
      router.replace("/(tabs)");
    } else {
      // If the user is not authenticated, go to auth landing page
      router.replace("/auth/");
    }
  }, [user, initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size='large' />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* Define Screens for both authenticated and unauthenticated states */}
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='auth' options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
