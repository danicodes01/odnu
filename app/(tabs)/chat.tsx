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
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getEventSource, RNEventSource } from "../utils/event-source";
import * as Haptics from "expo-haptics";
import Dots from "@/components/ui/Dots";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/components/ctx/AuthContext";

interface Message {
  author: "user" | "ai";
  message: string;
}


export default function ChatScreen() {
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const eventSourceRef = useRef<RNEventSource | null>(null);
  const colorScheme = useColorScheme() ?? "light";
  const { user } = useAuth();

  const threadId = user?.uid;

  const scrollDown = () => scrollRef.current?.scrollToEnd({ animated: true });

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

  const initiateEventSource = (prompt: { prompt: string }) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = getEventSource(prompt, threadId || "");
    eventSourceRef.current = es;

    es.addEventListener("open", () => {
      setIsThinking(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    });

    es.addEventListener("message", (e: { data: string | null }) => {
      if (e.data) {
        const cleanedData = e.data.replace(/^data:\s*/, "").trim();
    
        if (cleanedData === "[DONE]") {
          setIsThinking(false);
          setIsTyping(false);
          es.close();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          return;
        }
    
        try {
          const response = JSON.parse(cleanedData);
          const content = response.message;
    
          if (typeof content === "string") {
            updateHistoryWithTyping(content);
            setIsTyping(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } else {
            console.error("Unexpected message format:", response);
          }
        } catch (error) {
          console.error("Error parsing JSON data:", cleanedData);
          setIsThinking(false);
        }
      }
    });
    

    es.addEventListener("error", (error: any) => {
      console.error("EventSource error:", error);
      setIsThinking(false);
      es.close();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    });
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    setHistory([...history, { author: "user", message: currentMessage }]);
    setCurrentMessage("");
    setIsThinking(true);

    const prompt = { prompt: currentMessage };

    initiateEventSource(prompt);
  };

  const avatar = (role: "user" | "ai") => (
    <View style={styles.avatarContainer}>
      <View
        style={[
          styles.avatarIcon,
          { backgroundColor: Colors[colorScheme].text },
        ]}
      >
        <Text
          style={[styles.avatarText, { color: Colors[colorScheme].background }]}
        >
          {role === "ai" ? "👾" : "😻"}
        </Text>
      </View>
      <View>
        <Text style={[styles.avatarName, { color: Colors[colorScheme].text }]}>
          {role === "ai" ? "" : "You"}
        </Text>
      </View>
    </View>
  );

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
