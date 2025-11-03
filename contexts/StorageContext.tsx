import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StorageActions {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

const validateKey = (key: string): string => {
  if (!key || !key.trim()) {
    throw new Error('Storage key cannot be empty');
  }
  if (key.length > 100) {
    throw new Error('Storage key too long');
  }
  return key.trim();
};

const validateValue = (value: string): string => {
  if (value.length > 10000) {
    throw new Error('Storage value too long');
  }
  return value;
};

export const [StorageProvider, useStorage] = createContextHook((): StorageActions => {
  const getItem = useCallback(async (key: string): Promise<string | null> => {
    try {
      const validKey = validateKey(key);
      return await AsyncStorage.getItem(validKey);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }, []);

  const setItem = useCallback(async (key: string, value: string): Promise<void> => {
    try {
      const validKey = validateKey(key);
      const validValue = validateValue(value);
      await AsyncStorage.setItem(validKey, validValue);
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  }, []);

  const removeItem = useCallback(async (key: string): Promise<void> => {
    try {
      const validKey = validateKey(key);
      await AsyncStorage.removeItem(validKey);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  }, []);

  const clear = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }, []);

  return useMemo(() => ({
    getItem,
    setItem,
    removeItem,
    clear
  }), [getItem, setItem, removeItem, clear]);
});