import React, { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Entypo from '@expo/vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';

interface OptionsProps {
  signout: () => void;
}

export default function Options({ signout }: OptionsProps) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const iconColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

  // Navigate to the Profile page
  const goToProfile = () => {
    setIsDropdownVisible(false);
    router.push('/profile');
  };

  return (
    <TouchableWithoutFeedback onPress={() => setIsDropdownVisible(false)}>
      <View style={styles.container}>
        <SafeAreaView>
          <TouchableOpacity onPress={(e) => { e.stopPropagation(); toggleDropdown(); }}>
            <Entypo name='dots-three-horizontal' size={23} color={iconColor} />
          </TouchableOpacity>
        </SafeAreaView>

        {isDropdownVisible && (
          <SafeAreaView ref={dropdownRef}>
            <ThemedView
              style={[
                styles.dropdown,
                { borderColor: iconColor, backgroundColor },
              ]}
            >
              <TouchableOpacity onPress={goToProfile} style={styles.option}>
                <ThemedText style={styles.optionText}>Profile</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={signout} style={styles.option}>
                <ThemedText style={styles.optionText}>Sign Out</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </SafeAreaView>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  dropdown: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    position: 'absolute',
    width: 100,
    right: 0,
    marginTop: 1,
    zIndex: 2, // Ensure it appears above the overlay
  },
  option: {
    paddingVertical: 3,
    alignItems: 'flex-end', // Align text to the right
  },
  optionText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});
