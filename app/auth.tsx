import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types';
import { Milk, Phone, ArrowRight } from 'lucide-react-native';

export default function AuthScreen() {
  const [step, setStep] = useState<'role' | 'phone' | 'otp'>('role');
  const [userType, setUserType] = useState<UserType>('customer');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { sendOTP, verifyOTP } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setIsLoading(true);
    try {
      const id = await sendOTP(phoneNumber);
      setVerificationId(id);
      setStep('otp');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(verificationId, otp, userType);
      router.replace(userType === 'customer' ? '/home' : '/dashboard');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Milk size={60} color="#2196F3" />
        <Text style={styles.title}>Welcome to MilkConnect</Text>
        <Text style={styles.subtitle}>Choose your role to continue</Text>
      </View>

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleCard,
            userType === 'customer' && styles.roleCardSelected
          ]}
          onPress={() => setUserType('customer')}
        >
          <View style={styles.roleIcon}>
            <Text style={styles.roleEmoji}>🏠</Text>
          </View>
          <Text style={styles.roleTitle}>Customer</Text>
          <Text style={styles.roleDescription}>
            Order fresh dairy products from local milkmen
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleCard,
            userType === 'milkman' && styles.roleCardSelected
          ]}
          onPress={() => setUserType('milkman')}
        >
          <View style={styles.roleIcon}>
            <Text style={styles.roleEmoji}>🥛</Text>
          </View>
          <Text style={styles.roleTitle}>Milkman</Text>
          <Text style={styles.roleDescription}>
            Manage your dairy business and serve customers
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => setStep('phone')}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
        <ArrowRight size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderPhoneInput = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Phone size={60} color="#2196F3" />
        <Text style={styles.title}>Enter Phone Number</Text>
        <Text style={styles.subtitle}>
          We&apos;ll send you a verification code
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.phoneInput}
          placeholder="+91 9876543210"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={15}
        />
      </View>

      <TouchableOpacity
        style={[styles.continueButton, isLoading && styles.buttonDisabled]}
        onPress={handleSendOTP}
        disabled={isLoading}
      >
        <Text style={styles.continueButtonText}>
          {isLoading ? 'Sending...' : 'Send OTP'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setStep('role')}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOTPInput = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {phoneNumber}
        </Text>
        {Platform.OS === 'web' && (
          <Text style={styles.demoText}>
            Demo: Use 123456 as OTP
          </Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.otpInput}
          placeholder="123456"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          maxLength={6}
          textAlign="center"
        />
      </View>

      <TouchableOpacity
        style={[styles.continueButton, isLoading && styles.buttonDisabled]}
        onPress={handleVerifyOTP}
        disabled={isLoading}
      >
        <Text style={styles.continueButtonText}>
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setStep('phone')}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {step === 'role' && renderRoleSelection()}
          {step === 'phone' && renderPhoneInput()}
          {step === 'otp' && renderOTPInput()}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  demoText: {
    fontSize: 14,
    color: '#FF9800',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  roleContainer: {
    gap: 16,
    marginBottom: 40,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  roleCardSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#F3F9FF',
  },
  roleIcon: {
    marginBottom: 12,
  },
  roleEmoji: {
    fontSize: 40,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 32,
  },
  phoneInput: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  otpInput: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  continueButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
});