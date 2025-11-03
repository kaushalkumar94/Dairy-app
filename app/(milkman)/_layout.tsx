import { Stack } from 'expo-router';

export default function MilkmanLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="inventory" />
      <Stack.Screen name="customers" />
      <Stack.Screen name="deliveries" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}