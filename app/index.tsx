import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Milk } from 'lucide-react-native';

export default function IndexScreen() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        if (user.userType === 'customer') {
          router.replace('/(customer)/home');
        } else {
          router.replace('/(milkman)/dashboard');
        }
      } else {
        router.replace('/auth');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <View style={styles.container}>
      <Milk size={60} color="#2196F3" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});