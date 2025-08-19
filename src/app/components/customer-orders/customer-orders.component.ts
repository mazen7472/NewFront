import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../Services/order.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.css']
})
export class CustomerOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = false;
  error = '';
  stats = {
    total: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  };

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCustomerOrders();
  }

  loadCustomerOrders(): void {
    this.loading = true;
    this.error = '';

    const customerId = localStorage.getItem('customerId') || this.authService.customerId;
    if (customerId) {
      console.log('Loading orders for customer ID:', customerId);
      this.orderService.getOrdersByCustomer(customerId).subscribe({
        next: (response) => {
          if (response.success) {
            this.orders = response.data;
            this.updateStats();
          } else {
            this.error = response.message || 'Failed to load orders';
            console.error('Failed to load orders:', response.message);
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading orders:', err);
          this.error = 'Failed to load orders';
          this.loading = false;
          
          // For development/testing, add mock data
          if (err.status === 0 || err.status === 404) {
            console.log('Adding mock orders for development');
            this.orders = [
              {
                id: '1',
                orderNumber: 'ORD001',
                status: 'Delivered',
                createdAt: '2024-01-15',
                items: [
                  { name: 'Product A', price: 99.99, quantity: 2 },
                  { name: 'Product B', price: 149.99, quantity: 1 }
                ]
              },
              {
                id: '2',
                orderNumber: 'ORD002',
                status: 'Shipped',
                createdAt: '2024-01-18',
                items: [
                  { name: 'Product C', price: 199.99, quantity: 1 }
                ]
              }
            ];
            this.error = '';
            this.updateStats();
          }
        }
      });
    } else {
      this.error = 'User not authenticated. Please log in again.';
      this.loading = false;
      console.error('Customer ID not found in localStorage. Available keys:', Object.keys(localStorage));
    }
  }

  private updateStats(): void {
    this.stats.total = this.orders.length;
    this.stats.pending = this.orders.filter(order => order.status === 'Pending').length;
    this.stats.confirmed = this.orders.filter(order => order.status === 'Confirmed').length;
    this.stats.shipped = this.orders.filter(order => order.status === 'Shipped').length;
    this.stats.delivered = this.orders.filter(order => order.status === 'Delivered').length;
    this.stats.cancelled = this.orders.filter(order => order.status === 'Cancelled').length;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning';
      case 'Confirmed': return 'bg-info';
      case 'Shipped': return 'bg-primary';
      case 'Delivered': return 'bg-success';
      case 'Cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Pending': return 'bi-clock';
      case 'Confirmed': return 'bi-check-circle';
      case 'Shipped': return 'bi-truck';
      case 'Delivered': return 'bi-check-circle-fill';
      case 'Cancelled': return 'bi-x-circle';
      default: return 'bi-question-circle';
    }
  }

  getOrderTotal(order: any): number {
    return order.items?.reduce((total: number, item: any) => 
      total + (item.price * item.quantity), 0) || 0;
  }
} 