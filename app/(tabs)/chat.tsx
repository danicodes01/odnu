import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  Text,
  Platform,
  StyleSheet,
  Linking,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getEventSource } from "../utils/event-source";
import * as Haptics from "expo-haptics";
import Dots from "@/components/ui/Dots";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import * as ExpoLinking from 'expo-linking'; 

interface Message {
  author: "user" | "ai";
  message: string;
}

export default function ChatScreen() {
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [history, setHistory] = useState<Message[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";

  const scrollDown = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollDown();
  }, [history]);

  const updateHistoryWithTyping = (newMessageContent: string) => {
    setHistory((currentHistory) => {
      const historyLength = currentHistory.length;
      if (
        historyLength > 0 &&
        currentHistory[historyLength - 1].author === "ai"
      ) {
        let newHistory = [...currentHistory];
        newHistory[historyLength - 1].message += newMessageContent;
        return newHistory;
      } else {
        return [
          ...currentHistory,
          { author: "ai", message: newMessageContent },
        ];
      }
    });
  };

  const sendMessage = () => {
    setHistory([...history, { author: "user", message: currentMessage }]);
    setCurrentMessage("");
    setIsThinking(true);

    const prompt = { prompt: currentMessage };
    const es = getEventSource(prompt);

    es.addEventListener("open", () => {
      setIsThinking(true);
    });

    es.addEventListener("message", async (e: any) => {
      console.log("Received message:", e.data);
      try {
        const response = await JSON.parse(e.data);
        setIsThinking(false);
        switch (response.event) {
          case "TYPING":
            setIsTyping(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            updateHistoryWithTyping(response.message);
            break;
          case "DONE":
            setIsTyping(false);
            es.close();
            break;
          default:
            updateHistoryWithTyping(response.message);
            break;
        }
      } catch (error) {
        setIsThinking(false);
        console.error(e);
      }
    });

    es.addEventListener("error", () => {
      setIsThinking(false);
      es.close();
    });
  };

  const avatar = (role: "user" | "ai") => {
    return (
      <View style={styles.avatarContainer}>
        <View
          style={[
            styles.avatarIcon,
            {
              backgroundColor: Colors[colorScheme].text,
            },
          ]}
        >
          <Text
            style={[
              styles.avatarText,
              { color: Colors[colorScheme].background },
            ]}
          >
            {role === "ai" ? "👾" : "😻"}
          </Text>
        </View>
        <View>
          <Text
            style={[styles.avatarName, { color: Colors[colorScheme].text }]}
          >
            {role === "ai" ? "" : "You"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} ref={scrollRef}>
          {history.map((msg, i) => (
            <View key={i} style={styles.messageContainer}>
              <View>
                {avatar(msg.author)}
                <ThemedText style={styles.messageText} selectable={true}>
                  {msg.message}
                </ThemedText>
              </View>
            </View>
          ))}
          {isThinking && (
            <View>
              {avatar("ai")}
              <View style={styles.thinkingContainer}>
                <Dots delay={0} />
                <Dots delay={200} />
                <Dots delay={400} />
              </View>
            </View>
          )}
        </ScrollView>
        <View style={styles.inputContainer}>
          <View style={styles.textInputWrapper}>
            <TextInput
              onChangeText={(e) => setCurrentMessage(e)}
              style={[
                styles.textInput,
                {
                  color: Colors[colorScheme].text,
                  backgroundColor: Colors[colorScheme].background,
                },
              ]}
              placeholder='Ask something...'
              placeholderTextColor={Colors[colorScheme].icon}
              value={currentMessage}
            />
          </View>
          <TouchableOpacity
            onPress={sendMessage}
            disabled={isThinking || isTyping}
          >
            <AntDesign
              name='caretright'
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    height: "100%",
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    marginTop: 8,
    marginBottom: 16,
    height: "90%",
  },
  messageContainer: {
    marginVertical: 8,
  },
  messageText: {
    fontSize: 18,
    marginVertical: 4,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  avatarIcon: {
    padding: 5,
    borderRadius: 999,
    width: 36,
    height: 36,
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  avatarName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInputWrapper: {
    width: "90%",
  },
  textInput: {
    borderRadius: 8,
    padding: 16,
  },
  thinkingContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
});
