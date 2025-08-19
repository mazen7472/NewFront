import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DelveryPersonService } from '../../Services/delvery-person.service';

@Component({
  selector: 'app-delivery-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-dashboard.component.html',
  styleUrls: ['./delivery-dashboard.component.css']
})
export class DeliveryDashboardComponent implements OnInit {
  loading = false;
  error: string | null = null;
  driverId: string | null = localStorage.getItem('deliveryPersonId')

  private delveyPersonService = inject(DelveryPersonService)

  stats = {
    totalDeliveries: 0,
    pendingDeliveries: 0,
    completedDeliveries: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  };

  deliveries: any[] = [];
  orders: any[] = [];

  ngOnInit(): void {
    this.loadDashboard();
    this.loadOffers();
  }

  loadDashboard() {
    this.loading = true;
    this.error = null;

    // Simulated load
    setTimeout(() => {
      this.stats = {
        totalDeliveries: 15,
        pendingDeliveries: 5,
        completedDeliveries: 10,
        totalOrders: 20,
        pendingOrders: 7,
        completedOrders: 13
      };

      this.deliveries = [
        {
          id: 1,
          trackingNumber: 'TRK12345',
          orderId: 101,
          deliveryAddress: '123 Main St',
          customerPhone: '555-1234',
          estimatedDeliveryDate: new Date(),
          actualDeliveryDate: null,
          status: 'Pending'
        }
      ];

      this.orders = [
        {
          id: 201,
          orderDate: new Date(),
          shippingAddress: '456 Elm St',
          totalAmount: 150,
          items: [{}, {}, {}],
          customerName: 'Jane Doe',
          status: 'Ready'
        }
      ];

      this.loading = false;
    }, 1000);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning text-dark';
      case 'InProgress': return 'bg-primary';
      case 'Delivered': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Pending': return 'bi-clock';
      case 'InProgress': return 'bi-truck';
      case 'Delivered': return 'bi-check-circle';
      default: return 'bi-question-circle';
    }
  }

  acceptDelivery(id: number) {
    console.log('Accepting delivery', id);
  }

  completeDelivery(id: number) {
    console.log('Completing delivery', id);
  }

  loadOffers(){
    this.delveyPersonService.getAllOffers(this.driverId).subscribe({
      next: (res) =>{
        console.log(res);
      },
      error: (err) =>{
        console.log(err);
        
      }
    })
  }
}
