import React, { useState } from "react";
import { SafeAreaView, View, Alert, TouchableOpacity, StyleSheet } from "react-native";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FIREBASE_AUTH } from "@/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      router.replace("/(tabs)"); 
    } catch (error: any) {
      Alert.alert("Login failed", error.message);
    }
  };

  const backgroundColor = useThemeColor({}, "background");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={styles.contentContainer}>
      <ThemedText style={styles.title}>Welcome to the ODNU App</ThemedText>
      <ThemedText style={styles.title}>🛸</ThemedText>
        <Input
          inputProps={{
            placeholder: "Email",
            keyboardType: "email-address",
            autoCapitalize: "none",
          }}
          style={styles.input}
          value={email}
          onChange={setEmail}
        />
        <Input
          inputProps={{
            placeholder: "Password",
            secureTextEntry: true,
          }}
          style={styles.input}
          value={password}
          onChange={setPassword}
        />
        <Button label="Login" onPress={handleLogin} />
        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <ThemedText style={styles.link}>Create an account</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 24,
    marginBottom: 20,
  },
  link: {
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  input: {
    width: "90%",
  }
});
