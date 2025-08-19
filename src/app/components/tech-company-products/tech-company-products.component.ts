import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-tech-company-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tech-company-products.component.html',
  styleUrls: ['./tech-company-products.component.css']
})
export class TechCompanyProductsComponent implements OnInit {
  products: any[] = [];
  loading = false;
  error = '';
  stats = {
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  };

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTechCompanyProducts();
  }

  loadTechCompanyProducts(): void {
    this.loading = true;
    this.error = '';

    const techCompanyId = localStorage.getItem('techCompanyId');
    if (techCompanyId) {
      this.productService.getAllProducts(1, 100, 'name', false).subscribe({
        next: (response) => {
          if (response.success) {
            // Filter products for this tech company
            this.products = response.data.items.filter((product: any) => 
              product.techCompanyId === techCompanyId
            );
            this.updateStats();
          } else {
            this.error = response.message || 'Failed to load products';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading products:', err);
          this.error = 'Failed to load products';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Tech company ID not found';
      this.loading = false;
    }
  }

  private updateStats(): void {
    this.stats.total = this.products.length;
    this.stats.approved = this.products.filter(product => product.status === 'Approved').length;
    this.stats.pending = this.products.filter(product => product.status === 'Pending').length;
    this.stats.rejected = this.products.filter(product => product.status === 'Rejected').length;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Approved': return 'bg-success';
      case 'Pending': return 'bg-warning';
      case 'Rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Processors': return 'bi-cpu';
      case 'Motherboard': return 'bi-motherboard';
      case 'RAM': return 'bi-memory';
      case 'Storage': return 'bi-hdd';
      case 'Graphics Card': return 'bi-gpu';
      case 'Power Supply': return 'bi-lightning';
      case 'Case': return 'bi-box';
      case 'Cooler': return 'bi-fan';
      default: return 'bi-box';
    }
  }
} 