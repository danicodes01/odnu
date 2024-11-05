import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Profile() {
  const user = {
    name: 'Kitty',
    email: 'ditchkitten01@yahoo.com',
    details:
      'Hi there! I’m Kitty, a curious and clever tortoiseshell with a knack for finding the coziest spots in the house. My favorite activities include watching birds from the window, exploring hidden corners, and making sure my humans know exactly when it’s dinnertime. I’ve mastered the art of napping and can often be found curled up in a sunbeam. 🐾',
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: 'https://npr.brightspotcdn.com/legacy/sites/wual/files/202106/gypsy1__2_.jpg',
          }}
          style={styles.profileImage}
        />
        <ThemedText style={styles.profileName}>Hi! I am {user.name}</ThemedText>
        <ThemedText style={styles.profileEmail}>{user.email}</ThemedText>
      </View>
      <View style={styles.detailsSection}>
        <ThemedText style={styles.sectionTitle}>About Me</ThemedText>
        <ScrollView>
            <ThemedText style={styles.sectionText}>{user.details}</ThemedText>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 16,
  },
  detailsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
  },
});
