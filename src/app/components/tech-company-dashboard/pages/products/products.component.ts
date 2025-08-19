import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="text-center mb-3" style="color: var(--text-color);">
            <i class="bi bi-box-seam me-2"></i>
            Products
          </h1>
          <p class="text-center text-muted">Product management - Coming Soon</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 2rem;
      background-color: var(--bg-color);
      color: var(--text-color);
      min-height: 100vh;
    }
  `]
})
export class ProductsComponent {
  constructor() { }
}

