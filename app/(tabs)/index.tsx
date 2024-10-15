import React from 'react';
import { View, StyleSheet } from 'react-native';
import NasaUpdate from '@/components/nasaUpdate/NasaUpdate';
import Header from '@/components/header/NasaHeader';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { FIREBASE_AUTH } from '@/firebase-config';

export default function HomeScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(FIREBASE_AUTH);
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Header />
      <NasaUpdate />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
