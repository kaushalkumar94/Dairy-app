# 📍 Location & Routing Services Guide

Comprehensive guide for using location services, geocoding, and routing in your Milk Delivery App.

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Location Service](#location-service)
3. [Routing & Navigation](#routing--navigation)
4. [Components](#components)
5. [Examples](#examples)

---

## 🚀 Quick Start

### Import Location Service

```typescript
import LocationService from '@/lib/location-service';
```

### Get Current Location

```typescript
const result = await LocationService.getCurrentLocation();
if (result.success) {
  console.log('📍 Location:', result.coordinates);
  console.log('📮 Address:', result.address);
}
```

---

## 🎯 Location Service Features

### 1. Get Current User Location

```typescript
const locationResult = await LocationService.getCurrentLocation();

if (locationResult.success) {
  const { latitude, longitude } = locationResult.coordinates!;
  const address = locationResult.address;
  
  console.log(`You are at: ${address}`);
} else {
  console.error(locationResult.error);
}
```

### 2. Geocoding (Address → Coordinates)

Convert an address string to GPS coordinates:

```typescript
const result = await LocationService.geocodeAddress('123 MG Road, Gurgaon');

if (result.success) {
  console.log('Coordinates:', result.coordinates);
  console.log('Full address:', result.displayName);
}
```

**Use Cases:**
- Customer enters delivery address
- Finding milkman by address
- Validating location during registration

### 3. Reverse Geocoding (Coordinates → Address)

Convert GPS coordinates to a readable address:

```typescript
const address = await LocationService.reverseGeocode(28.4595, 77.0266);
console.log('Address:', address);
```

### 4. Calculate Distance Between Two Points

Uses Haversine formula for accurate distance calculation:

```typescript
const distance = LocationService.calculateDistance(
  { latitude: 28.4595, longitude: 77.0266 },
  { latitude: 28.5355, longitude: 77.3910 }
);

console.log(`Distance: ${distance} km`);
```

**Use Cases:**
- Show "2.3 km away" in milkman listing
- Filter nearby milkmen within radius
- Sort deliveries by distance

### 5. Calculate Route with Turn-by-Turn Directions

Get actual driving route using OSRM (Open Source Routing Machine):

```typescript
const route = await LocationService.calculateRoute(
  { latitude: 28.4595, longitude: 77.0266 }, // From
  { latitude: 28.5355, longitude: 77.3910 }  // To
);

if (route.success) {
  console.log('Distance:', route.distance, 'km');
  console.log('Duration:', route.duration, 'minutes');
  console.log('Route points:', route.coordinates?.length);
}
```

**Use Cases:**
- Calculate delivery ETA
- Show route on map
- Optimize delivery sequence

### 6. Route Optimization (Traveling Salesman Problem)

Optimize delivery sequence to minimize total distance:

```typescript
const locations = [
  { latitude: 28.4595, longitude: 77.0266 },
  { latitude: 28.5355, longitude: 77.3910 },
  { latitude: 28.6692, longitude: 77.4538 },
  { latitude: 28.4089, longitude: 77.3178 },
];

const optimized = await LocationService.optimizeRoute(locations);

if (optimized.success) {
  console.log('Best order:', optimized.optimizedOrder);
  console.log('Total distance:', optimized.totalDistance, 'km');
  
  // Example output: [0, 3, 1, 2] means visit locations in that order
}
```

**Use Cases:**
- Milkman's daily delivery route planning
- Minimize fuel costs
- Reduce delivery time

---

## 🗺️ Routing & Navigation

### Open Navigation in Device's Map App

```typescript
import { Linking, Platform } from 'react-native';

const navigateToLocation = (lat: number, lng: number) => {
  const url = Platform.select({
    ios: `maps:0,0?q=${lat},${lng}`,
    android: `geo:0,0?q=${lat},${lng}`,
    web: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
  });
  
  if (url) {
    Linking.openURL(url);
  }
};
```

---

## 🧩 Components

### 1. Basic MapView Component

Shows a map with markers:

```tsx
import MapView from '@/components/MapView';

<MapView
  initialRegion={{
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }}
  markers={[
    {
      id: '1',
      coordinate: { latitude: 28.4595, longitude: 77.0266 },
      title: 'Sharma Dairy',
      description: '4.8★ • 0.8km away',
    }
  ]}
  showsUserLocation={true}
  onMarkerPress={(marker) => console.log('Selected:', marker.title)}
/>
```

### 2. RouteMapView Component

Shows a map with routing capabilities:

```tsx
import RouteMapView from '@/components/RouteMapView';

<RouteMapView
  from={{ latitude: 28.4595, longitude: 77.0266 }}
  to={{ latitude: 28.5355, longitude: 77.3910 }}
  showRoute={true}
  onRouteCalculated={(distance, duration) => {
    console.log(`Route: ${distance}km, ${duration}mins`);
  }}
  markers={[
    {
      id: '1',
      coordinate: { latitude: 28.4800, longitude: 77.1000 },
      title: 'Customer 1',
    }
  ]}
/>
```

---

## 📖 Complete Examples

### Example 1: Find Nearby Milkmen

```tsx
import React, { useState, useEffect } from 'react';
import LocationService from '@/lib/location-service';

interface Milkman {
  id: string;
  name: string;
  coordinates: { latitude: number; longitude: number };
}

const FindNearbyMilkmen = () => {
  const [nearby, setNearby] = useState<Milkman[]>([]);

  useEffect(() => {
    findNearby();
  }, []);

  const findNearby = async () => {
    // Get user location
    const location = await LocationService.getCurrentLocation();
    if (!location.success) return;

    const userCoords = location.coordinates!;

    // All milkmen from database
    const allMilkmen: Milkman[] = [
      { id: '1', name: 'Sharma Dairy', coordinates: { latitude: 28.4595, longitude: 77.0266 } },
      { id: '2', name: 'Krishna Dairy', coordinates: { latitude: 28.5355, longitude: 77.3910 } },
    ];

    // Calculate distances
    const withDistance = allMilkmen.map(milkman => ({
      ...milkman,
      distance: LocationService.calculateDistance(userCoords, milkman.coordinates),
    }));

    // Filter within 5km radius
    const nearbyMilkmen = withDistance.filter(m => m.distance <= 5.0);

    // Sort by distance
    nearbyMilkmen.sort((a, b) => a.distance - b.distance);

    setNearby(nearbyMilkmen);
  };

  return (
    <View>
      {nearby.map(milkman => (
        <Text key={milkman.id}>
          {milkman.name} - {milkman.distance}km away
        </Text>
      ))}
    </View>
  );
};
```

### Example 2: Calculate Delivery Route & ETA

```tsx
import React, { useState } from 'react';
import LocationService from '@/lib/location-service';

const DeliveryRoute = () => {
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    duration: number;
    eta: Date;
  } | null>(null);

  const calculateDelivery = async () => {
    const milkmanLocation = { latitude: 28.4595, longitude: 77.0266 };
    const customerLocation = { latitude: 28.5355, longitude: 77.3910 };

    const route = await LocationService.calculateRoute(
      milkmanLocation,
      customerLocation
    );

    if (route.success) {
      const eta = new Date(Date.now() + route.duration! * 60 * 1000);
      
      setRouteInfo({
        distance: route.distance!,
        duration: route.duration!,
        eta,
      });
    }
  };

  return (
    <View>
      <Button title="Calculate Route" onPress={calculateDelivery} />
      
      {routeInfo && (
        <View>
          <Text>Distance: {routeInfo.distance} km</Text>
          <Text>Duration: {routeInfo.duration} minutes</Text>
          <Text>ETA: {routeInfo.eta.toLocaleTimeString()}</Text>
        </View>
      )}
    </View>
  );
};
```

### Example 3: Optimize Delivery Sequence

```tsx
import React, { useState } from 'react';
import LocationService from '@/lib/location-service';

interface Delivery {
  id: string;
  customerName: string;
  coordinates: { latitude: number; longitude: number };
}

const OptimizeDeliveries = () => {
  const [deliveries] = useState<Delivery[]>([
    { id: '1', customerName: 'Mrs. Sharma', coordinates: { latitude: 28.4595, longitude: 77.0266 } },
    { id: '2', customerName: 'Mr. Kumar', coordinates: { latitude: 28.5355, longitude: 77.3910 } },
    { id: '3', customerName: 'Mrs. Singh', coordinates: { latitude: 28.6692, longitude: 77.4538 } },
  ]);
  
  const [optimizedDeliveries, setOptimizedDeliveries] = useState<Delivery[]>([]);
  const [totalDistance, setTotalDistance] = useState<number>(0);

  const optimizeRoute = async () => {
    const locations = deliveries.map(d => d.coordinates);
    
    const result = await LocationService.optimizeRoute(locations);
    
    if (result.success) {
      const optimized = result.optimizedOrder!.map(index => deliveries[index]);
      setOptimizedDeliveries(optimized);
      setTotalDistance(result.totalDistance!);
    }
  };

  return (
    <View>
      <Button title="Optimize Route" onPress={optimizeRoute} />
      
      <Text>Original order: {deliveries.map(d => d.customerName).join(' → ')}</Text>
      
      {optimizedDeliveries.length > 0 && (
        <View>
          <Text>Optimized order: {optimizedDeliveries.map(d => d.customerName).join(' → ')}</Text>
          <Text>Total distance: {totalDistance} km</Text>
          <Text>💡 You'll save fuel and time!</Text>
        </View>
      )}
    </View>
  );
};
```

### Example 4: Address Search for Customer Registration

```tsx
import React, { useState } from 'react';
import { TextInput, FlatList, TouchableOpacity } from 'react-native';
import LocationService from '@/lib/location-service';

const AddressSearch = () => {
  const [query, setQuery] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  const searchAddress = async () => {
    if (!query.trim()) return;

    const result = await LocationService.geocodeAddress(query);

    if (result.success) {
      setSelectedAddress(result.displayName!);
      setCoordinates(result.coordinates!);
    } else {
      alert('Address not found. Please try another search.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter your delivery address"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchAddress}
      />
      
      <Button title="Search" onPress={searchAddress} />

      {selectedAddress && (
        <View>
          <Text>Selected: {selectedAddress}</Text>
          <Text>Coordinates: {coordinates?.latitude}, {coordinates?.longitude}</Text>
        </View>
      )}
    </View>
  );
};
```

---

## 🎨 How It Matches Python Delivery Router

Your Python script had these features, now available in React Native:

| Python Feature | React Native Equivalent |
|---------------|------------------------|
| `getUserLocation()` | `LocationService.getCurrentLocation()` |
| `searchLocation()` with Nominatim | `LocationService.geocodeAddress()` |
| `calculateRoute()` with OSRM | `LocationService.calculateRoute()` |
| `setPickupLocation()` / `setDeliveryLocation()` | Markers with `RouteMapView` |
| Route animation | Can be implemented with `Animated` API |
| Click-to-set location | Use `onPress` events with map markers |
| Distance & Duration display | Built into `RouteMapView` component |
| Open in Google Maps | `Linking.openURL()` with platform-specific URLs |

---

## ✅ Best Practices

1. **Always check permissions** before accessing location
2. **Cache user location** to avoid repeated requests
3. **Handle errors gracefully** - show fallback locations
4. **Use route optimization** for multiple deliveries
5. **Show loading indicators** during geocoding/routing
6. **Test on both web and mobile** - they work differently
7. **Respect user privacy** - explain why you need location

---

## 🔍 Debugging

Enable detailed logs:

```typescript
// Location service already includes console.log statements
// Check your console for messages like:
// [LocationService] Getting current position...
// [LocationService] Location obtained: {...}
// [LocationService] Calculating route...
```

---

## 🌐 Cross-Platform Compatibility

- **iOS**: Uses expo-location + Apple Maps
- **Android**: Uses expo-location + Google Maps
- **Web**: Uses Nominatim API + Google Maps embed

All features work seamlessly across platforms!

---

## 📞 Need Help?

If you encounter issues:
1. Check console logs for detailed error messages
2. Ensure location permissions are granted
3. Verify internet connectivity for geocoding/routing
4. Test with different addresses and locations

---

**Created for Milk Delivery App** 🥛  
Bringing Python's delivery routing power to React Native!
