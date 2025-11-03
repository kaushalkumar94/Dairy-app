import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  Plus,
  Package,
  Edit3,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
} from 'lucide-react-native';

interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  lowStockThreshold: number;
  isActive: boolean;
  description?: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Cow Milk',
    category: 'Milk',
    unit: '1L',
    costPrice: 45,
    sellingPrice: 60,
    currentStock: 25,
    lowStockThreshold: 10,
    isActive: true,
    description: 'Pure fresh cow milk from local farms',
  },
  {
    id: '2',
    name: 'Buffalo Milk',
    category: 'Milk',
    unit: '1L',
    costPrice: 50,
    sellingPrice: 70,
    currentStock: 8,
    lowStockThreshold: 10,
    isActive: true,
    description: 'Rich buffalo milk with high fat content',
  },
  {
    id: '3',
    name: 'Fresh Curd',
    category: 'Curd',
    unit: '500g',
    costPrice: 25,
    sellingPrice: 35,
    currentStock: 15,
    lowStockThreshold: 5,
    isActive: true,
    description: 'Homemade fresh curd',
  },
  {
    id: '4',
    name: 'Paneer',
    category: 'Paneer',
    unit: '250g',
    costPrice: 80,
    sellingPrice: 120,
    currentStock: 0,
    lowStockThreshold: 3,
    isActive: false,
    description: 'Fresh cottage cheese',
  },
  {
    id: '5',
    name: 'Buttermilk',
    category: 'Buttermilk',
    unit: '500ml',
    costPrice: 15,
    sellingPrice: 25,
    currentStock: 20,
    lowStockThreshold: 8,
    isActive: true,
    description: 'Refreshing traditional buttermilk',
  },
];

export default function InventoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(mockProducts);
  const insets = useSafeAreaInsets();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockStatus = (product: Product) => {
    if (product.currentStock === 0) return 'out_of_stock';
    if (product.currentStock <= product.lowStockThreshold) return 'low_stock';
    return 'in_stock';
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'in_stock': return '#4CAF50';
      case 'low_stock': return '#FF9800';
      case 'out_of_stock': return '#F44336';
      default: return '#666';
    }
  };

  const getStockText = (status: string) => {
    switch (status) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      default: return 'Unknown';
    }
  };

  const toggleProductStatus = (productId: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, isActive: !product.isActive }
        : product
    ));
  };

  const updateStock = (productId: string, newStock: number) => {
    if (newStock < 0) {
      Alert.alert('Invalid Stock', 'Stock cannot be negative');
      return;
    }
    
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, currentStock: newStock }
        : product
    ));
  };

  const renderProductCard = ({ item }: { item: Product }) => {
    const stockStatus = getStockStatus(item);
    const profitMargin = ((item.sellingPrice - item.costPrice) / item.costPrice * 100).toFixed(1);
    
    return (
      <View style={styles.productCard}>
        <View style={styles.productHeader}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productCategory}>{item.category} • {item.unit}</Text>
          </View>
          <View style={styles.productActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => toggleProductStatus(item.id)}
            >
              {item.isActive ? (
                <Eye size={18} color="#4CAF50" />
              ) : (
                <EyeOff size={18} color="#666" />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Edit3 size={18} color="#2196F3" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.stockSection}>
          <View style={styles.stockInfo}>
            <View style={[styles.stockBadge, { backgroundColor: `${getStockColor(stockStatus)}15` }]}>
              <View style={[styles.stockDot, { backgroundColor: getStockColor(stockStatus) }]} />
              <Text style={[styles.stockText, { color: getStockColor(stockStatus) }]}>
                {getStockText(stockStatus)}
              </Text>
            </View>
            <Text style={styles.stockQuantity}>
              {item.currentStock} units available
            </Text>
          </View>
          
          {stockStatus === 'low_stock' && (
            <View style={styles.warningBadge}>
              <AlertTriangle size={14} color="#FF9800" />
              <Text style={styles.warningText}>Low Stock Alert</Text>
            </View>
          )}
        </View>
        
        <View style={styles.priceSection}>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Cost Price</Text>
            <Text style={styles.costPrice}>₹{item.costPrice}</Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Selling Price</Text>
            <Text style={styles.sellingPrice}>₹{item.sellingPrice}</Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Profit Margin</Text>
            <View style={styles.profitContainer}>
              {parseFloat(profitMargin) > 0 ? (
                <TrendingUp size={14} color="#4CAF50" />
              ) : (
                <TrendingDown size={14} color="#F44336" />
              )}
              <Text style={[
                styles.profitMargin,
                { color: parseFloat(profitMargin) > 0 ? '#4CAF50' : '#F44336' }
              ]}>
                {profitMargin}%
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.stockActions}>
          <TouchableOpacity 
            style={styles.stockButton}
            onPress={() => updateStock(item.id, item.currentStock + 10)}
          >
            <Plus size={16} color="#4CAF50" />
            <Text style={styles.stockButtonText}>Add Stock</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.stockButton, styles.updateButton]}
            onPress={() => {
              Alert.prompt(
                'Update Stock',
                `Current stock: ${item.currentStock} units`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Update',
                    onPress: (text?: string) => {
                      const newStock = parseInt(text || '0');
                      if (!isNaN(newStock)) {
                        updateStock(item.id, newStock);
                      }
                    }
                  }
                ],
                'plain-text',
                item.currentStock.toString()
              );
            }}
          >
            <Package size={16} color="#2196F3" />
            <Text style={[styles.stockButtonText, { color: '#2196F3' }]}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const lowStockProducts = products.filter(p => getStockStatus(p) === 'low_stock').length;
  const outOfStockProducts = products.filter(p => getStockStatus(p) === 'out_of_stock').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{
          title: 'Inventory',
          headerRight: () => (
            <TouchableOpacity style={styles.addButton}>
              <Plus size={24} color="#2196F3" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalProducts}</Text>
          <Text style={styles.statLabel}>Total Products</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activeProducts}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#FF9800' }]}>{lowStockProducts}</Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#F44336' }]}>{outOfStockProducts}</Text>
          <Text style={styles.statLabel}>Out of Stock</Text>
        </View>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      {/* Product List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  addButton: {
    marginRight: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
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
  productList: {
    padding: 16,
    paddingTop: 0,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
  },
  productActions: {
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
  stockSection: {
    marginBottom: 12,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stockQuantity: {
    fontSize: 14,
    color: '#666',
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  warningText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 4,
    fontWeight: '600',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 12,
  },
  priceItem: {
    alignItems: 'center',
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  costPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
  sellingPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  profitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profitMargin: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  stockActions: {
    flexDirection: 'row',
    gap: 12,
  },
  stockButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E8',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  updateButton: {
    backgroundColor: '#E3F2FD',
  },
  stockButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
});