import React from "react";
import { Text, TextProps, Platform, StyleSheet, Linking } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

const urlRegex = /(https?:\/\/[^\s]+)/g;

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  autoLink?: "phoneNumbers" | "email" | "all" | "none";
  selectable?: boolean;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  selectable = false,
  children,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  // Function to render text with clickable links
  const renderTextWithLinks = (text: string) => {
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <Text
            key={index}
            style={[style, styles.link]} // Style for links
            onPress={() => Linking.openURL(part)} // Handle link click
          >
            {part}
          </Text>
        );
      }

      return (
        <Text key={index} style={style}>
          {part}
        </Text>
      );
    });
  };

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      selectable={selectable}
      {...rest}
    >
      {typeof children === "string" ? renderTextWithLinks(children) : children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    color: "#0a7ea4", // Make the link stand out
    textDecorationLine: "underline", // Underline the link
  },
});
