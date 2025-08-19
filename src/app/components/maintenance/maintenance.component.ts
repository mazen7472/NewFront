import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaintenanceService } from '../../Services/maintenance.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {
  maintenanceRequests: any[] = [];
  loading = false;
  error = '';
  stats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  };

  constructor(
    private maintenanceService: MaintenanceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMaintenanceRequests();
  }

  loadMaintenanceRequests(): void {
    this.loading = true;
    this.error = '';

    const techCompanyId = localStorage.getItem('techCompanyId');
    if (techCompanyId) {
      this.maintenanceService.getMaintenanceByTechCompany(techCompanyId).subscribe({
        next: (response) => {
          if (response.success) {
            this.maintenanceRequests = response.data;
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
      this.error = 'Tech company ID not found';
      this.loading = false;
    }
  }

  private updateStats(): void {
    this.stats.total = this.maintenanceRequests.length;
    this.stats.pending = this.maintenanceRequests.filter(req => req.status === 'Pending').length;
    this.stats.inProgress = this.maintenanceRequests.filter(req => req.status === 'InProgress').length;
    this.stats.completed = this.maintenanceRequests.filter(req => req.status === 'Completed').length;
  }

  acceptRequest(requestId: string): void {
    this.maintenanceService.acceptMaintenanceRequest(requestId).subscribe({
      next: () => {
        this.loadMaintenanceRequests();
      },
      error: (err) => {
        console.error('Error accepting request:', err);
        this.error = 'Failed to accept request';
      }
    });
  }

  completeRequest(requestId: string): void {
    this.maintenanceService.completeMaintenanceRequest(requestId).subscribe({
      next: () => {
        this.loadMaintenanceRequests();
      },
      error: (err) => {
        console.error('Error completing request:', err);
        this.error = 'Failed to complete request';
      }
    });
  }

  updateStatus(requestId: string, status: string): void {
    this.maintenanceService.updateMaintenanceStatus(requestId, status).subscribe({
      next: () => {
        this.loadMaintenanceRequests();
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.error = 'Failed to update status';
      }
    });
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
} 