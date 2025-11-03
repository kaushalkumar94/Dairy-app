import React from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin } from 'lucide-react-native';

interface MarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title?: string;
  description?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  color?: string;
}

const Marker: React.FC<MarkerProps> = ({
  coordinate,
  title,
  description,
  onPress,
  children,
  color = '#2196F3',
}) => {
  if (Platform.OS === 'web') {
    // On web, markers are handled by the MapView component
    return null;
  }

  // For native platforms, render a simple marker representation
  return (
    <TouchableOpacity style={styles.markerContainer} onPress={onPress}>
      {children || (
        <View style={styles.defaultMarker}>
          <MapPin size={24} color={color} fill={color} />
          {title && <Text style={styles.markerTitle}>{title}</Text>}
          {description && <Text style={styles.markerDescription}>{description}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultMarker: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  markerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 6,
    textAlign: 'center',
  },
  markerDescription: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
});

export default Marker;

// This Marker component is designed to work with the MapView component.
// On web platforms, markers are handled by the MapView's Google Maps embed.
// On mobile platforms, this component renders a visual marker representation.
//
// Usage:
// <Marker
//   coordinate={{ latitude: 28.6139, longitude: 77.2090 }}
//   title="Sharma Dairy"
//   description="Fresh milk delivery"
//   color="#2196F3"
//   onPress={() => console.log('Marker pressed')}
// />