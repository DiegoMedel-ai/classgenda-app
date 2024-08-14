import React from 'react';

import { Stack } from 'expo-router';

export default function GenLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="Landing"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Stack>
  );
}