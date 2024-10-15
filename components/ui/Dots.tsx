import { Animated, View, Text } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useColorScheme } from "@/hooks/useColorScheme"; // Import the useColorScheme hook
import { Colors } from "@/constants/Colors"; // Import Colors

export default function Dots({ delay }: { delay: number }) {
    const animation = useRef(new Animated.Value(0)).current;
    const colorScheme = useColorScheme() ?? "light"; // Ensure color scheme fallback

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 600,
                    delay: delay,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [animation, delay]);

    return (
        <Animated.View 
           style={{
            opacity: animation,
            transform: [
                {
                    translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -2],
                    }), 
                }
            ], 
            paddingLeft: 6,
            marginLeft: 2,
            width: 6,
            height: 6,
            borderRadius: 6,
            backgroundColor: Colors[colorScheme].text, // Use dynamic background color
           }}
        />
    );
}
