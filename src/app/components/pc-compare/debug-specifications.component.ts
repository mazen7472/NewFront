import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../Services/product.service';
import { Environment } from '../../Environment/environment';

@Component({
  selector: 'app-debug-specifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h3>Debug Specifications Loading</h3>
      
      <div class="mb-3">
        <label for="productId" class="form-label">Product ID:</label>
        <input 
          type="text" 
          id="productId" 
          class="form-control" 
          [(ngModel)]="productId" 
          placeholder="Enter product ID (e.g., e0dc4df4-64a3-47e2-ba98-c2318e13fe12)"
        >
      </div>
      
      <button class="btn btn-primary" (click)="loadSpecifications()" [disabled]="loading">
        {{ loading ? 'Loading...' : 'Load Specifications' }}
      </button>
      
      <div class="mt-3" *ngIf="error">
        <div class="alert alert-danger">{{ error }}</div>
      </div>
      
      <div class="mt-3" *ngIf="specifications.length > 0">
        <h4>Loaded Specifications:</h4>
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let spec of specifications">
                <td>{{ spec.id }}</td>
                <td>{{ spec.key }}</td>
                <td>{{ spec.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="mt-3" *ngIf="!loading && !error && specifications.length === 0">
        <div class="alert alert-warning">No specifications found for this product.</div>
      </div>
      
      <div class="mt-4">
        <h4>API Information:</h4>
        <ul>
          <li><strong>Base URL:</strong> {{ Environment.baseUrl }}</li>
          <li><strong>Endpoint:</strong> {{ Environment.baseUrl }}/Product/{{ '{' }}productId{{ '}' }}/specifications</li>
        </ul>
      </div>
    </div>
  `
})
export class DebugSpecificationsComponent implements OnInit {
  productId: string = 'e0dc4df4-64a3-47e2-ba98-c2318e13fe12'; // RTX 3050 ID
  specifications: any[] = [];
  loading = false;
  error = '';
  Environment = Environment;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Auto-load specifications for RTX 3050 on component init
    this.loadSpecifications();
  }

  async loadSpecifications(): Promise<void> {
    if (!this.productId.trim()) {
      this.error = 'Please enter a product ID';
      return;
    }

    this.loading = true;
    this.error = '';
    this.specifications = [];

    console.log(`🔍 Attempting to load specifications for product ID: ${this.productId}`);
    console.log(`🌐 API URL: ${Environment.baseUrl}/Product/${this.productId}/specifications`);

    try {
      const response = await this.productService.getProductSpecifications(this.productId).toPromise();
      console.log(`📡 API Response:`, response);

      if (response && response.success) {
        this.specifications = response.data;
        console.log(`✅ Successfully loaded ${this.specifications.length} specifications:`, this.specifications);
      } else {
        this.error = response?.message || 'API returned success=false';
        console.error(`❌ API Error:`, this.error);
      }
    } catch (error) {
      this.error = `Failed to load specifications: ${error}`;
      console.error(`❌ Network Error:`, error);
    } finally {
      this.loading = false;
    }
  }
} 