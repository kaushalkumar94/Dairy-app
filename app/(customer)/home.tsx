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
import { CustomerProfile } from '@/types';
import { 
  MapPin, 
  Search, 
  Calendar, 
  ShoppingBag, 
  User,
  Bell,
  Star,
  Truck
} from 'lucide-react-native';

export default function CustomerHomeScreen() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const customerProfile = profile as CustomerProfile;

  const quickActions = [
    {
      id: '1',
      icon: Search,
      title: 'Find Milkmen',
      subtitle: 'Discover nearby dairy providers',
      color: '#2196F3',
      onPress: () => router.push('./find-milkmen'),
    },
    {
      id: '2',
      icon: Calendar,
      title: 'My Subscriptions',
      subtitle: 'Manage recurring orders',
      color: '#4CAF50',
      onPress: () => router.push('./subscriptions'),
    },
    {
      id: '3',
      icon: ShoppingBag,
      title: 'Order History',
      subtitle: 'View past deliveries',
      color: '#FF9800',
      onPress: () => console.log('Order history'),
    },
    {
      id: '4',
      icon: User,
      title: 'Profile',
      subtitle: 'Update your information',
      color: '#9C27B0',
      onPress: () => router.push('./profile'),
    },
  ];

  const recentActivity = [
    {
      id: '1',
      title: 'Delivery In Progress',
      subtitle: 'Rajesh is on the way • 1.2km away',
      time: 'Now',
      status: 'in_progress',
    },
    {
      id: '2',
      title: 'Payment Due',
      subtitle: 'Weekly payment of ₹210 due tomorrow',
      time: 'Tomorrow',
      status: 'pending',
    },
    {
      id: '3',
      title: 'New Milkman Available',
      subtitle: 'Krishna Dairy started serving your area',
      time: '2 days ago',
      status: 'info',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning!</Text>
            <Text style={styles.userName}>
              {customerProfile?.name || 'Welcome'}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location Card */}
        <View style={styles.locationCard}>
          <MapPin size={20} color="#2196F3" />
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Delivery Location</Text>
            <Text style={styles.locationAddress}>
              {customerProfile?.addresses?.[0]?.fullAddress || 'Add your address'}
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.changeButton}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Active Subscriptions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>₹420</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
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
              <TouchableOpacity 
                key={item.id} 
                style={styles.activityItem}
                onPress={() => {
                  if (item.status === 'in_progress') {
                    router.push('./track-delivery');
                  }
                }}
              >
                <View style={[
                  styles.activityIcon,
                  { backgroundColor: getStatusColor(item.status) }
                ]}>
                  {item.status === 'in_progress' && <Truck size={16} color="#FFF" />}
                  {item.status === 'delivered' && <Truck size={16} color="#FFF" />}
                  {item.status === 'pending' && <Bell size={16} color="#FFF" />}
                  {item.status === 'info' && <Star size={16} color="#FFF" />}
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
                </View>
                <Text style={styles.activityTime}>{item.time}</Text>
              </TouchableOpacity>
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'in_progress': return '#2196F3';
    case 'delivered': return '#4CAF50';
    case 'pending': return '#FF9800';
    case 'info': return '#2196F3';
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
  userName: {
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
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 14,
    color: '#666',
  },
  locationAddress: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  changeButton: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
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
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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