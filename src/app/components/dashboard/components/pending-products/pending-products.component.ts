import { Component, signal, OnInit } from '@angular/core';
import { AdminService } from '../../../../Services/admin.service';

@Component({
  selector: 'app-pending-products',
  standalone: true,
  imports: [],
  templateUrl: './pending-products.component.html',
  styleUrl: './pending-products.component.css'
})
export class PendingProductsComponent implements OnInit {
  loading = signal(false);
  error = signal<string | null>(null);
  products = signal<any[]>([]);
  totalItems = signal(0);

  constructor(private adminsService: AdminService) {}

  ngOnInit(): void {
    this.fetchPendingProducts();
  }

  fetchPendingProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.adminsService.getPendingProducts().subscribe({
      next: (res) => {
        this.products.set(res.data?.items ?? []);
        this.totalItems.set(res.data?.totalItems ?? 0);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load pending products.');
        this.loading.set(false);
      }
    });
  }

  approveProduct(productId: string): void {
    this.adminsService.approveProduct(productId).subscribe({
      next: () => this.fetchPendingProducts(),
      error: () => alert('Failed to approve product.')
    });
  }

  rejectProduct(productId: string): void {
    const reason = prompt('Enter a reason for rejection:');
    if (!reason) return;

    this.adminsService.rejectProduct(productId, reason).subscribe({
      next: () => this.fetchPendingProducts(),
      error: () => alert('Failed to reject product.')
    });
  }

  trackById = (_: number, product: any) => product.id;
}
