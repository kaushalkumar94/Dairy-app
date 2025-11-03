import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView from '@/components/MapView';
import * as Location from 'expo-location';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  Phone,
  Navigation,
  Package,
  DollarSign,
} from 'lucide-react-native';
import DairyService from '@/lib/dairy-service';
import { Dairy, CHANDIGARH_CENTER } from '@/constants/chandigarh-dairies';



export default function FindMilkmenScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'available' | 'nearby'>('all');
  const [dairies, setDairies] = useState<Dairy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const loadDairies = async () => {
    try {
      setIsLoading(true);
      console.log('[FindMilkmen] Loading dairies...');
      
      const location = await getCurrentLocation();
      
      const userCoords = location ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      } : undefined;

      const fetchedDairies = await DairyService.getAllDairies(userCoords);
      console.log('[FindMilkmen] Loaded dairies:', fetchedDairies.length);
      setDairies(fetchedDairies);
    } catch (error) {
      console.error('[FindMilkmen] Error loading dairies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDairies();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('[FindMilkmen] Location permission denied');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      return location;
    } catch (error) {
      console.error('[FindMilkmen] Error getting location:', error);
      return null;
    }
  };

  const filteredDairies = dairies.filter(dairy => {
    const matchesSearch = dairy.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dairy.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dairy.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter === 'available') {
      matchesFilter = dairy.isAvailable;
    } else if (selectedFilter === 'nearby') {
      matchesFilter = (dairy.distance || 0) <= 5.0;
    }
    
    return matchesSearch && matchesFilter;
  });

  const renderDairyCard = ({ item }: { item: Dairy }) => (
    <TouchableOpacity style={styles.milkmanCard}>
      <View style={styles.cardHeader}>
        <View style={styles.milkmanInfo}>
          <Text style={styles.businessName}>{item.businessName}</Text>
          <Text style={styles.ownerName}>by {item.ownerName}</Text>
        </View>
        <View style={styles.availabilityBadge}>
          <View style={[
            styles.statusDot,
            { backgroundColor: item.isAvailable ? '#4CAF50' : '#F44336' }
          ]} />
          <Text style={[
            styles.statusText,
            { color: item.isAvailable ? '#4CAF50' : '#F44336' }
          ]}>
            {item.isAvailable ? 'Available' : 'Closed'}
          </Text>
        </View>
      </View>
      
      <View style={styles.ratingSection}>
        <View style={styles.rating}>
          <Star size={16} color="#FFD700" fill="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewsText}>({item.totalReviews} reviews)</Text>
        </View>
        <View style={styles.distance}>
          <MapPin size={14} color="#666" />
          <Text style={styles.distanceText}>{item.distance}km away</Text>
        </View>
      </View>
      
      <View style={styles.addressSection}>
        <MapPin size={14} color="#666" />
        <Text style={styles.address}>{item.address}</Text>
      </View>
      
      <View style={styles.workingHours}>
        <Clock size={14} color="#666" />
        <Text style={styles.hoursText}>
          Open: {item.workingHours.startTime} - {item.workingHours.endTime}
        </Text>
      </View>
      
      <View style={styles.productsSection}>
        <Text style={styles.productsTitle}>Products:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsList}>
          {item.products.map((product, index) => (
            <View key={`${item.id}-${product.name}-${index}`} style={styles.productChip}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>₹{product.price}/{product.unit}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.priceRange}>
          <DollarSign size={16} color="#4CAF50" />
          <Text style={styles.priceRangeText}>
            ₹{item.priceRange.min} - ₹{item.priceRange.max}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Phone size={18} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Navigation size={18} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.subscribeButton]}
            onPress={() => router.push(`./track-delivery?dairyId=${item.id}`)}
          >
            <Package size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMapView = () => {
    const initialRegion = userLocation ? {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    } : {
      latitude: CHANDIGARH_CENTER.latitude,
      longitude: CHANDIGARH_CENTER.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };

    const mapMarkers = filteredDairies.map((dairy) => ({
      id: dairy.id,
      coordinate: dairy.coordinates,
      title: dairy.businessName,
      description: `${dairy.ownerName} • ${dairy.rating}★ • ${dairy.distance?.toFixed(1) || '—'}km`,
    }));

    return (
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        markers={mapMarkers}
        onMarkerPress={(marker) => {
          console.log('[FindMilkmen] Dairy selected:', marker.title);
        }}
        showsUserLocation={true}
      />
    );
  };

  const filterOptions = [
    { key: 'all', label: 'All', count: dairies.length },
    { key: 'available', label: 'Available', count: dairies.filter(d => d.isAvailable).length },
    { key: 'nearby', label: 'Nearby (5km)', count: dairies.filter(d => (d.distance || 0) <= 5.0).length },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{
          title: 'Find Milkmen',
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
      
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search milkmen, products..."
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
      
      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading Chandigarh dairies...</Text>
        </View>
      ) : viewMode === 'list' ? (
        <FlatList
          data={filteredDairies}
          renderItem={renderDairyCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.milkmenList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No dairies found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          }
        />
      ) : (
        renderMapView()
      )}
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
  milkmenList: {
    padding: 16,
    paddingTop: 0,
  },
  milkmanCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  milkmanInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 14,
    color: '#666',
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
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
  ratingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
    lineHeight: 20,
  },
  workingHours: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hoursText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  productsSection: {
    marginBottom: 16,
  },
  productsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  productsList: {
    flexDirection: 'row',
  },
  productChip: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  productName: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  priceRange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceRangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 4,
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
  subscribeButton: {
    backgroundColor: '#2196F3',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
});