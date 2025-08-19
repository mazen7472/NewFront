import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaintenanceService } from '../../Services/maintenance.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-customer-maintenance',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-maintenance.component.html',
  styleUrls: ['./customer-maintenance.component.css']
})
export class CustomerMaintenanceComponent implements OnInit {
  maintenanceRequests: any[] = [];
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
    private maintenanceService: MaintenanceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCustomerMaintenance();
  }

  loadCustomerMaintenance(): void {
    this.loading = true;
    this.error = '';

    const customerId = this.authService.customerId;
    if (customerId) {
      this.maintenanceService.getAllMaintenanceRequests().subscribe({
        next: (response) => {
          if (response.success) {
            // Filter requests for this customer
            this.maintenanceRequests = response.data.filter((req: any) => 
              req.customerId === customerId
            );
            this.updateStats();
          } else {
            this.error = response.message || 'Failed to load maintenance requests';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading maintenance requests:', err);
          this.error = 'Failed to load maintenance requests';
          this.loading = false;
        }
      });
    } else {
      this.error = 'User not authenticated';
      this.loading = false;
    }
  }

  private updateStats(): void {
    this.stats.total = this.maintenanceRequests.length;
    this.stats.pending = this.maintenanceRequests.filter(req => req.status === 'Pending').length;
    this.stats.inProgress = this.maintenanceRequests.filter(req => req.status === 'InProgress').length;
    this.stats.completed = this.maintenanceRequests.filter(req => req.status === 'Completed').length;
    this.stats.cancelled = this.maintenanceRequests.filter(req => req.status === 'Cancelled').length;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning';
      case 'Accepted': return 'bg-info';
      case 'InProgress': return 'bg-primary';
      case 'Completed': return 'bg-success';
      case 'Cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'Low': return 'bg-success';
      case 'Medium': return 'bg-warning';
      case 'High': return 'bg-danger';
      case 'Critical': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Pending': return 'bi-clock';
      case 'Accepted': return 'bi-check-circle';
      case 'InProgress': return 'bi-gear';
      case 'Completed': return 'bi-check-circle-fill';
      case 'Cancelled': return 'bi-x-circle';
      default: return 'bi-question-circle';
    }
  }
} 