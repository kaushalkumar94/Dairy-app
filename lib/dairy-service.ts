import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  limit,
  Timestamp,
  GeoPoint
} from 'firebase/firestore';
import { db } from './firebase';
import { CHANDIGARH_DAIRIES, Dairy } from '@/constants/chandigarh-dairies';
import LocationService, { Coordinates } from './location-service';

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  location: Coordinates;
  isActive: boolean;
  currentDeliveries: string[];
}

export interface ActiveDelivery {
  id: string;
  dairyId: string;
  customerId: string;
  deliveryPersonId: string;
  status: 'preparing' | 'out_for_delivery' | 'nearby' | 'arrived' | 'delivered';
  pickupLocation: Coordinates;
  deliveryLocation: Coordinates;
  currentLocation: Coordinates;
  estimatedArrival: Date;
  products: {
    name: string;
    quantity: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

class DairyService {
  private static instance: DairyService;
  private useMockData: boolean = true;

  private constructor() {}

  static getInstance(): DairyService {
    if (!DairyService.instance) {
      DairyService.instance = new DairyService();
    }
    return DairyService.instance;
  }

  setUseMockData(useMock: boolean) {
    this.useMockData = useMock;
    console.log('[DairyService] Mock data mode:', useMock);
  }

  async getAllDairies(userLocation?: Coordinates): Promise<Dairy[]> {
    try {
      if (this.useMockData) {
        console.log('[DairyService] Using mock Chandigarh dairies');
        
        if (userLocation) {
          return CHANDIGARH_DAIRIES.map(dairy => ({
            ...dairy,
            distance: LocationService.calculateDistance(
              userLocation,
              dairy.coordinates
            ),
          })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
        }
        
        return CHANDIGARH_DAIRIES;
      }

      console.log('[DairyService] Fetching dairies from Firebase');
      const dairiesRef = collection(db, 'dairies');
      const snapshot = await getDocs(dairiesRef);
      
      const dairies: Dairy[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const geoPoint = data.coordinates as GeoPoint;
        
        const dairy: Dairy = {
          id: doc.id,
          businessName: data.businessName,
          ownerName: data.ownerName,
          phone: data.phone,
          address: data.address,
          coordinates: {
            latitude: geoPoint.latitude,
            longitude: geoPoint.longitude,
          },
          rating: data.rating || 0,
          totalReviews: data.totalReviews || 0,
          isAvailable: data.isAvailable || false,
          workingHours: data.workingHours,
          products: data.products || [],
          priceRange: data.priceRange,
        };

        if (userLocation) {
          dairy.distance = LocationService.calculateDistance(
            userLocation,
            dairy.coordinates
          );
        }

        dairies.push(dairy);
      });

      return dairies.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } catch (error) {
      console.error('[DairyService] Error fetching dairies:', error);
      console.log('[DairyService] Falling back to mock data');
      return CHANDIGARH_DAIRIES;
    }
  }

  async getDairyById(id: string): Promise<Dairy | null> {
    try {
      if (this.useMockData) {
        const dairy = CHANDIGARH_DAIRIES.find(d => d.id === id);
        return dairy || null;
      }

      const dairyRef = doc(db, 'dairies', id);
      const snapshot = await getDoc(dairyRef);
      
      if (!snapshot.exists()) {
        return null;
      }

      const data = snapshot.data();
      const geoPoint = data.coordinates as GeoPoint;
      
      return {
        id: snapshot.id,
        businessName: data.businessName,
        ownerName: data.ownerName,
        phone: data.phone,
        address: data.address,
        coordinates: {
          latitude: geoPoint.latitude,
          longitude: geoPoint.longitude,
        },
        rating: data.rating || 0,
        totalReviews: data.totalReviews || 0,
        isAvailable: data.isAvailable || false,
        workingHours: data.workingHours,
        products: data.products || [],
        priceRange: data.priceRange,
      };
    } catch (error) {
      console.error('[DairyService] Error fetching dairy:', error);
      return null;
    }
  }

  async createDelivery(
    dairyId: string,
    customerId: string,
    deliveryLocation: Coordinates,
    products: { name: string; quantity: string }[]
  ): Promise<string | null> {
    try {
      if (this.useMockData) {
        console.log('[DairyService] Mock delivery created');
        return 'mock-delivery-id';
      }

      const dairy = await this.getDairyById(dairyId);
      if (!dairy) {
        throw new Error('Dairy not found');
      }

      const deliveryData = {
        dairyId,
        customerId,
        deliveryPersonId: 'auto-assigned',
        status: 'preparing',
        pickupLocation: new GeoPoint(
          dairy.coordinates.latitude,
          dairy.coordinates.longitude
        ),
        deliveryLocation: new GeoPoint(
          deliveryLocation.latitude,
          deliveryLocation.longitude
        ),
        currentLocation: new GeoPoint(
          dairy.coordinates.latitude,
          dairy.coordinates.longitude
        ),
        estimatedArrival: Timestamp.fromDate(
          new Date(Date.now() + 30 * 60 * 1000)
        ),
        products,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const deliveriesRef = collection(db, 'deliveries');
      const docRef = await addDoc(deliveriesRef, deliveryData);
      
      console.log('[DairyService] Delivery created:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('[DairyService] Error creating delivery:', error);
      return null;
    }
  }

  async getActiveDelivery(customerId: string): Promise<ActiveDelivery | null> {
    try {
      if (this.useMockData) {
        console.log('[DairyService] Returning mock active delivery');
        
        const dairy = CHANDIGARH_DAIRIES[0];
        
        return {
          id: 'mock-delivery-1',
          dairyId: dairy.id,
          customerId,
          deliveryPersonId: 'mock-person-1',
          status: 'out_for_delivery',
          pickupLocation: dairy.coordinates,
          deliveryLocation: { 
            latitude: 30.7450, 
            longitude: 76.7850 
          },
          currentLocation: { 
            latitude: 30.7410, 
            longitude: 76.7820 
          },
          estimatedArrival: new Date(Date.now() + 15 * 60 * 1000),
          products: [
            { name: 'Fresh Cow Milk', quantity: '2L' },
          ],
          createdAt: new Date(Date.now() - 10 * 60 * 1000),
          updatedAt: new Date(),
        };
      }

      const deliveriesRef = collection(db, 'deliveries');
      const q = query(
        deliveriesRef,
        where('customerId', '==', customerId),
        where('status', 'in', ['preparing', 'out_for_delivery', 'nearby']),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      const pickupGeo = data.pickupLocation as GeoPoint;
      const deliveryGeo = data.deliveryLocation as GeoPoint;
      const currentGeo = data.currentLocation as GeoPoint;

      return {
        id: doc.id,
        dairyId: data.dairyId,
        customerId: data.customerId,
        deliveryPersonId: data.deliveryPersonId,
        status: data.status,
        pickupLocation: {
          latitude: pickupGeo.latitude,
          longitude: pickupGeo.longitude,
        },
        deliveryLocation: {
          latitude: deliveryGeo.latitude,
          longitude: deliveryGeo.longitude,
        },
        currentLocation: {
          latitude: currentGeo.latitude,
          longitude: currentGeo.longitude,
        },
        estimatedArrival: (data.estimatedArrival as Timestamp).toDate(),
        products: data.products,
        createdAt: (data.createdAt as Timestamp).toDate(),
        updatedAt: (data.updatedAt as Timestamp).toDate(),
      };
    } catch (error) {
      console.error('[DairyService] Error fetching active delivery:', error);
      return null;
    }
  }

  async updateDeliveryLocation(
    deliveryId: string,
    newLocation: Coordinates
  ): Promise<boolean> {
    try {
      if (this.useMockData) {
        console.log('[DairyService] Mock delivery location updated');
        return true;
      }

      const deliveryRef = doc(db, 'deliveries', deliveryId);
      await updateDoc(deliveryRef, {
        currentLocation: new GeoPoint(newLocation.latitude, newLocation.longitude),
        updatedAt: Timestamp.now(),
      });

      return true;
    } catch (error) {
      console.error('[DairyService] Error updating delivery location:', error);
      return false;
    }
  }

  async searchDairies(searchQuery: string): Promise<Dairy[]> {
    try {
      const allDairies = await this.getAllDairies();
      
      const lowerQuery = searchQuery.toLowerCase();
      
      return allDairies.filter(dairy => 
        dairy.businessName.toLowerCase().includes(lowerQuery) ||
        dairy.ownerName.toLowerCase().includes(lowerQuery) ||
        dairy.address.toLowerCase().includes(lowerQuery) ||
        dairy.products.some(p => p.name.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('[DairyService] Error searching dairies:', error);
      return [];
    }
  }

  async getNearbyDairies(
    location: Coordinates,
    radiusKm: number = 5
  ): Promise<Dairy[]> {
    try {
      const allDairies = await this.getAllDairies(location);
      
      return allDairies.filter(dairy => 
        (dairy.distance || 0) <= radiusKm
      );
    } catch (error) {
      console.error('[DairyService] Error finding nearby dairies:', error);
      return [];
    }
  }
}

export default DairyService.getInstance();
