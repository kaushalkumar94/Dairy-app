export type UserType = 'customer' | 'milkman';

export interface User {
  id: string;
  phone: string;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  name: string;
  email?: string;
  profilePhoto?: string;
  addresses: Address[];
  primaryAddressId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MilkmanProfile {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  profilePhoto?: string;
  phone: string;
  serviceArea: {
    type: 'radius' | 'localities';
    radius?: number; // in km
    localities?: string[];
    center?: GeoPoint;
  };
  workingHours: {
    startTime: string; // HH:MM format
    endTime: string;
  };
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  isAvailable: boolean;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  label: string; // Home, Office, etc.
  fullAddress: string;
  landmark?: string;
  location: GeoPoint;
  instructions?: string;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Product {
  id: string;
  milkmanId: string;
  name: string;
  category: ProductCategory;
  unit: string; // Liter, 500ml, Kg, etc.
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  lowStockThreshold: number;
  photo?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory = 
  | 'Milk' 
  | 'Curd' 
  | 'Paneer' 
  | 'Buttermilk' 
  | 'Ghee' 
  | 'Cheese' 
  | 'Butter' 
  | 'Lassi' 
  | 'Other';

export interface Subscription {
  id: string;
  customerId: string;
  milkmanId: string;
  productId: string;
  quantity: number;
  frequency: SubscriptionFrequency;
  startDate: Date;
  endDate?: Date;
  status: SubscriptionStatus;
  pricePerDelivery: number;
  deliveryInstructions?: string;
  pausedFrom?: Date;
  pausedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionFrequency = 
  | 'daily' 
  | 'alternate' 
  | 'weekly' 
  | 'custom';

export type SubscriptionStatus = 
  | 'active' 
  | 'paused' 
  | 'cancelled' 
  | 'expired';

export interface Delivery {
  id: string;
  subscriptionId?: string;
  orderId?: string;
  customerId: string;
  milkmanId: string;
  productId: string;
  quantity: number;
  scheduledDate: Date;
  deliveredAt?: Date;
  status: DeliveryStatus;
  amount: number;
  paymentStatus: PaymentStatus;
  deliveryAddress: Address;
  notes?: string;
  proofPhoto?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DeliveryStatus = 
  | 'pending' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'not_home' 
  | 'cancelled';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed';

export interface Order {
  id: string;
  customerId: string;
  milkmanId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: Address;
  requestedDeliveryTime?: Date;
  isUrgent: boolean;
  urgentCharges?: number;
  status: OrderStatus;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'accepted' 
  | 'rejected' 
  | 'preparing' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export interface Payment {
  id: string;
  customerId: string;
  milkmanId: string;
  deliveryIds?: string[];
  subscriptionId?: string;
  orderId?: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentMethod = 
  | 'cash' 
  | 'upi' 
  | 'card' 
  | 'wallet';

export interface Expense {
  id: string;
  milkmanId: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: Date;
  receipt?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ExpenseCategory = 
  | 'procurement' 
  | 'fuel' 
  | 'maintenance' 
  | 'salary' 
  | 'packaging' 
  | 'equipment' 
  | 'other';

export interface Review {
  id: string;
  customerId: string;
  milkmanId: string;
  deliveryId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  id: string;
  customerId: string;
  milkmanId: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: {
    customer: number;
    milkman: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderType: UserType;
  content: string;
  type: MessageType;
  readAt?: Date;
  createdAt: Date;
}

export type MessageType = 'text' | 'image' | 'system';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'delivery_reminder' 
  | 'payment_due' 
  | 'new_order' 
  | 'order_status' 
  | 'subscription_expiry' 
  | 'low_stock' 
  | 'promotion' 
  | 'system';