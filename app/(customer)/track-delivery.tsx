import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Linking,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MapPin,
  Navigation,
  Phone,
  MessageCircle,
  Clock,
  Package,
  Truck,
  X,
  ChevronDown,
  ChevronUp,
  Star,
} from 'lucide-react-native';
import MapView from '@/components/MapView';
import LocationService, { Coordinates } from '@/lib/location-service';

interface DeliveryTracking {
  id: string;
  milkmanName: string;
  milkmanPhone: string;
  milkmanRating: number;
  businessName: string;
  product: string;
  quantity: string;
  milkmanLocation: Coordinates;
  customerLocation: Coordinates;
  status: 'preparing' | 'out_for_delivery' | 'nearby' | 'arrived';
  estimatedArrival: string;
  distanceKm: number;
}

const mockDelivery: DeliveryTracking = {
  id: '1',
  milkmanName: 'Rajesh Sharma',
  milkmanPhone: '+91 98765 43210',
  milkmanRating: 4.8,
  businessName: 'Sharma Dairy Farm',
  product: 'Fresh Cow Milk',
  quantity: '1L',
  milkmanLocation: { latitude: 28.4595, longitude: 77.0266 },
  customerLocation: { latitude: 28.4700, longitude: 77.0350 },
  status: 'out_for_delivery',
  estimatedArrival: '8:30 AM',
  distanceKm: 1.2,
};

export default function TrackDeliveryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [delivery, setDelivery] = useState<DeliveryTracking>(mockDelivery);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [realTimeDistance, setRealTimeDistance] = useState(delivery.distanceKm);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animatePulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    const calculateInitialRoute = async () => {
      const result = await LocationService.calculateRoute(
        delivery.milkmanLocation,
        delivery.customerLocation
      );

      if (result.success && result.distance) {
        setRealTimeDistance(result.distance);
      }
    };

    animatePulse();
    calculateInitialRoute();

    const interval = setInterval(() => {
      setDelivery(prev => {
        const newLat = prev.milkmanLocation.latitude + (Math.random() - 0.5) * 0.001;
        const newLng = prev.milkmanLocation.longitude + (Math.random() - 0.5) * 0.001;
        
        const newDistance = LocationService.calculateDistance(
          { latitude: newLat, longitude: newLng },
          prev.customerLocation
        );
        
        setRealTimeDistance(newDistance);
        
        let newStatus = prev.status;
        if (newDistance < 0.1) newStatus = 'arrived';
        else if (newDistance < 0.5) newStatus = 'nearby';
        else newStatus = 'out_for_delivery';

        return {
          ...prev,
          milkmanLocation: { latitude: newLat, longitude: newLng },
          status: newStatus,
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [pulseAnim, delivery.milkmanLocation, delivery.customerLocation]);

  const toggleDetails = () => {
    setIsDetailsExpanded(!isDetailsExpanded);
    Animated.timing(slideAnim, {
      toValue: isDetailsExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const callMilkman = () => {
    Linking.openURL(`tel:${delivery.milkmanPhone}`);
  };

  const openChat = () => {
    console.log('Open chat with milkman');
  };

  const getStatusInfo = () => {
    switch (delivery.status) {
      case 'preparing':
        return {
          icon: Package,
          text: 'Preparing your order',
          color: '#FF9800',
          bgColor: '#FFF3E0',
        };
      case 'out_for_delivery':
        return {
          icon: Truck,
          text: 'On the way to you',
          color: '#2196F3',
          bgColor: '#E3F2FD',
        };
      case 'nearby':
        return {
          icon: Navigation,
          text: 'Almost there!',
          color: '#4CAF50',
          bgColor: '#E8F5E9',
        };
      case 'arrived':
        return {
          icon: MapPin,
          text: 'Arrived at your location',
          color: '#4CAF50',
          bgColor: '#E8F5E9',
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const mapMarkers = [
    {
      id: 'milkman',
      coordinate: delivery.milkmanLocation,
      title: delivery.milkmanName,
      description: `${delivery.businessName} • Delivering now`,
    },
    {
      id: 'customer',
      coordinate: delivery.customerLocation,
      title: 'Your Location',
      description: 'Delivery destination',
    },
  ];

  const midpoint: Coordinates = {
    latitude: (delivery.milkmanLocation.latitude + delivery.customerLocation.latitude) / 2,
    longitude: (delivery.milkmanLocation.longitude + delivery.customerLocation.longitude) / 2,
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Delivery</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: midpoint.latitude,
            longitude: midpoint.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          markers={mapMarkers}
          showsUserLocation={false}
        />

        <Animated.View
          style={[
            styles.milkmanMarkerOverlay,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.milkmanMarker}>
            <Truck size={24} color="#FFF" />
          </View>
        </Animated.View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.dragHandle} />

        <View style={[styles.statusCard, { backgroundColor: statusInfo.bgColor }]}>
          <StatusIcon size={24} color={statusInfo.color} />
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
        </View>

        <View style={styles.deliveryInfo}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Clock size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>ETA</Text>
                <Text style={styles.infoValue}>{delivery.estimatedArrival}</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Navigation size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Distance</Text>
                <Text style={styles.infoValue}>{realTimeDistance.toFixed(1)} km</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.milkmanCard}>
          <View style={styles.milkmanInfo}>
            <View style={styles.milkmanAvatar}>
              <Text style={styles.milkmanAvatarText}>
                {delivery.milkmanName.charAt(0)}
              </Text>
            </View>
            <View style={styles.milkmanDetails}>
              <Text style={styles.milkmanName}>{delivery.milkmanName}</Text>
              <Text style={styles.businessName}>{delivery.businessName}</Text>
              <View style={styles.ratingContainer}>
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>{delivery.milkmanRating}</Text>
              </View>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={callMilkman}
            >
              <Phone size={20} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={openChat}
            >
              <MessageCircle size={20} color="#2196F3" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.expandButton}
          onPress={toggleDetails}
        >
          <Text style={styles.expandButtonText}>Order Details</Text>
          {isDetailsExpanded ? (
            <ChevronDown size={20} color="#666" />
          ) : (
            <ChevronUp size={20} color="#666" />
          )}
        </TouchableOpacity>

        {isDetailsExpanded && (
          <View style={styles.orderDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Product</Text>
              <Text style={styles.detailValue}>{delivery.product}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Quantity</Text>
              <Text style={styles.detailValue}>{delivery.quantity}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order ID</Text>
              <Text style={styles.detailValue}>#{delivery.id}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  milkmanMarkerOverlay: {
    position: 'absolute',
    top: '30%',
    left: '45%',
    zIndex: 5,
  },
  milkmanMarker: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  bottomSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deliveryInfo: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  infoContent: {
    gap: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  infoDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#DDD',
  },
  milkmanCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 16,
  },
  milkmanInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  milkmanAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milkmanAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  milkmanDetails: {
    flex: 1,
  },
  milkmanName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  businessName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
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
  expandButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  orderDetails: {
    marginTop: 12,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
