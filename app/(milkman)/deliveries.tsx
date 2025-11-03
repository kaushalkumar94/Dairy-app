import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView from '@/components/MapView';
import Marker from '@/components/Marker';
import {
  MapPin,
  Phone,
  Navigation,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Route,
} from 'lucide-react-native';

interface Delivery {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  products: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  deliveryTime: string;
  status: 'pending' | 'completed' | 'not_home' | 'skipped';
  paymentStatus: 'paid' | 'pending';
  amount: number;
  notes?: string;
}

const mockDeliveries: Delivery[] = [
  {
    id: '1',
    customerName: 'Mrs. Sharma',
    customerPhone: '+91 98765 43210',
    address: '123 MG Road, Sector 15, Gurgaon',
    coordinates: { latitude: 28.4595, longitude: 77.0266 },
    products: [
      { name: 'Fresh Cow Milk', quantity: 1, unit: '1L' },
      { name: 'Fresh Curd', quantity: 1, unit: '500g' },
    ],
    deliveryTime: '07:00 AM',
    status: 'completed',
    paymentStatus: 'paid',
    amount: 95,
    notes: 'Leave at door if not home',
  },
  {
    id: '2',
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 87654 32109',
    address: '456 Park Street, Block A, Noida',
    coordinates: { latitude: 28.5355, longitude: 77.3910 },
    products: [
      { name: 'Buffalo Milk', quantity: 2, unit: '1L' },
    ],
    deliveryTime: '07:30 AM',
    status: 'pending',
    paymentStatus: 'pending',
    amount: 140,
  },
  {
    id: '3',
    customerName: 'Priya Singh',
    customerPhone: '+91 76543 21098',
    address: '789 Green Avenue, Phase 2, Ghaziabad',
    coordinates: { latitude: 28.6692, longitude: 77.4538 },
    products: [
      { name: 'Fresh Cow Milk', quantity: 1, unit: '1L' },
      { name: 'Buttermilk', quantity: 1, unit: '500ml' },
    ],
    deliveryTime: '08:00 AM',
    status: 'not_home',
    paymentStatus: 'paid',
    amount: 85,
    notes: 'Customer was not home',
  },
  {
    id: '4',
    customerName: 'Amit Patel',
    customerPhone: '+91 65432 10987',
    address: '321 Mall Road, Sector 18, Faridabad',
    coordinates: { latitude: 28.4089, longitude: 77.3178 },
    products: [
      { name: 'Fresh Cow Milk', quantity: 2, unit: '1L' },
      { name: 'Fresh Curd', quantity: 2, unit: '500g' },
      { name: 'Paneer', quantity: 1, unit: '250g' },
    ],
    deliveryTime: '08:30 AM',
    status: 'pending',
    paymentStatus: 'paid',
    amount: 310,
  },
];

export default function DeliveriesScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed' | 'not_home'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [deliveries, setDeliveries] = useState(mockDeliveries);
  const insets = useSafeAreaInsets();

  const filteredDeliveries = deliveries.filter(delivery => {
    if (selectedFilter === 'all') return true;
    return delivery.status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'not_home': return '#F44336';
      case 'skipped': return '#9E9E9E';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'pending': return Clock;
      case 'not_home': return XCircle;
      case 'skipped': return XCircle;
      default: return Clock;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Delivered';
      case 'pending': return 'Pending';
      case 'not_home': return 'Not Home';
      case 'skipped': return 'Skipped';
      default: return 'Unknown';
    }
  };

  const updateDeliveryStatus = (deliveryId: string, newStatus: Delivery['status']) => {
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === deliveryId 
        ? { ...delivery, status: newStatus }
        : delivery
    ));
  };

  const renderDeliveryCard = ({ item }: { item: Delivery }) => {
    const StatusIcon = getStatusIcon(item.status);
    
    return (
      <View style={styles.deliveryCard}>
        <View style={styles.deliveryHeader}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{item.customerName}</Text>
            <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
              <StatusIcon size={14} color={getStatusColor(item.status)} />
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.addressSection}>
          <MapPin size={16} color="#666" />
          <Text style={styles.address}>{item.address}</Text>
        </View>
        
        <View style={styles.productsSection}>
          <Text style={styles.productsTitle}>Products:</Text>
          {item.products.map((product, index) => (
            <Text key={index} style={styles.productItem}>
              • {product.name} - {product.quantity} {product.unit}
            </Text>
          ))}
        </View>
        
        <View style={styles.deliveryFooter}>
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount:</Text>
            <Text style={styles.amount}>₹{item.amount}</Text>
            <View style={[
              styles.paymentBadge,
              { backgroundColor: item.paymentStatus === 'paid' ? '#E8F5E8' : '#FFF3E0' }
            ]}>
              <Text style={[
                styles.paymentText,
                { color: item.paymentStatus === 'paid' ? '#4CAF50' : '#FF9800' }
              ]}>
                {item.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Phone size={18} color="#2196F3" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Navigation size={18} color="#4CAF50" />
            </TouchableOpacity>
            
            {item.status === 'pending' && (
              <>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.completeButton]}
                  onPress={() => updateDeliveryStatus(item.id, 'completed')}
                >
                  <CheckCircle size={18} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.notHomeButton]}
                  onPress={() => updateDeliveryStatus(item.id, 'not_home')}
                >
                  <XCircle size={18} color="#FFF" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        
        {item.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesText}>Note: {item.notes}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderMapView = () => {
    const mapMarkers = filteredDeliveries.map((delivery) => ({
      id: delivery.id,
      coordinate: delivery.coordinates,
      title: delivery.customerName,
      description: delivery.address,
    }));

    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 28.4595,
          longitude: 77.0266,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        markers={mapMarkers}
        onMarkerPress={(marker) => {
          console.log('Marker pressed:', marker.title);
        }}
        showsUserLocation={true}
      />
    );
  };

  const filterOptions = [
    { key: 'all', label: 'All', count: deliveries.length },
    { key: 'pending', label: 'Pending', count: deliveries.filter(d => d.status === 'pending').length },
    { key: 'completed', label: 'Completed', count: deliveries.filter(d => d.status === 'completed').length },
    { key: 'not_home', label: 'Not Home', count: deliveries.filter(d => d.status === 'not_home').length },
  ];

  const totalDeliveries = deliveries.length;
  const completedDeliveries = deliveries.filter(d => d.status === 'completed').length;
  const pendingDeliveries = deliveries.filter(d => d.status === 'pending').length;
  const totalRevenue = deliveries
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{
          title: 'Today\'s Deliveries',
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={[styles.viewToggle, viewMode === 'list' && styles.activeViewToggle]}
                onPress={() => setViewMode('list')}
              >
                <Text style={[styles.viewToggleText, viewMode === 'list' && styles.activeViewToggleText]}>List</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.viewToggle, viewMode === 'map' && styles.activeViewToggle]}
                onPress={() => setViewMode('map')}
              >
                <Text style={[styles.viewToggleText, viewMode === 'map' && styles.activeViewToggleText]}>Map</Text>
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalDeliveries}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{completedDeliveries}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#FF9800' }]}>{pendingDeliveries}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#4CAF50' }]}>₹{totalRevenue}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
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
      
      {/* Content */}
      {viewMode === 'list' ? (
        <FlatList
          data={filteredDeliveries}
          renderItem={renderDeliveryCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.deliveryList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderMapView()
      )}
      
      {/* Route Optimization Button */}
      <TouchableOpacity style={styles.routeButton}>
        <Route size={20} color="#FFF" />
        <Text style={styles.routeButtonText}>Optimize Route</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerActions: {
    flexDirection: 'row',
    marginRight: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 2,
  },
  viewToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeViewToggle: {
    backgroundColor: '#2196F3',
  },
  viewToggleText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeViewToggleText: {
    color: '#FFF',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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
  deliveryList: {
    padding: 16,
    paddingTop: 0,
  },
  deliveryCard: {
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
  deliveryHeader: {
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
    marginBottom: 4,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  productsSection: {
    marginBottom: 12,
  },
  productsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productItem: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    lineHeight: 18,
  },
  deliveryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  paymentText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
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
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  notHomeButton: {
    backgroundColor: '#F44336',
  },
  notesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  notesText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  map: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  routeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: 8,
  },
  routeButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});