import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeliveryService } from '../../Services/delivery.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-delivery-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delivery-history.component.html',
  styleUrls: ['./delivery-history.component.css']
})
export class DeliveryHistoryComponent implements OnInit {
  deliveries: any[] = [];
  loading = false;
  error = '';
  stats = {
    total: 0,
    completed: 0,
    cancelled: 0,
    onTime: 0,
    delayed: 0
  };

  constructor(
    private deliveryService: DeliveryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDeliveryHistory();
  }

  loadDeliveryHistory(): void {
    this.loading = true;
    this.error = '';

    const deliveryPersonId = localStorage.getItem('deliveryPersonId');
    if (deliveryPersonId) {
      this.deliveryService.getDeliveriesByDeliveryPerson(deliveryPersonId).subscribe({
        next: (response) => {
          if (response.success) {
            // Filter for completed and cancelled deliveries
            this.deliveries = response.data.filter((delivery: any) => 
              delivery.status === 'Completed' || delivery.status === 'Cancelled'
            );
            this.updateStats();
          } else {
            this.error = response.message || 'Failed to load delivery history';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading delivery history:', err);
          this.error = 'Failed to load delivery history';
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
    this.stats.completed = this.deliveries.filter(delivery => delivery.status === 'Completed').length;
    this.stats.cancelled = this.deliveries.filter(delivery => delivery.status === 'Cancelled').length;
    
    // Calculate on-time vs delayed deliveries
    const completedDeliveries = this.deliveries.filter(delivery => delivery.status === 'Completed');
    this.stats.onTime = completedDeliveries.filter(delivery => {
      if (!delivery.actualDeliveryDate || !delivery.estimatedDeliveryDate) return false;
      const actual = new Date(delivery.actualDeliveryDate);
      const estimated = new Date(delivery.estimatedDeliveryDate);
      return actual <= estimated;
    }).length;
    this.stats.delayed = this.stats.completed - this.stats.onTime;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Completed': return 'bg-success';
      case 'Cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Completed': return 'bi-check-circle-fill';
      case 'Cancelled': return 'bi-x-circle';
      default: return 'bi-question-circle';
    }
  }

  isOnTime(delivery: any): boolean {
    if (!delivery.actualDeliveryDate || !delivery.estimatedDeliveryDate) return false;
    const actual = new Date(delivery.actualDeliveryDate);
    const estimated = new Date(delivery.estimatedDeliveryDate);
    return actual <= estimated;
  }

  getDeliveryPerformance(delivery: any): string {
    if (delivery.status !== 'Completed') return '';
    return this.isOnTime(delivery) ? 'On Time' : 'Delayed';
  }

  getPerformanceBadgeClass(delivery: any): string {
    if (delivery.status !== 'Completed') return '';
    return this.isOnTime(delivery) ? 'bg-success' : 'bg-warning';
  }
} 