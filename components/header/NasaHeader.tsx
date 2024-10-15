import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const Header: React.FC = () => {
  return (
    <SafeAreaView>
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={styles.header}>Once A Day NASA Update 🛸</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
  },
});

export default Header;
