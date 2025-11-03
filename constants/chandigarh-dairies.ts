export interface Dairy {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
  rating: number;
  totalReviews: number;
  isAvailable: boolean;
  workingHours: {
    startTime: string;
    endTime: string;
  };
  products: {
    name: string;
    price: number;
    unit: string;
  }[];
  priceRange: {
    min: number;
    max: number;
  };
}

export const CHANDIGARH_CENTER = {
  latitude: 30.7333,
  longitude: 76.7794,
};

export const CHANDIGARH_DAIRIES: Dairy[] = [
  {
    id: '1',
    businessName: 'Verka Dairy Farm',
    ownerName: 'Gurpreet Singh',
    phone: '+91 98765 43210',
    address: 'Sector 17, Chandigarh',
    coordinates: { latitude: 30.7410, longitude: 76.7791 },
    distance: 0.9,
    rating: 4.9,
    totalReviews: 342,
    isAvailable: true,
    workingHours: { startTime: '05:00', endTime: '21:00' },
    products: [
      { name: 'Fresh Cow Milk', price: 65, unit: '1L' },
      { name: 'Buffalo Milk', price: 75, unit: '1L' },
      { name: 'Toned Milk', price: 50, unit: '1L' },
      { name: 'Fresh Curd', price: 40, unit: '500g' },
      { name: 'Paneer', price: 150, unit: '250g' },
    ],
    priceRange: { min: 40, max: 150 },
  },
  {
    id: '2',
    businessName: 'Punjab Organic Dairy',
    ownerName: 'Harjeet Kaur',
    phone: '+91 87654 32109',
    address: 'Sector 22, Chandigarh',
    coordinates: { latitude: 30.7290, longitude: 76.7645 },
    distance: 1.5,
    rating: 4.7,
    totalReviews: 198,
    isAvailable: true,
    workingHours: { startTime: '06:00', endTime: '20:00' },
    products: [
      { name: 'Organic Cow Milk', price: 85, unit: '1L' },
      { name: 'A2 Gir Cow Milk', price: 130, unit: '1L' },
      { name: 'Organic Curd', price: 50, unit: '500g' },
      { name: 'Farm Fresh Ghee', price: 550, unit: '500g' },
    ],
    priceRange: { min: 50, max: 550 },
  },
  {
    id: '3',
    businessName: 'Amul Fresh Dairy',
    ownerName: 'Rajiv Kumar',
    phone: '+91 76543 21098',
    address: 'Sector 35, Chandigarh',
    coordinates: { latitude: 30.7150, longitude: 76.8010 },
    distance: 2.3,
    rating: 4.5,
    totalReviews: 456,
    isAvailable: true,
    workingHours: { startTime: '06:30', endTime: '22:00' },
    products: [
      { name: 'Fresh Cow Milk', price: 60, unit: '1L' },
      { name: 'Buffalo Milk', price: 70, unit: '1L' },
      { name: 'Amul Butter', price: 55, unit: '100g' },
      { name: 'Amul Cheese', price: 140, unit: '200g' },
      { name: 'Lassi', price: 30, unit: '200ml' },
    ],
    priceRange: { min: 30, max: 140 },
  },
  {
    id: '4',
    businessName: 'Golden Milk Center',
    ownerName: 'Manpreet Singh',
    phone: '+91 65432 10987',
    address: 'Sector 44, Chandigarh',
    coordinates: { latitude: 30.7005, longitude: 76.7506 },
    distance: 3.2,
    rating: 4.6,
    totalReviews: 124,
    isAvailable: false,
    workingHours: { startTime: '07:00', endTime: '19:00' },
    products: [
      { name: 'Jersey Cow Milk', price: 95, unit: '1L' },
      { name: 'Double Toned Milk', price: 48, unit: '1L' },
      { name: 'Malai', price: 80, unit: '200g' },
    ],
    priceRange: { min: 48, max: 95 },
  },
  {
    id: '5',
    businessName: 'Panchkula Farm Fresh',
    ownerName: 'Sukhdeep Sharma',
    phone: '+91 99887 76655',
    address: 'Sector 8, Panchkula (near Chandigarh)',
    coordinates: { latitude: 30.6942, longitude: 76.8534 },
    distance: 4.1,
    rating: 4.8,
    totalReviews: 89,
    isAvailable: true,
    workingHours: { startTime: '05:30', endTime: '20:30' },
    products: [
      { name: 'Farm Fresh Cow Milk', price: 70, unit: '1L' },
      { name: 'Buffalo Milk', price: 80, unit: '1L' },
      { name: 'Organic Paneer', price: 160, unit: '250g' },
      { name: 'Fresh Cream', price: 45, unit: '200ml' },
    ],
    priceRange: { min: 45, max: 160 },
  },
  {
    id: '6',
    businessName: 'Mohali Pure Dairy',
    ownerName: 'Jaspreet Singh',
    phone: '+91 88776 65544',
    address: 'Phase 7, Mohali (near Chandigarh)',
    coordinates: { latitude: 30.7046, longitude: 76.6934 },
    distance: 3.8,
    rating: 4.4,
    totalReviews: 267,
    isAvailable: true,
    workingHours: { startTime: '06:00', endTime: '21:00' },
    products: [
      { name: 'Cow Milk', price: 58, unit: '1L' },
      { name: 'Buffalo Milk', price: 68, unit: '1L' },
      { name: 'Curd', price: 35, unit: '500g' },
      { name: 'Buttermilk', price: 25, unit: '500ml' },
    ],
    priceRange: { min: 25, max: 68 },
  },
  {
    id: '7',
    businessName: 'Heritage Milk Corner',
    ownerName: 'Navdeep Kaur',
    phone: '+91 77665 54433',
    address: 'Sector 28, Chandigarh',
    coordinates: { latitude: 30.7280, longitude: 76.7988 },
    distance: 1.8,
    rating: 4.3,
    totalReviews: 178,
    isAvailable: true,
    workingHours: { startTime: '07:00', endTime: '20:00' },
    products: [
      { name: 'Cow Milk', price: 62, unit: '1L' },
      { name: 'Flavored Milk', price: 35, unit: '200ml' },
      { name: 'Greek Yogurt', price: 65, unit: '200g' },
    ],
    priceRange: { min: 35, max: 65 },
  },
  {
    id: '8',
    businessName: 'Sahib Dairy Products',
    ownerName: 'Balwinder Singh',
    phone: '+91 66554 43322',
    address: 'Sector 15, Chandigarh',
    coordinates: { latitude: 30.7485, longitude: 76.7812 },
    distance: 1.2,
    rating: 4.7,
    totalReviews: 311,
    isAvailable: true,
    workingHours: { startTime: '05:00', endTime: '22:00' },
    products: [
      { name: 'Pure Cow Milk', price: 66, unit: '1L' },
      { name: 'Buffalo Milk', price: 76, unit: '1L' },
      { name: 'Fresh Paneer', price: 145, unit: '250g' },
      { name: 'Desi Ghee', price: 600, unit: '500g' },
      { name: 'Khoya', price: 180, unit: '250g' },
    ],
    priceRange: { min: 66, max: 600 },
  },
];
