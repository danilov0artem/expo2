import { Stack } from 'expo-router';
import React from 'react';
import { DatabaseProvider } from '../contexts/DatabaseContext';

export default function Layout() {
  return (
    <DatabaseProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Карта' }} />
        <Stack.Screen name="marker/[id]" options={{ title: 'Детали маркера' }} />
      </Stack>
    </DatabaseProvider>
  );
}
