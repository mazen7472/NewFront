import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  loading = true;
  error: string | null = null;
  currentDate: Date = new Date();

  techCompanyData: any = null;

  stats = {
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    activeProducts: 0
  };

  maintenanceRequests: any[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    // Simulate async data fetch (replace with actual HTTP call)
    setTimeout(() => {
      try {
        // Dummy data
        this.techCompanyData = {
          name: 'Tech Solutions Co.',
          description: 'Expert maintenance and product solutions',
          location: 'Cairo, Egypt',
          phone: '+20 123 456 789'
        };

        this.stats = {
          totalRequests: 42,
          pendingRequests: 8,
          completedRequests: 30,
          activeProducts: 16
        };

        this.maintenanceRequests = [
          { id: 1, customerName: 'Ahmed Ali', serviceType: 'Repair', status: 'Pending', priority: 'High' },
          { id: 2, customerName: 'Sara Nabil', serviceType: 'Installation', status: 'InProgress', priority: 'Medium' },
          { id: 3, customerName: 'Mohamed Youssef', serviceType: 'Inspection', status: 'Completed', priority: 'Low' },
          { id: 4, customerName: 'Nora Adel', serviceType: 'Maintenance', status: 'Pending', priority: 'Medium' },
          { id: 5, customerName: 'Khaled Samir', serviceType: 'Repair', status: 'InProgress', priority: 'High' }
        ];

        this.loading = false;
      } catch (e) {
        this.error = 'Failed to load dashboard data.';
        this.loading = false;
      }
    }, 1000);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'InProgress':
        return 'info';
      case 'Completed':
        return 'success';
      default:
        return 'secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bi-exclamation-triangle';
      case 'InProgress':
        return 'bi-clock';
      case 'Completed':
        return 'bi-check-circle';
      default:
        return 'bi-question-circle';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'High':
        return 'high';
      case 'Medium':
        return 'medium';
      case 'Low':
        return 'low';
      default:
        return 'secondary';
    }
  }

  acceptMaintenanceRequest(id: number): void {
    console.log('Accepted request ID:', id);
    // TODO: Call backend API to mark as accepted
  }

  completeMaintenanceRequest(id: number): void {
    console.log('Completed request ID:', id);
    // TODO: Call backend API to mark as completed
  }
}
