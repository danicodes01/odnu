import React from "react";
import { View, TextInput, TextInputProps, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";  // Custom theme color hook

export default function Input({
  inputProps,
  onChange,
  value,
  style,
  lightColor,
  darkColor,
}: {
  inputProps: TextInputProps;
  onChange: (e: string) => void;
  value: any;
  style?: any;
  lightColor?: string;
  darkColor?: string;
}) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <ThemedView style={[styles.inputContainer, style]}>
      <TextInput
        onChangeText={onChange}
        value={value}
        style={[styles.input, { backgroundColor, color: textColor }]}  // Set background and text color using theme
        {...inputProps}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,  // Add space between inputs
  },
  input: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
