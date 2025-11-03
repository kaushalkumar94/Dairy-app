import { Stack } from 'expo-router';

export default function CustomerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="subscriptions" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="find-milkmen" />
      <Stack.Screen name="milkmen" />
    </Stack>
  );
}