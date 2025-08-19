import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeliveryService } from '../../Services/delivery.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-delivery-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delivery-orders.component.html',
  styleUrls: ['./delivery-orders.component.css']
})
export class DeliveryOrdersComponent implements OnInit {
  deliveries: any[] = [];
  loading = false;
  error = '';
  stats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  };

  constructor(
    private deliveryService: DeliveryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDeliveryOrders();
  }

  loadDeliveryOrders(): void {
    this.loading = true;
    this.error = '';

    const deliveryPersonId = localStorage.getItem('deliveryPersonId');
    if (deliveryPersonId) {
      this.deliveryService.getDeliveriesByDeliveryPerson(deliveryPersonId).subscribe({
        next: (response) => {
          if (response.success) {
            this.deliveries = response.data;
            this.updateStats();
          } else {
            this.error = response.message || 'Failed to load delivery orders';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading delivery orders:', err);
          this.error = 'Failed to load delivery orders';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Delivery person ID not found';
      this.loading = false;
    }
  }

  private updateStats(): void {
    this.stats.total = this.deliveries.length;
    this.stats.pending = this.deliveries.filter(delivery => delivery.status === 'Pending').length;
    this.stats.inProgress = this.deliveries.filter(delivery => delivery.status === 'InProgress').length;
    this.stats.completed = this.deliveries.filter(delivery => delivery.status === 'Completed').length;
    this.stats.cancelled = this.deliveries.filter(delivery => delivery.status === 'Cancelled').length;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning';
      case 'InProgress': return 'bg-primary';
      case 'Completed': return 'bg-success';
      case 'Cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Pending': return 'bi-clock';
      case 'InProgress': return 'bi-truck';
      case 'Completed': return 'bi-check-circle-fill';
      case 'Cancelled': return 'bi-x-circle';
      default: return 'bi-question-circle';
    }
  }

  acceptDelivery(deliveryId: string): void {
    this.deliveryService.updateDelivery(deliveryId, { status: 'InProgress' }).subscribe({
      next: () => {
        this.loadDeliveryOrders();
      },
      error: (err) => {
        console.error('Error accepting delivery:', err);
        this.error = 'Failed to accept delivery';
      }
    });
  }

  completeDelivery(deliveryId: string): void {
    this.deliveryService.updateDelivery(deliveryId, { 
      status: 'Completed',
      actualDeliveryDate: new Date().toISOString()
    }).subscribe({
      next: () => {
        this.loadDeliveryOrders();
      },
      error: (err) => {
        console.error('Error completing delivery:', err);
        this.error = 'Failed to complete delivery';
      }
    });
  }
} 