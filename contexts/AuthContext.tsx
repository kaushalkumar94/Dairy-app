import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, UserType, CustomerProfile, MilkmanProfile } from '@/types';
import { useStorage } from '@/contexts/StorageContext';
import { router } from 'expo-router';

interface AuthState {
  user: User | null;
  profile: CustomerProfile | MilkmanProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  sendOTP: (phoneNumber: string) => Promise<string>;
  verifyOTP: (verificationId: string, otp: string, userType: UserType) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<CustomerProfile | MilkmanProfile>) => Promise<void>;
}

const validatePhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber || !phoneNumber.trim()) {
    throw new Error('Phone number cannot be empty');
  }
  const cleaned = phoneNumber.trim();
  if (cleaned.length < 10 || cleaned.length > 15) {
    throw new Error('Invalid phone number length');
  }
  return cleaned;
};

const validateOTP = (otp: string): string => {
  if (!otp || !otp.trim()) {
    throw new Error('OTP cannot be empty');
  }
  const cleaned = otp.trim();
  if (cleaned.length !== 6 || !/^\d+$/.test(cleaned)) {
    throw new Error('OTP must be 6 digits');
  }
  return cleaned;
};

export const [AuthProvider, useAuth] = createContextHook((): AuthState & AuthActions => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | MilkmanProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const storage = useStorage();

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedUser = await storage.getItem('demo_user');
        const storedProfile = await storage.getItem('demo_profile');
        
        if (storedUser && storedProfile) {
          setUser(JSON.parse(storedUser));
          setProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, [storage]);

  const sendOTP = useCallback(async (phoneNumber: string): Promise<string> => {
    try {
      const validPhone = validatePhoneNumber(phoneNumber);
      
      // For demo purposes, we'll simulate OTP sending
      // In production, you would use Firebase Phone Auth or another SMS service
      console.log('Sending OTP to:', validPhone);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return 'demo-verification-id';
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP. Please try again.');
    }
  }, []);

  const verifyOTP = useCallback(async (verificationId: string, otp: string, userType: UserType): Promise<void> => {
    try {
      const validOTP = validateOTP(otp);
      
      // For demo purposes, accept 123456 as valid OTP
      if (validOTP !== '123456') {
        throw new Error('Invalid OTP');
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a demo user
      const demoUserId = `demo-${userType}-${Date.now()}`;
      const demoPhoneNumber = '+1234567890';

      const newUser: User = {
        id: demoUserId,
        phone: demoPhoneNumber,
        userType,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Create demo profile
      const profileData = userType === 'customer' 
        ? {
            id: demoUserId,
            userId: demoUserId,
            name: '',
            addresses: [],
            createdAt: new Date(),
            updatedAt: new Date()
          } as CustomerProfile
        : {
            id: demoUserId,
            userId: demoUserId,
            businessName: '',
            ownerName: '',
            phone: demoPhoneNumber,
            serviceArea: { type: 'radius' as const, radius: 5 },
            workingHours: { startTime: '06:00', endTime: '20:00' },
            isAvailable: true,
            rating: 0,
            totalReviews: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          } as MilkmanProfile;

      // Store in local storage for demo
      await storage.setItem('demo_user', JSON.stringify(newUser));
      await storage.setItem('demo_profile', JSON.stringify(profileData));
      
      setUser(newUser);
      setProfile(profileData);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new Error('Invalid OTP. Please try again.');
    }
  }, [storage]);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      console.log('Starting sign out process...');
      await storage.clear();
      setUser(null);
      setProfile(null);
      console.log('Sign out completed, navigating to auth...');
      // Use router.push instead of replace to ensure navigation works
      router.push('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Failed to sign out. Please try again.');
    }
  }, [storage]);

  const updateProfile = useCallback(async (profileData: Partial<CustomerProfile | MilkmanProfile>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const updatedData = {
        ...profileData,
        updatedAt: new Date()
      };

      // Update local storage
      const updatedProfile = profile ? { ...profile, ...updatedData } : null;
      if (updatedProfile) {
        await storage.setItem('demo_profile', JSON.stringify(updatedProfile));
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile. Please try again.');
    }
  }, [user, profile, storage]);

  return useMemo(() => ({
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    sendOTP,
    verifyOTP,
    signOut,
    updateProfile
  }), [user, profile, isLoading, sendOTP, verifyOTP, signOut, updateProfile]);
});