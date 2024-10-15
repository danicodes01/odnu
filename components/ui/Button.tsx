import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor"; // Custom theme color hook

export default function Button({
  onPress,
  label,
  style,
  lightColor,
  darkColor,
}: {
  onPress: () => void;
  label: string;
  style?: any;
  lightColor?: string;
  darkColor?: string;
}) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor }, style]}  // Set the background using theme color
    >
      <ThemedText style={styles.label}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,  // Space between elements
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
