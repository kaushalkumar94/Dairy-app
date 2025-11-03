import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Download,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface RevenueData {
  day: string;
  revenue: number;
  deliveries: number;
}

interface ProductSales {
  name: string;
  quantity: number;
  revenue: number;
  color: string;
}

const mockRevenueData: RevenueData[] = [
  { day: 'Mon', revenue: 1240, deliveries: 24 },
  { day: 'Tue', revenue: 1180, deliveries: 22 },
  { day: 'Wed', revenue: 1350, deliveries: 26 },
  { day: 'Thu', revenue: 1420, deliveries: 28 },
  { day: 'Fri', revenue: 1380, deliveries: 27 },
  { day: 'Sat', revenue: 1560, deliveries: 32 },
  { day: 'Sun', revenue: 1200, deliveries: 25 },
];

const mockProductSales: ProductSales[] = [
  { name: 'Fresh Cow Milk', quantity: 120, revenue: 7200, color: '#2196F3' },
  { name: 'Buffalo Milk', quantity: 80, revenue: 5600, color: '#4CAF50' },
  { name: 'Fresh Curd', quantity: 60, revenue: 2100, color: '#FF9800' },
  { name: 'Paneer', quantity: 25, revenue: 3000, color: '#9C27B0' },
  { name: 'Buttermilk', quantity: 40, revenue: 1000, color: '#F44336' },
];

export default function ReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const insets = useSafeAreaInsets();

  const totalRevenue = mockRevenueData.reduce((sum, data) => sum + data.revenue, 0);
  const totalDeliveries = mockRevenueData.reduce((sum, data) => sum + data.deliveries, 0);
  const avgRevenuePerDelivery = totalRevenue / totalDeliveries;
  const totalExpenses = 4200; // Mock data
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = (netProfit / totalRevenue) * 100;

  const renderBarChart = () => {
    const maxRevenue = Math.max(...mockRevenueData.map(d => d.revenue));
    const chartWidth = width - 64;
    const barWidth = (chartWidth - 60) / mockRevenueData.length;
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Revenue Trend</Text>
        <View style={styles.chart}>
          <View style={styles.yAxis}>
            <Text style={styles.yAxisLabel}>₹{Math.round(maxRevenue)}</Text>
            <Text style={styles.yAxisLabel}>₹{Math.round(maxRevenue * 0.5)}</Text>
            <Text style={styles.yAxisLabel}>₹0</Text>
          </View>
          <View style={styles.barsContainer}>
            {mockRevenueData.map((data, index) => {
              const barHeight = (data.revenue / maxRevenue) * 120;
              return (
                <View key={data.day} style={styles.barGroup}>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar,
                        { 
                          height: barHeight,
                          width: barWidth - 8,
                          backgroundColor: '#2196F3'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.xAxisLabel}>{data.day}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderPieChart = () => {
    const totalProductRevenue = mockProductSales.reduce((sum, product) => sum + product.revenue, 0);
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Product Sales Distribution</Text>
        <View style={styles.pieChartContainer}>
          <View style={styles.pieChart}>
            <PieChart size={120} color="#E0E0E0" />
            <View style={styles.pieChartOverlay}>
              <Text style={styles.pieChartTotal}>₹{totalProductRevenue}</Text>
              <Text style={styles.pieChartLabel}>Total Sales</Text>
            </View>
          </View>
          <View style={styles.legendContainer}>
            {mockProductSales.map((product, index) => {
              const percentage = ((product.revenue / totalProductRevenue) * 100).toFixed(1);
              return (
                <View key={product.name} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: product.color }]} />
                  <View style={styles.legendText}>
                    <Text style={styles.legendName}>{product.name}</Text>
                    <Text style={styles.legendValue}>₹{product.revenue} ({percentage}%)</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const periodOptions = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'year', label: 'This Year' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{
          title: 'Financial Reports',
          headerRight: () => (
            <TouchableOpacity style={styles.downloadButton}>
              <Download size={24} color="#2196F3" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periodOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.periodButton,
                selectedPeriod === option.key && styles.activePeriodButton
              ]}
              onPress={() => setSelectedPeriod(option.key as any)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === option.key && styles.activePeriodButtonText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <DollarSign size={24} color="#4CAF50" />
              <View style={styles.metricTrend}>
                <TrendingUp size={16} color="#4CAF50" />
                <Text style={[styles.trendText, { color: '#4CAF50' }]}>+12%</Text>
              </View>
            </View>
            <Text style={styles.metricValue}>₹{totalRevenue.toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Total Revenue</Text>
          </View>
          
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Package size={24} color="#2196F3" />
              <View style={styles.metricTrend}>
                <TrendingUp size={16} color="#4CAF50" />
                <Text style={[styles.trendText, { color: '#4CAF50' }]}>+8%</Text>
              </View>
            </View>
            <Text style={styles.metricValue}>{totalDeliveries}</Text>
            <Text style={styles.metricLabel}>Total Deliveries</Text>
          </View>
        </View>
        
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <BarChart3 size={24} color="#FF9800" />
              <View style={styles.metricTrend}>
                <TrendingDown size={16} color="#F44336" />
                <Text style={[styles.trendText, { color: '#F44336' }]}>-3%</Text>
              </View>
            </View>
            <Text style={styles.metricValue}>₹{Math.round(avgRevenuePerDelivery)}</Text>
            <Text style={styles.metricLabel}>Avg per Delivery</Text>
          </View>
          
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <TrendingUp size={24} color="#9C27B0" />
              <View style={styles.metricTrend}>
                <TrendingUp size={16} color="#4CAF50" />
                <Text style={[styles.trendText, { color: '#4CAF50' }]}>+15%</Text>
              </View>
            </View>
            <Text style={styles.metricValue}>₹{netProfit.toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Net Profit</Text>
          </View>
        </View>
        
        {/* Profit Margin Card */}
        <View style={styles.profitMarginCard}>
          <View style={styles.profitMarginHeader}>
            <Text style={styles.profitMarginTitle}>Profit Margin</Text>
            <Text style={[styles.profitMarginValue, { color: profitMargin > 0 ? '#4CAF50' : '#F44336' }]}>
              {profitMargin.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.profitBreakdown}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Revenue</Text>
              <Text style={styles.breakdownValue}>₹{totalRevenue.toLocaleString()}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Expenses</Text>
              <Text style={[styles.breakdownValue, { color: '#F44336' }]}>₹{totalExpenses.toLocaleString()}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Net Profit</Text>
              <Text style={[styles.breakdownValue, { color: '#4CAF50' }]}>₹{netProfit.toLocaleString()}</Text>
            </View>
          </View>
        </View>
        
        {/* Charts */}
        {renderBarChart()}
        {renderPieChart()}
        
        {/* Top Products */}
        <View style={styles.topProductsContainer}>
          <Text style={styles.sectionTitle}>Top Selling Products</Text>
          {mockProductSales.map((product, index) => {
            const totalQuantity = mockProductSales.reduce((sum, p) => sum + p.quantity, 0);
            const percentage = (product.quantity / totalQuantity) * 100;
            
            return (
              <View key={product.name} style={styles.productItem}>
                <View style={styles.productRank}>
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productStats}>
                    {product.quantity} units • ₹{product.revenue}
                  </Text>
                </View>
                <View style={styles.productProgress}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${percentage}%`,
                          backgroundColor: product.color
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{percentage.toFixed(0)}%</Text>
                </View>
              </View>
            );
          })}
        </View>
        
        {/* Export Options */}
        <View style={styles.exportContainer}>
          <Text style={styles.sectionTitle}>Export Reports</Text>
          <View style={styles.exportButtons}>
            <TouchableOpacity style={styles.exportButton}>
              <Download size={20} color="#2196F3" />
              <Text style={styles.exportButtonText}>Export PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <Download size={20} color="#4CAF50" />
              <Text style={styles.exportButtonText}>Export Excel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  downloadButton: {
    marginRight: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activePeriodButton: {
    backgroundColor: '#2196F3',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activePeriodButtonText: {
    color: '#FFF',
  },
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  profitMarginCard: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profitMarginHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profitMarginTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profitMarginValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profitBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  chartContainer: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    height: 140,
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  barGroup: {
    alignItems: 'center',
  },
  barContainer: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    borderRadius: 4,
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieChart: {
    position: 'relative',
    marginRight: 20,
  },
  pieChartOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieChartTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pieChartLabel: {
    fontSize: 10,
    color: '#666',
  },
  legendContainer: {
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
  },
  legendName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  legendValue: {
    fontSize: 10,
    color: '#666',
  },
  topProductsContainer: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  productStats: {
    fontSize: 12,
    color: '#666',
  },
  productProgress: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#666',
  },
  exportContainer: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});