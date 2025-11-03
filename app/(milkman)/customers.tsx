import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  Filter,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Plus,
  Navigation,
} from 'lucide-react-native';

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  distance: number;
  activeSubscriptions: number;
  pendingAmount: number;
  lastDelivery: string;
  status: 'active' | 'paused' | 'pending_payment';
  customerSince: string;
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Mrs. Sharma',
    phone: '+91 98765 43210',
    address: '123 MG Road, Sector 15, Gurgaon',
    distance: 0.8,
    activeSubscriptions: 2,
    pendingAmount: 0,
    lastDelivery: '2024-01-15',
    status: 'active',
    customerSince: '2023-06-15',
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    phone: '+91 87654 32109',
    address: '456 Park Street, Block A, Noida',
    distance: 1.2,
    activeSubscriptions: 1,
    pendingAmount: 420,
    lastDelivery: '2024-01-14',
    status: 'pending_payment',
    customerSince: '2023-08-20',
  },
  {
    id: '3',
    name: 'Priya Singh',
    phone: '+91 76543 21098',
    address: '789 Green Avenue, Phase 2, Ghaziabad',
    distance: 2.1,
    activeSubscriptions: 0,
    pendingAmount: 0,
    lastDelivery: '2024-01-10',
    status: 'paused',
    customerSince: '2023-04-10',
  },
  {
    id: '4',
    name: 'Amit Patel',
    phone: '+91 65432 10987',
    address: '321 Mall Road, Sector 18, Faridabad',
    distance: 1.5,
    activeSubscriptions: 3,
    pendingAmount: 0,
    lastDelivery: '2024-01-15',
    status: 'active',
    customerSince: '2023-02-28',
  },
];

export default function CustomersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'paused' | 'pending_payment'>('all');
  const insets = useSafeAreaInsets();

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery) ||
                         customer.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || customer.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'paused': return '#FF9800';
      case 'pending_payment': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'paused': return 'Paused';
      case 'pending_payment': return 'Payment Due';
      default: return 'Unknown';
    }
  };

  const renderCustomerCard = ({ item }: { item: Customer }) => (
    <TouchableOpacity style={styles.customerCard}>
      <View style={styles.customerHeader}>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>
        <View style={styles.customerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Phone size={18} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Navigation size={18} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.customerDetails}>
        <View style={styles.detailRow}>
          <MapPin size={14} color="#666" />
          <Text style={styles.detailText}>{item.address}</Text>
        </View>
        <Text style={styles.distanceText}>{item.distance}km away</Text>
      </View>
      
      <View style={styles.customerStats}>
        <View style={styles.statItem}>
          <Calendar size={16} color="#2196F3" />
          <Text style={styles.statLabel}>Subscriptions</Text>
          <Text style={styles.statValue}>{item.activeSubscriptions}</Text>
        </View>
        <View style={styles.statItem}>
          <DollarSign size={16} color={item.pendingAmount > 0 ? '#F44336' : '#4CAF50'} />
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={[styles.statValue, { color: item.pendingAmount > 0 ? '#F44336' : '#4CAF50' }]}>
            ₹{item.pendingAmount}
          </Text>
        </View>
        <View style={styles.statItem}>
          <User size={16} color="#666" />
          <Text style={styles.statLabel}>Since</Text>
          <Text style={styles.statValue}>
            {new Date(item.customerSince).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filterOptions = [
    { key: 'all', label: 'All', count: mockCustomers.length },
    { key: 'active', label: 'Active', count: mockCustomers.filter(c => c.status === 'active').length },
    { key: 'paused', label: 'Paused', count: mockCustomers.filter(c => c.status === 'paused').length },
    { key: 'pending_payment', label: 'Payment Due', count: mockCustomers.filter(c => c.status === 'pending_payment').length },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{
          title: 'Customers',
          headerRight: () => (
            <TouchableOpacity style={styles.addButton}>
              <Plus size={24} color="#2196F3" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.filterTab,
              selectedFilter === option.key && styles.activeFilterTab
            ]}
            onPress={() => setSelectedFilter(option.key as any)}
          >
            <Text style={[
              styles.filterTabText,
              selectedFilter === option.key && styles.activeFilterTabText
            ]}>
              {option.label} ({option.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Customer List */}
      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.customerList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  addButton: {
    marginRight: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterTabs: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeFilterTab: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#FFF',
  },
  customerList: {
    padding: 16,
    paddingTop: 0,
  },
  customerCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  customerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  distanceText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 20,
  },
  customerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});