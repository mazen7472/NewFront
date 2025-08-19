import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../../../Interfaces/iproduct';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../Services/category.service';
import { Environment } from '../../../Environment/environment';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css'
})
export class CategoryDetailsComponent implements OnInit {
  categoryName = '';
  products: IProduct[] = [];
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    console.log(`🏷️ Category Details Component - Category ID: ${id}`);
    this.loadProductsByCategory(id);
  }

  loadProductsByCategory(categoryId: string): void {
    console.log(`🔄 Loading products for category ID: ${categoryId}`);
    this.loading = true;
    this.error = '';

    this.categoryService.getCategoryById(categoryId).subscribe({
      next: (response) => {
        console.log(`📦 Category API Response:`, response);
        if (response.success && response.data) {
          this.categoryName = response.data.name;
          this.products = response.data.products?.map(catProduct => ({
            id: catProduct.id,
            name: catProduct.name,
            price: catProduct.price,
            discountPrice: catProduct.price, // Assuming no discount for now
            imageUrl: catProduct.imageUrl || '',
            imageUrls: catProduct.imageUrls || [],
            category: response.data.name,
            categoryName: response.data.name,
            subCategoryId: '',
            subCategoryName: '',
            techCompanyId: catProduct.techCompanyId || '',
            techCompanyName: catProduct.techCompanyName || '',
            status: 'Approved', // Default status
            specifications: catProduct.specifications || []
          })) || [];
          console.log(`✅ Loaded ${this.products.length} products for category: ${response.data.name}`);
          console.log(`📋 Products:`, this.products);
        } else {
          this.error = response.message || 'Failed to load products';
          console.error('❌ Category API error:', response.message);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error loading category products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      }
    });
  }

  viewDetails(id : string){
    this.router.navigate(['/product-details', id]);
  }

  getProductImageUrl(product: IProduct): string {
  if (product.imageUrl) {
    const backendBase = Environment.baseImageUrl.replace(/\/+$/, '');
    return product.imageUrl.startsWith('http')
      ? product.imageUrl
      : `${backendBase}/${product.imageUrl.replace(/^\/+/, '')}`;
  }
  // Fallback local image
  return '/assets/Images/default-product.jpg';
}

// Handle broken images
onImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = '/assets/Images/default-product.jpg';
}
}
