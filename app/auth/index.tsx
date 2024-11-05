import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/ui/Button';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as Haptics from 'expo-haptics';

export default function AuthLanding() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>('');
  const [shouldVibrate, setShouldVibrate] = useState<boolean>(true);
  const texts = ['Your Gallactic News Source', 'Welcome to ODNU'];

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const startTypingEffect = () => {
      if (isTyping && shouldVibrate) {
        if (currentText.length < texts[currentIndex].length) {
          timeout = setTimeout(() => {
            setCurrentText(
              texts[currentIndex].substring(0, currentText.length + 1),
            );
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }, 100);
        } else {
          timeout = setTimeout(() => {
            setIsTyping(false);
          }, 2000);
        }
      } else if (currentText.length > 0 && shouldVibrate) {
        timeout = setTimeout(() => {
          setCurrentText(currentText.substring(0, currentText.length - 1));
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, 30);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(true);
          setCurrentIndex((currentIndex + 1) % texts.length);
        }, 1000);
      }
    };

    startTypingEffect();

    // Clear the timeout on cleanup
    return () => clearTimeout(timeout);
  }, [isTyping, currentIndex, currentText, shouldVibrate]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={styles.contentContainer}>
        <ThemedText style={styles.title}>{currentText}</ThemedText>
        <Button
          label='Login'
          onPress={() => {
            setShouldVibrate(false);
            router.push('/auth/login');
          }}
        />

        <TouchableOpacity
          onPress={() => {
            setShouldVibrate(false);
            router.push('/auth/register');
          }}
        >
          <ThemedText style={styles.link}>Create an account</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 20,
  },
  link: {
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
