import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationResult {
  success: boolean;
  coordinates?: Coordinates;
  address?: string;
  error?: string;
}

export interface RouteResult {
  success: boolean;
  distance?: number;
  duration?: number;
  coordinates?: Coordinates[];
  error?: string;
}

export interface GeocodingResult {
  success: boolean;
  coordinates?: Coordinates;
  displayName?: string;
  error?: string;
}

class LocationService {
  private static instance: LocationService;
  private cachedLocation: Location.LocationObject | null = null;

  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('[LocationService] Permission status:', status);
      return status === 'granted';
    } catch (error) {
      console.error('[LocationService] Permission error:', error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<LocationResult> {
    try {
      const hasPermission = await this.requestPermissions();
      
      if (!hasPermission) {
        console.log('[LocationService] Permission denied');
        return {
          success: false,
          error: 'Location permission denied. Please enable it in settings.',
        };
      }

      console.log('[LocationService] Getting current position...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      this.cachedLocation = location;
      
      console.log('[LocationService] Location obtained:', location.coords);

      const address = await this.reverseGeocode(
        location.coords.latitude,
        location.coords.longitude
      );

      return {
        success: true,
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        address: address || undefined,
      };
    } catch (error) {
      console.error('[LocationService] Error getting location:', error);
      return {
        success: false,
        error: 'Unable to get your location. Please try again.',
      };
    }
  }

  getCachedLocation(): Coordinates | null {
    if (!this.cachedLocation) return null;
    
    return {
      latitude: this.cachedLocation.coords.latitude,
      longitude: this.cachedLocation.coords.longitude,
    };
  }

  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      console.log('[LocationService] Reverse geocoding:', lat, lng);
      
      if (Platform.OS === 'web') {
        const result = await this.reverseGeocodeNominatim(lat, lng);
        return result;
      }

      const result = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });

      if (result && result.length > 0) {
        const addr = result[0];
        const parts = [
          addr.name,
          addr.street,
          addr.city,
          addr.region,
          addr.postalCode,
        ].filter(Boolean);
        
        return parts.join(', ');
      }

      return null;
    } catch (error) {
      console.error('[LocationService] Reverse geocoding error:', error);
      return null;
    }
  }

  private async reverseGeocodeNominatim(lat: number, lng: number): Promise<string | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MilkDeliveryApp/1.0',
        },
      });

      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      }

      return null;
    } catch (error) {
      console.error('[LocationService] Nominatim error:', error);
      return null;
    }
  }

  async geocodeAddress(address: string): Promise<GeocodingResult> {
    try {
      console.log('[LocationService] Geocoding address:', address);

      if (Platform.OS === 'web') {
        return await this.geocodeNominatim(address);
      }

      const result = await Location.geocodeAsync(address);

      if (result && result.length > 0) {
        console.log('[LocationService] Geocoding result:', result[0]);
        return {
          success: true,
          coordinates: {
            latitude: result[0].latitude,
            longitude: result[0].longitude,
          },
          displayName: address,
        };
      }

      return {
        success: false,
        error: 'Location not found',
      };
    } catch (error) {
      console.error('[LocationService] Geocoding error:', error);
      return {
        success: false,
        error: 'Failed to find location',
      };
    }
  }

  private async geocodeNominatim(address: string): Promise<GeocodingResult> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MilkDeliveryApp/1.0',
        },
      });

      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        return {
          success: true,
          coordinates: {
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
          },
          displayName: result.display_name,
        };
      }

      return {
        success: false,
        error: 'Location not found',
      };
    } catch (error) {
      console.error('[LocationService] Nominatim error:', error);
      return {
        success: false,
        error: 'Failed to find location',
      };
    }
  }

  calculateDistance(from: Coordinates, to: Coordinates): number {
    const R = 6371;
    const dLat = this.toRad(to.latitude - from.latitude);
    const dLon = this.toRad(to.longitude - from.longitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(from.latitude)) *
        Math.cos(this.toRad(to.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async calculateRoute(from: Coordinates, to: Coordinates): Promise<RouteResult> {
    try {
      console.log('[LocationService] Calculating route from', from, 'to', to);

      const url = `https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=geojson`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        console.error('[LocationService] Routing failed:', data);
        return {
          success: false,
          error: 'Unable to calculate route',
        };
      }

      const route = data.routes[0];
      const geometry = route.geometry.coordinates;
      
      const coordinates = geometry.map((coord: number[]) => ({
        latitude: coord[1],
        longitude: coord[0],
      }));

      const distance = Math.round(route.distance / 100) / 10;
      const duration = Math.round(route.duration / 60);

      console.log('[LocationService] Route calculated:', {
        distance: `${distance}km`,
        duration: `${duration}mins`,
        points: coordinates.length,
      });

      return {
        success: true,
        distance,
        duration,
        coordinates,
      };
    } catch (error) {
      console.error('[LocationService] Route calculation error:', error);
      
      const straightLineDistance = this.calculateDistance(from, to);
      return {
        success: false,
        distance: straightLineDistance,
        error: 'Using straight-line distance',
      };
    }
  }

  async optimizeRoute(locations: Coordinates[]): Promise<{
    success: boolean;
    optimizedOrder?: number[];
    totalDistance?: number;
    error?: string;
  }> {
    if (locations.length === 0) {
      return { success: false, error: 'No locations provided' };
    }

    if (locations.length === 1) {
      return { success: true, optimizedOrder: [0], totalDistance: 0 };
    }

    try {
      const visited = new Set<number>();
      const order: number[] = [];
      let currentIndex = 0;
      let totalDistance = 0;

      order.push(currentIndex);
      visited.add(currentIndex);

      while (visited.size < locations.length) {
        let nearestIndex = -1;
        let minDistance = Infinity;

        for (let i = 0; i < locations.length; i++) {
          if (!visited.has(i)) {
            const distance = this.calculateDistance(
              locations[currentIndex],
              locations[i]
            );

            if (distance < minDistance) {
              minDistance = distance;
              nearestIndex = i;
            }
          }
        }

        if (nearestIndex !== -1) {
          order.push(nearestIndex);
          visited.add(nearestIndex);
          totalDistance += minDistance;
          currentIndex = nearestIndex;
        }
      }

      console.log('[LocationService] Route optimized:', {
        order,
        totalDistance: `${totalDistance.toFixed(1)}km`,
      });

      return {
        success: true,
        optimizedOrder: order,
        totalDistance: Math.round(totalDistance * 10) / 10,
      };
    } catch (error) {
      console.error('[LocationService] Route optimization error:', error);
      return {
        success: false,
        error: 'Failed to optimize route',
      };
    }
  }

  getDefaultLocation(): Coordinates {
    return {
      latitude: 30.7333,
      longitude: 76.7794,
    };
  }
}

export default LocationService.getInstance();
