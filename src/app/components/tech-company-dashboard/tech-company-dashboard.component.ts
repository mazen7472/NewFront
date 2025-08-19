import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

interface DashboardStats {
  totalCustomers: number;
  pendingProducts: number;
  totalOrders: number;
  revenue: number;
}

@Component({
  selector: 'app-tech-company-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, DatePipe ],
  templateUrl: './tech-company-dashboard.component.html',
  styleUrls: ['./tech-company-dashboard.component.css']
})
export class TechCompanyDashboardComponent {
  isDarkMode = false;
  currentDate = new Date();

  stats: DashboardStats = {
    totalCustomers: 1250,
    pendingProducts: 23,
    totalOrders: 847,
    revenue: 125000
  };

  ngOnInit(): void {
    this.isDarkMode = document.body.classList.contains('dark-mode');
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }
}
