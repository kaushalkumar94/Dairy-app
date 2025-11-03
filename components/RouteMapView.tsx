import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import MapView from './MapView';
import LocationService, { Coordinates } from '@/lib/location-service';
import { Navigation, Clock, Route as RouteIcon } from 'lucide-react-native';

interface RouteMapViewProps {
  from?: Coordinates;
  to?: Coordinates;
  markers?: {
    id: string;
    coordinate: Coordinates;
    title?: string;
    description?: string;
    color?: string;
  }[];
  showRoute?: boolean;
  onRouteCalculated?: (distance: number, duration: number) => void;
  style?: any;
}

const RouteMapView: React.FC<RouteMapViewProps> = ({
  from,
  to,
  markers = [],
  showRoute = true,
  onRouteCalculated,
  style,
}) => {
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinates[]>([]);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    duration: number;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoute = async () => {
      if (from && to && showRoute) {
        await calculateRoute();
      } else {
        setRouteCoordinates([]);
        setRouteInfo(null);
      }
    };
    loadRoute();
  }, [from, to, showRoute]);

  const calculateRoute = async () => {
    if (!from || !to) return;

    setIsCalculating(true);
    setError(null);
    console.log('[RouteMapView] Calculating route...');

    try {
      const result = await LocationService.calculateRoute(from, to);

      if (result.success && result.coordinates) {
        setRouteCoordinates(result.coordinates);
        setRouteInfo({
          distance: result.distance || 0,
          duration: result.duration || 0,
        });

        onRouteCalculated?.(result.distance || 0, result.duration || 0);
        
        console.log('[RouteMapView] Route calculated:', {
          distance: `${result.distance}km`,
          duration: `${result.duration}mins`,
        });
      } else {
        setError(result.error || 'Failed to calculate route');
        console.error('[RouteMapView] Route calculation failed:', result.error);
      }
    } catch (err) {
      setError('Failed to calculate route');
      console.error('[RouteMapView] Route calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const openNavigation = () => {
    if (!to) return;

    const url = Platform.select({
      ios: `maps:0,0?q=${to.latitude},${to.longitude}`,
      android: `geo:0,0?q=${to.latitude},${to.longitude}`,
      web: `https://www.google.com/maps/dir/?api=1&destination=${to.latitude},${to.longitude}`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        Linking.openURL(
          `https://www.google.com/maps/dir/?api=1&destination=${to.latitude},${to.longitude}`
        );
      });
    }
  };

  const getInitialRegion = () => {
    if (from) {
      return {
        latitude: from.latitude,
        longitude: from.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    
    if (markers.length > 0) {
      return {
        latitude: markers[0].coordinate.latitude,
        longitude: markers[0].coordinate.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }

    return {
      latitude: 28.6139,
      longitude: 77.2090,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  };

  const allMarkers = [
    ...markers,
    ...(from ? [{
      id: 'from',
      coordinate: from,
      title: 'Pickup Location',
      description: 'Start point',
      color: '#4CAF50',
    }] : []),
    ...(to ? [{
      id: 'to',
      coordinate: to,
      title: 'Delivery Location',
      description: 'End point',
      color: '#F44336',
    }] : []),
  ];

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        initialRegion={getInitialRegion()}
        markers={allMarkers}
        showsUserLocation={true}
      />

      {isCalculating && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Calculating route...</Text>
          </View>
        </View>
      )}

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {routeInfo && !isCalculating && (
        <View style={styles.routeInfoCard}>
          <View style={styles.routeInfoRow}>
            <View style={styles.routeInfoItem}>
              <RouteIcon size={20} color="#2196F3" />
              <Text style={styles.routeInfoLabel}>Distance</Text>
              <Text style={styles.routeInfoValue}>{routeInfo.distance} km</Text>
            </View>

            <View style={styles.routeInfoDivider} />

            <View style={styles.routeInfoItem}>
              <Clock size={20} color="#4CAF50" />
              <Text style={styles.routeInfoLabel}>Duration</Text>
              <Text style={styles.routeInfoValue}>{routeInfo.duration} mins</Text>
            </View>

            <View style={styles.routeInfoDivider} />

            <TouchableOpacity
              style={styles.navigationButton}
              onPress={openNavigation}
            >
              <Navigation size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {routeCoordinates.length > 0 && (
            <Text style={styles.routePointsText}>
              Route: {routeCoordinates.length} points
            </Text>
          )}
        </View>
      )}

      {from && to && !showRoute && (
        <TouchableOpacity
          style={styles.calculateButton}
          onPress={calculateRoute}
        >
          <RouteIcon size={20} color="#FFF" />
          <Text style={styles.calculateButtonText}>Calculate Route</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  errorBanner: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  errorText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  routeInfoCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  routeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routeInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  routeInfoDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  routeInfoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  routeInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  navigationButton: {
    backgroundColor: '#4CAF50',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  routePointsText: {
    fontSize: 11,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  calculateButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: 8,
  },
  calculateButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RouteMapView;
