import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/ui/Button';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as Haptics from 'expo-haptics';

export default function AuthLanding() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>('');
  const [shouldVibrate, setShouldVibrate] = useState<boolean>(true);
  const texts = ['Welcome to ODNU', 'Your Gallactic News Source', '🛸', 'Log in', 'Or create an account', 'To start your adventure', '✨'];

  const opacity = useState(new Animated.Value(1))[0];

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const typeText = () => {
      if (currentText.length < texts[currentIndex].length) {
        timeout = setTimeout(() => {
          setCurrentText(
            texts[currentIndex].substring(0, currentText.length + 1)
          );
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }, 100);
      } else {
        timeout = setTimeout(() => {
          fadeOutText();
        }, 2000); 
      }
    };

    const fadeOutText = () => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setCurrentText('');
        opacity.setValue(1); 
        setCurrentIndex((currentIndex + 1) % texts.length);
        setIsTyping(true);
      });
    };

    if (isTyping && shouldVibrate) {
      typeText();
    }

    return () => clearTimeout(timeout);
  }, [isTyping, currentIndex, currentText, shouldVibrate, opacity]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={styles.contentContainer}>
        <Animated.View style={[styles.textContainer, { opacity }]}>
          <ThemedText style={styles.title}>{currentText}</ThemedText>
        </Animated.View>
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
  textContainer: {
    height: 30, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
  },
  link: {
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
