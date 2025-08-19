import { Component } from '@angular/core';
import { IProduct, ProductCategory } from '../../../../../Interfaces/iproduct';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../../Services/category.service';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { PCAssemblyService } from '../../../../../Services/pcassembly.service';
import { AddComponentToBuildDTO } from '../../../../../Interfaces/ipc-assembly';

@Component({
  selector: 'app-selector-category-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selector-category-details.component.html',
  styleUrl: './selector-category-details.component.css'
})
export class SelectorCategoryDetailsComponent {
  categoryName = '';
  products: any[] = [];
  loading = false;
  error = '';
  adding = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private categoryService: CategoryService,
    private pcAssemblyService: PCAssemblyService // <-- Injected
  ) {}

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name') ?? '';
    console.log(`🏷️ Category Details Component - Category Name: ${name}`);
    const buildId = typeof window !== 'undefined' ? localStorage.getItem('pcAssemblyId') : null;
    if (buildId) {
      this.loadProductsByCategory(buildId, name);
    }

  }

  loadProductsByCategory(buildId: string, categoryName: string): void {
  console.log(`🔄 Loading products for category: ${categoryName}`);
  this.loading = true;
  this.error = '';

  this.pcAssemblyService.getCompatibleComponents(buildId, categoryName).subscribe({
    next: (response) => {
      console.log(`📦 Category API Response:`, response);
      if (response.success && response.data) {
        this.categoryName = categoryName; // set it directly
        this.products = response.data.map(product => ({
          ...product,
          discountPrice: product.discountPrice ?? product.price,
          title: product.name,
          link: `https://example.com/products/${product.id}`
        }));
      } else {
        this.error = response.message || 'Failed to load products';
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


  selectProduct(product: any): void {
    const pcAssemblyId = localStorage.getItem('pcAssemblyId');
    console.log(product);
    
    if (!pcAssemblyId) {
      this.error = 'No PC build found. Please start a new build.';
      return;
    }

    this.adding = true;

    const dto: AddComponentToBuildDTO = {
  productId: product.productId,
  category: product.category
};
    console.log(`🛠️ Adding product to build:`, dto);

    this.pcAssemblyService.addComponentToBuild(pcAssemblyId, dto).subscribe({
      next: (response) => {
        console.log(`✅ Add Component Response:`, response);
        
        this.adding = false;
        if (response.success) {
          const enriched = {
            ...product,
            title: product.name,
            link: `https://example.com/products/${product.id}`,
            category: this.categoryName
          };
          this.router.navigate(['/selector'], { state: { selectedProduct: enriched } });
        } else {
          this.error = response.message || 'Failed to add product to build.';
        }
      },
      error: (err) => {
        console.error('❌ Error adding product to build:', err);
        this.error = 'Something went wrong. Please try again.';
        this.adding = false;
      }
    });
  }
  trackByProductId(index: number, product: IProduct): string {
  return product.id;
}

}
