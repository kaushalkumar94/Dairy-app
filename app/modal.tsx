import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MilkmanProfile } from '@/types';
import { 
  Package, 
  Users, 
  Truck, 
  DollarSign,
  Bell,
  Settings,
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react-native';

export default function MilkmanDashboardScreen() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const milkmanProfile = profile as MilkmanProfile;

  const todayStats = [
    {
      id: '1',
      title: 'Deliveries',
      value: '24',
      subtitle: '3 pending',
      color: '#2196F3',
      icon: Truck,
    },
    {
      id: '2',
      title: 'Revenue',
      value: '₹1,240',
      subtitle: 'Today',
      color: '#4CAF50',
      icon: DollarSign,
    },
    {
      id: '3',
      title: 'Customers',
      value: '45',
      subtitle: '2 new',
      color: '#FF9800',
      icon: Users,
    },
    {
      id: '4',
      title: 'Stock',
      value: '85%',
      subtitle: 'Available',
      color: '#9C27B0',
      icon: Package,
    },
  ];

  const quickActions = [
    {
      id: '1',
      title: 'Start Deliveries',
      subtitle: 'Begin today\'s route',
      color: '#4CAF50',
      icon: Truck,
      onPress: () => router.push('/(milkman)/deliveries'),
    },
    {
      id: '2',
      title: 'Manage Inventory',
      subtitle: 'Update stock levels',
      color: '#2196F3',
      icon: Package,
      onPress: () => router.push('/(milkman)/inventory'),
    },
    {
      id: '3',
      title: 'View Customers',
      subtitle: 'Customer management',
      color: '#FF9800',
      icon: Users,
      onPress: () => router.push('/(milkman)/customers'),
    },
    {
      id: '4',
      title: 'Financial Reports',
      subtitle: 'Revenue & expenses',
      color: '#9C27B0',
      icon: TrendingUp,
      onPress: () => router.push('/(milkman)/reports'),
    },
  ];

  const recentActivity = [
    {
      id: '1',
      title: 'Payment Received',
      subtitle: 'Mrs. Sharma paid ₹210 for weekly subscription',
      time: '10 mins ago',
      type: 'payment',
    },
    {
      id: '2',
      title: 'New Subscription',
      subtitle: 'Rajesh Kumar subscribed to daily milk delivery',
      time: '1 hour ago',
      type: 'subscription',
    },
    {
      id: '3',
      title: 'Low Stock Alert',
      subtitle: 'Fresh Milk (1L) running low - 5 units left',
      time: '2 hours ago',
      type: 'alert',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning!</Text>
            <Text style={styles.businessName}>
              {milkmanProfile?.businessName || 'Your Dairy Business'}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusIndicator}>
            <View style={[
              styles.statusDot,
              { backgroundColor: milkmanProfile?.isAvailable ? '#4CAF50' : '#FF5722' }
            ]} />
            <Text style={styles.statusText}>
              {milkmanProfile?.isAvailable ? 'Available for Orders' : 'Currently Unavailable'}
            </Text>
          </View>
          <View style={styles.serviceArea}>
            <MapPin size={16} color="#666" />
            <Text style={styles.serviceAreaText}>
              Service Area: {milkmanProfile?.serviceArea?.radius || 5}km radius
            </Text>
          </View>
        </View>

        {/* Today's Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Overview</Text>
          <View style={styles.statsGrid}>
            {todayStats.map((stat) => (
              <View key={stat.id} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                  <stat.icon size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
                <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={action.onPress}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                  <action.icon size={24} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {recentActivity.map((item) => (
              <View key={item.id} style={styles.activityItem}>
                <View style={[
                  styles.activityIcon,
                  { backgroundColor: getActivityColor(item.type) }
                ]}>
                  {item.type === 'payment' && <DollarSign size={16} color="#FFF" />}
                  {item.type === 'subscription' && <Calendar size={16} color="#FFF" />}
                  {item.type === 'alert' && <Bell size={16} color="#FFF" />}
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
                </View>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Debug Section */}
        <View style={styles.debugSection}>
          <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'payment': return '#4CAF50';
    case 'subscription': return '#2196F3';
    case 'alert': return '#FF9800';
    default: return '#666';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusCard: {
    backgroundColor: '#FFF',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  serviceArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceAreaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  debugSection: {
    padding: 20,
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signOutText: {
    color: '#FFF',
    fontWeight: '600',
  },
});