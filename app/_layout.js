import React from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { ActivityProvider } from '../src/context/activityContext';
import { useAppInitialization } from '../src/hooks/useAppInitialization'; // Create this hook

export default function RootLayout() {
  const { isLoading } = useAppInitialization();
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#ffffff' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ActivityProvider>
      <Stack />
    </ActivityProvider>
  );
}