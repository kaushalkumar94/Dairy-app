import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Package, Clock } from 'lucide-react-native';

export default function CustomerSubscriptionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const subscriptions = [
    {
      id: '1',
      product: 'Fresh Cow Milk - 1L',
      milkman: 'Sharma Dairy',
      frequency: 'Daily',
      nextDelivery: 'Tomorrow 8:00 AM',
      status: 'active',
      price: '₹30/day',
    },
    {
      id: '2',
      product: 'Fresh Curd - 500g',
      milkman: 'Krishna Dairy',
      frequency: 'Alternate Days',
      nextDelivery: 'Day after tomorrow',
      status: 'active',
      price: '₹25/delivery',
    },
    {
      id: '3',
      product: 'Buffalo Milk - 1L',
      milkman: 'Gupta Dairy',
      frequency: 'Weekly',
      nextDelivery: 'Sunday 7:00 AM',
      status: 'paused',
      price: '₹40/week',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'paused': return '#FF9800';
      case 'cancelled': return '#F44336';
      default: return '#666';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Subscriptions</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            You have {subscriptions.filter(s => s.status === 'active').length} active subscriptions
          </Text>
        </View>

        <View style={styles.subscriptionsList}>
          {subscriptions.map((subscription) => (
            <View key={subscription.id} style={styles.subscriptionCard}>
              <View style={styles.subscriptionHeader}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{subscription.product}</Text>
                  <Text style={styles.milkmanName}>{subscription.milkman}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(subscription.status) }
                ]}>
                  <Text style={styles.statusText}>
                    {subscription.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.subscriptionDetails}>
                <View style={styles.detailRow}>
                  <Calendar size={16} color="#666" />
                  <Text style={styles.detailText}>{subscription.frequency}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock size={16} color="#666" />
                  <Text style={styles.detailText}>{subscription.nextDelivery}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Package size={16} color="#666" />
                  <Text style={styles.detailText}>{subscription.price}</Text>
                </View>
              </View>

              <View style={styles.subscriptionActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>
                    {subscription.status === 'paused' ? 'Resume' : 'Pause'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Modify</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.comingSoon}>
          Full subscription management coming soon!
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  summary: {
    backgroundColor: '#FFF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  subscriptionsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  subscriptionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  milkmanName: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '600',
  },
  subscriptionDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  subscriptionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  comingSoon: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    margin: 20,
  },
});