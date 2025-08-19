import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUtilityService } from '../../Services/image-utility.service';
import { ImageUrlPipe } from '../../Pipes/image-url.pipe';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-image-url-demo',
  standalone: true,
  imports: [CommonModule, ImageUrlPipe],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h2 class="mb-4">Image URL System Demo</h2>
          
          <!-- Service Usage Examples -->
          <div class="card mb-4">
            <div class="card-header">
              <h5>Service Usage Examples</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4 mb-3">
                  <h6>Product Image</h6>
                  <img [src]="getProductImageUrl()" 
                       [alt]="'Product Image'" 
                       class="img-fluid rounded"
                       style="max-height: 200px;"
                       (error)="onImgError($event)">
                  <p class="mt-2 small text-muted">{{ getProductImageUrl() }}</p>
                </div>
                
                <div class="col-md-4 mb-3">
                  <h6>Category Image</h6>
                  <img [src]="getCategoryImageUrl()" 
                       [alt]="'Category Image'" 
                       class="img-fluid rounded"
                       style="max-height: 200px;"
                       (error)="onImgError($event)">
                  <p class="mt-2 small text-muted">{{ getCategoryImageUrl() }}</p>
                </div>
                
                <div class="col-md-4 mb-3">
                  <h6>Profile Image</h6>
                  <img [src]="profileImageUrl" 
                       [alt]="'Profile Image'" 
                       class="img-fluid rounded"
                       style="max-height: 200px;"
                       (error)="onImgError($event)">
                  <p class="mt-2 small text-muted">{{ profileImageUrl }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pipe Usage Examples -->
          <div class="card mb-4">
            <div class="card-header">
              <h5>Pipe Usage Examples</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4 mb-3">
                  <h6>Basic Pipe Usage</h6>
                  <img [src]="'product' | imageUrl" 
                       [alt]="'Product via Pipe'" 
                       class="img-fluid rounded"
                       style="max-height: 200px;"
                       (error)="onImgError($event)">
                  <p class="mt-2 small text-muted">{{ 'product' | imageUrl }}</p>
                </div>
                
                <div class="col-md-4 mb-3">
                  <h6>Pipe with Custom Photo</h6>
                  <img [src]="'category' | imageUrl:'custom-photo.jpg'" 
                       [alt]="'Category via Pipe'" 
                       class="img-fluid rounded"
                       style="max-height: 200px;"
                       (error)="onImgError($event)">
                  <p class="mt-2 small text-muted">{{ 'category' | imageUrl:'custom-photo.jpg' }}</p>
                </div>
                
                <div class="col-md-4 mb-3">
                  <h6>Pipe with Object</h6>
                  <img [src]="{ controllerName: 'brand', photoName: 'logo.png' } | imageUrl" 
                       [alt]="'Brand via Pipe'" 
                       class="img-fluid rounded"
                       style="max-height: 200px;"
                       (error)="onImgError($event)">
                  <p class="mt-2 small text-muted">{{ { controllerName: 'brand', photoName: 'logo.png' } | imageUrl }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- URL Validation Examples -->
          <div class="card mb-4">
            <div class="card-header">
              <h5>URL Validation Examples</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <h6>Valid URLs</h6>
                  <ul class="list-unstyled">
                    <li class="mb-2">
                      <code>https://localhost:7230/assets/product/photo</code>
                      <span class="badge bg-success ms-2">Valid</span>
                    </li>
                    <li class="mb-2">
                      <code>https://localhost:7230/assets/category/custom.jpg</code>
                      <span class="badge bg-success ms-2">Valid</span>
                    </li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <h6>Invalid URLs</h6>
                  <ul class="list-unstyled">
                    <li class="mb-2">
                      <code>https://picsum.photos/300/200</code>
                      <span class="badge bg-danger ms-2">Invalid</span>
                    </li>
                    <li class="mb-2">
                      <code>assets/Images/placeholder.png</code>
                      <span class="badge bg-danger ms-2">Invalid</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- URL Construction Examples -->
          <div class="card">
            <div class="card-header">
              <h5>URL Construction Examples</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Parameters</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>getProductImageUrl('123')</code></td>
                      <td>productId: '123'</td>
                      <td><code>{{ getProductImageUrl('123') }}</code></td>
                    </tr>
                    <tr>
                      <td><code>getCategoryImageUrl('456', 'custom.jpg')</code></td>
                      <td>categoryId: '456', photoName: 'custom.jpg'</td>
                      <td><code>{{ getCategoryImageUrl('456', 'custom.jpg') }}</code></td>
                    </tr>
                    <tr>
                      <td><code>getProfileImageUrl('789')</code></td>
                      <td>userId: '789'</td>
                      <td><code>{{ getProfileImageUrl('789') }}</code></td>
                    </tr>
                    <tr>
                      <td><code>getImageUrl('custom', 'image.png')</code></td>
                      <td>controllerName: 'custom', photoName: 'image.png'</td>
                      <td><code>{{ getImageUrl('custom', 'image.png') }}</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }
    
    code {
      background-color: #f8f9fa;
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-size: 0.875em;
    }
    
    .badge {
      font-size: 0.75em;
    }
  `]
})
export class ImageUrlDemoComponent implements OnInit, OnDestroy {
  private imageUtility = inject(ImageUtilityService);
  private subscriptions: Subscription[] = [];
  
  profileImageUrl: string = 'assets/Images/default-profile.jpg';

  ngOnInit(): void {
    // Load profile image from API
    this.loadProfileImage();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Service method examples
  getProductImageUrl(productId: string = 'demo-product'): string {
    return this.imageUtility.getProductImageUrl(productId);
  }

  getCategoryImageUrl(categoryId: string = 'demo-category', photoName: string = 'photo'): string {
    return this.imageUtility.getCategoryImageUrl(categoryId, photoName);
  }

  getProfileImageUrl(userId: string = 'demo-user'): string {
    return this.imageUtility.getProfileImageUrl(userId);
  }

  getImageUrl(controllerName: string, photoName: string): string {
    return this.imageUtility.getImageUrl(controllerName, photoName);
  }

  loadProfileImage(): void {
    const userId = 'demo-user';
    const photoName = 'photo';
    
    // Try to get profile image from API
    this.subscriptions.push(
      this.imageUtility.getProfileImageUrlFromAPI(userId, photoName).subscribe({
        next: (imageUrl) => {
          this.profileImageUrl = imageUrl;
        },
        error: (error) => {
          console.warn('Failed to load profile image from API, using static URL:', error);
          // Fallback to static URL
          this.profileImageUrl = this.imageUtility.getProfileImageUrl(userId, photoName);
        }
      })
    );
  }

  // Error handling
  onImgError(event: Event) {
    const fallbackUrl = this.imageUtility.getImageUrl('placeholder', 'default.jpg');
    (event.target as HTMLImageElement).src = fallbackUrl;
  }
} 