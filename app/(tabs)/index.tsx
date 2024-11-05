import React from 'react';
import { View, StyleSheet } from 'react-native';
import NasaUpdate from '@/components/nasaUpdate/NasaUpdate';
import Header from '@/components/header/NasaHeader';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth } from '@/firebase-config';
import Options from '@/components/options/Options';

export default function HomeScreen() {
  const router = useRouter();


  const handleSignOut = async () => {
    try {
      console.log("hello")
      await signOut(auth);
      router.replace('/auth/login');
      console.log("Sign-out successful");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Options signout={handleSignOut}/>
      <Header/>
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
