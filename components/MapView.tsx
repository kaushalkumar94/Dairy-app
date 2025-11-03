import React, { useState } from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MapPin, Navigation, ExternalLink } from 'lucide-react-native';

interface Location {
  latitude: number;
  longitude: number;
}

interface MapMarker {
  id: string;
  coordinate: Location;
  title?: string;
  description?: string;
}

interface MapViewProps {
  style?: any;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  markers?: MapMarker[];
  onMarkerPress?: (marker: MapMarker) => void;
  showsUserLocation?: boolean;
}

const MapView: React.FC<MapViewProps> = ({
  style,
  initialRegion,
  markers = [],
  onMarkerPress,
  showsUserLocation = false,
}) => {
  const [mapError, setMapError] = useState(false);
  
  const centerLat = initialRegion?.latitude || 28.6139;
  const centerLng = initialRegion?.longitude || 77.2090;
  const zoom = 12;

  // Create markers parameter for Google Maps URL
  const markersParam = markers.map(marker => 
    `markers=color:red%7Clabel:${marker.title?.charAt(0) || 'M'}%7C${marker.coordinate.latitude},${marker.coordinate.longitude}`
  ).join('&');

  const openInGoogleMaps = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${centerLat},${centerLng}`,
      android: `geo:0,0?q=${centerLat},${centerLng}`,
      web: `https://www.google.com/maps/@${centerLat},${centerLng},${zoom}z`,
    });
    
    if (url) {
      Linking.openURL(url).catch(() => {
        // Fallback to web version
        Linking.openURL(`https://www.google.com/maps/@${centerLat},${centerLng},${zoom}z`);
      });
    }
  };

  const navigateToLocation = (lat: number, lng: number, title?: string) => {
    const destination = title ? `${title}` : `${lat},${lng}`;
    const url = Platform.select({
      ios: `maps:0,0?q=${destination}&ll=${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${destination})`,
      web: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    });
    
    if (url) {
      Linking.openURL(url).catch(() => {
        // Fallback to web version
        Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
      });
    }
  };

  if (Platform.OS === 'web') {
    const mapUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO_W3Qh9GZdgDg&center=${centerLat},${centerLng}&zoom=${zoom}&${markersParam}`;
    
    return (
      <View style={[styles.webMapContainer, style]}>
        {!mapError ? (
          <iframe
            src={mapUrl}
            style={styles.webMap}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onError={() => setMapError(true)}
          />
        ) : (
          <View style={styles.mapErrorContainer}>
            <MapPin size={48} color="#666" />
            <Text style={styles.mapErrorText}>Map temporarily unavailable</Text>
            <TouchableOpacity style={styles.openMapButton} onPress={openInGoogleMaps}>
              <ExternalLink size={16} color="#2196F3" />
              <Text style={styles.openMapText}>Open in Google Maps</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {markers.length > 0 && (
          <View style={styles.markersList}>
            <Text style={styles.markersTitle}>Locations ({markers.length}):</Text>
            {markers.map((marker) => (
              <TouchableOpacity
                key={marker.id}
                style={styles.markerItem}
                onPress={() => {
                  if (marker?.id && marker?.coordinate) {
                    onMarkerPress?.(marker);
                    navigateToLocation(marker.coordinate.latitude, marker.coordinate.longitude, marker.title);
                  }
                }}
              >
                <View style={styles.markerContent}>
                  <MapPin size={16} color="#2196F3" />
                  <View style={styles.markerInfo}>
                    <Text style={styles.markerTitle}>{marker.title || 'Location'}</Text>
                    {marker.description && (
                      <Text style={styles.markerDescription}>{marker.description}</Text>
                    )}
                  </View>
                  <Navigation size={14} color="#4CAF50" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }

  // For native platforms, show an interactive map placeholder with navigation options
  return (
    <View style={[styles.nativeMapContainer, style]}>
      <View style={styles.mapHeader}>
        <MapPin size={32} color="#2196F3" />
        <Text style={styles.mapPlaceholder}>Interactive Map</Text>
        <TouchableOpacity style={styles.openMapButton} onPress={openInGoogleMaps}>
          <ExternalLink size={16} color="#2196F3" />
          <Text style={styles.openMapText}>Open Maps</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.mapSubtext}>
        {initialRegion 
          ? `📍 ${initialRegion.latitude.toFixed(4)}, ${initialRegion.longitude.toFixed(4)}`
          : '📍 Loading location...'}
      </Text>
      
      {showsUserLocation && (
        <View style={styles.userLocationIndicator}>
          <View style={styles.userLocationDot} />
          <Text style={styles.userLocationText}>Your Location</Text>
        </View>
      )}
      
      {markers.length > 0 && (
        <View style={styles.markersList}>
          <Text style={styles.markersTitle}>Nearby Locations ({markers.length}):</Text>
          {markers.map((marker) => (
            <TouchableOpacity
              key={marker.id}
              style={styles.markerItem}
              onPress={() => {
                if (marker?.id && marker?.coordinate) {
                  onMarkerPress?.(marker);
                  navigateToLocation(marker.coordinate.latitude, marker.coordinate.longitude, marker.title);
                }
              }}
            >
              <View style={styles.markerContent}>
                <MapPin size={16} color="#2196F3" />
                <View style={styles.markerInfo}>
                  <Text style={styles.markerTitle}>{marker.title || 'Location'}</Text>
                  {marker.description && (
                    <Text style={styles.markerDescription}>{marker.description}</Text>
                  )}
                </View>
                <Navigation size={14} color="#4CAF50" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  webMapContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  webMap: {
    width: '100%',
    height: '60%',
    border: 'none',
  },
  mapErrorContainer: {
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    margin: 10,
  },
  mapErrorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 16,
  },
  nativeMapContainer: {
    flex: 1,
    backgroundColor: '#e8f4f8',
    padding: 20,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPlaceholder: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    flex: 1,
    marginLeft: 12,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  openMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  openMapText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
    marginLeft: 4,
  },
  userLocationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#E8F5E8',
    borderRadius: 20,
    marginBottom: 16,
    alignSelf: 'center',
  },
  userLocationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  userLocationText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  markersList: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 300,
  },
  markersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  markerItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  markerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  markerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  markerDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default MapView;

// How to use this MapView component:
// 
// 1. **Basic Usage:**
//    <MapView 
//      initialRegion={{
//        latitude: 28.6139,
//        longitude: 77.2090,
//        latitudeDelta: 0.05,
//        longitudeDelta: 0.05,
//      }}
//      showsUserLocation={true}
//    />
//
// 2. **With Markers:**
//    const markers = [
//      {
//        id: '1',
//        coordinate: { latitude: 28.6139, longitude: 77.2090 },
//        title: 'Sharma Dairy',
//        description: 'Fresh milk delivery • 4.8★ • 0.8km'
//      }
//    ];
//    
//    <MapView 
//      markers={markers}
//      onMarkerPress={(marker) => console.log('Selected:', marker.title)}
//      initialRegion={{ ... }}
//    />
//
// 3. **Features:**
//    - Web: Shows Google Maps embed with markers
//    - Mobile: Shows interactive list with navigation buttons
//    - Clicking markers opens navigation in device's default map app
//    - Fallback error handling for web maps
//    - User location indicator
//    - Responsive design for all screen sizes
//
// 4. **Navigation Integration:**
//    - iOS: Opens Apple Maps
//    - Android: Opens Google Maps
//    - Web: Opens Google Maps in browser
//    - Automatic fallback to web version if native apps fail