import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService, GeneralResponse, PaginatedResponse, ProductDTO, OrderReadDTO, MaintenanceDTO, DeliveryDTO, CommissionDTO } from '../../../../Services/api.service';

interface DashboardStats {
  totalProducts: number;
  pendingProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalTechCompanies: number;
  totalDeliveryPersons: number;
  activeMaintenanceRequests: number;
  activeDeliveries: number;
  totalCommissions: number;
  recentOrders: OrderReadDTO[];
  recentMaintenance: MaintenanceDTO[];
  topProducts: ProductDTO[];
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  private apiService = inject(ApiService);
  
  stats: DashboardStats = {
    totalProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalTechCompanies: 0,
    totalDeliveryPersons: 0,
    activeMaintenanceRequests: 0,
    activeDeliveries: 0,
    totalCommissions: 0,
    recentOrders: [],
    recentMaintenance: [],
    topProducts: []
  };

  loading = true;
  error = '';

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = '';

    // Load all statistics in parallel
    Promise.all([
      this.loadProductsStats(),
      this.loadOrdersStats(),
      this.loadMaintenanceStats(),
      this.loadDeliveryStats(),
      this.loadCommissionStats(),
      this.loadRecentData()
    ]).then(() => {
      this.loading = false;
    }).catch(error => {
      console.error('Error loading dashboard data:', error);
      this.error = 'Failed to load dashboard data';
      this.loading = false;
    });
  }

  private async loadProductsStats(): Promise<void> {
    try {
      // Get all products
      const allProducts = await firstValueFrom(this.apiService.getAllProducts({ pageSize: 1000 }));
      if (allProducts?.success) {
        this.stats.totalProducts = allProducts.data.totalCount;
      }

      // Get pending products
      const pendingProducts = await firstValueFrom(this.apiService.getPendingProducts({ pageSize: 1000 }));
      if (pendingProducts?.success) {
        this.stats.pendingProducts = pendingProducts.data.totalCount;
      }

      // Get top products (most expensive)
      const topProducts = await firstValueFrom(this.apiService.getAllProducts({ 
        pageSize: 5, 
        sortBy: 'price', 
        sortDesc: true 
      }));
      if (topProducts?.success) {
        this.stats.topProducts = topProducts.data.items;
      }
    } catch (error) {
      console.error('Error loading products stats:', error);
    }
  }

  private async loadOrdersStats(): Promise<void> {
    try {
      // Get all orders
      const orders = await firstValueFrom(this.apiService.getAllOrders());
      if (orders?.success) {
        this.stats.totalOrders = orders.data.length;
        // Calculate total revenue
        this.stats.totalRevenue = orders.data.reduce((sum: number, order: OrderReadDTO) => sum + order.totalAmount, 0);

        // Get recent orders (last 5)
        this.stats.recentOrders = orders.data
          .sort((a: OrderReadDTO, b: OrderReadDTO) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
          .slice(0, 5);
      }
    } catch (error) {
      console.error('Error loading orders stats:', error);
    }
  }

  private async loadMaintenanceStats(): Promise<void> {
    try {
      // Get all maintenance requests
      const maintenance = await firstValueFrom(this.apiService.getAllMaintenance());
      if (maintenance?.success) {
        this.stats.activeMaintenanceRequests = maintenance.data.filter((m: MaintenanceDTO) => 
          m.status === 'Requested' || m.status === 'InProgress'
        ).length;

        // Get recent maintenance requests (last 5)
        this.stats.recentMaintenance = maintenance.data
          .filter((m: MaintenanceDTO) => m.status === 'Requested' || m.status === 'InProgress')
          .sort((a: MaintenanceDTO, b: MaintenanceDTO) => new Date(b.warrantyStart).getTime() - new Date(a.warrantyStart).getTime())
          .slice(0, 5);
      }
    } catch (error) {
      console.error('Error loading maintenance stats:', error);
    }
  }

  private async loadDeliveryStats(): Promise<void> {
    try {
      // Get all deliveries
      const deliveries = await firstValueFrom(this.apiService.getAllDeliveries());
      if (deliveries?.success) {
        this.stats.activeDeliveries = deliveries.data.filter((d: DeliveryDTO) => 
          d.status === 'Assigned' || d.status === 'InTransit'
        ).length;
      }
    } catch (error) {
      console.error('Error loading delivery stats:', error);
    }
  }

  private async loadCommissionStats(): Promise<void> {
    try {
      // Get all commissions
      const commissions = await firstValueFrom(this.apiService.getAllCommissions());
      if (commissions?.success) {
        this.stats.totalCommissions = commissions.data.length;
      }
    } catch (error) {
      console.error('Error loading commission stats:', error);
    }
  }

  private async loadRecentData(): Promise<void> {
    // Additional data loading can be added here
    // For now, we'll use placeholder data for user counts
    this.stats.totalCustomers = 1250; // This would come from user management API
    this.stats.totalTechCompanies = 45; // This would come from user management API
    this.stats.totalDeliveryPersons = 23; // This would come from user management API
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'success';
      case 'inprogress':
      case 'intransit':
        return 'warning';
      case 'requested':
      case 'assigned':
        return 'info';
      case 'cancelled':
      case 'failed':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bi-check-circle-fill';
      case 'inprogress':
      case 'intransit':
        return 'bi-clock-fill';
      case 'requested':
      case 'assigned':
        return 'bi-hourglass-split';
      case 'cancelled':
      case 'failed':
        return 'bi-x-circle-fill';
      default:
        return 'bi-question-circle-fill';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/Images/placeholder.png';
    }
  }
} 