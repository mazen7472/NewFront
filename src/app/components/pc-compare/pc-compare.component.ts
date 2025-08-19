import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../Services/product.service';
import { CategoryService } from '../../Services/category.service';
import { trigger, style, transition, animate } from '@angular/animations';
import { IProduct } from '../../Interfaces/iproduct';
import { ICategory, ICategoryWithProducts, ICategoryProduct } from '../../Interfaces/icategory';
import { Environment } from '../../Environment/environment';


@Component({
  selector: 'app-pc-compare',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pc-compare.component.html',
  styleUrls: ['./pc-compare.component.css'],
  animations: [
    trigger('slideFadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})

export class PcCompareComponent implements OnInit {
  allProducts: IProduct[] = [];
  categories: ICategoryWithProducts[] = [];
  selectedCategory: string | null = null;

  filteredProducts1: IProduct[] = [];
  filteredProducts2: IProduct[] = [];

  selectedProduct1: IProduct | null = null;
  selectedProduct2: IProduct | null = null;

  comparisonResults: {
    key: string;
    value1: string;
    value2: string;
    better: string | null;
    comparison: string;
    difference: string;
    unit?: string;
  }[] = [];

  loading = false;
  error = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // Load categories with products using the proper Category API endpoint
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        if (res.success) {
          this.categories = res.data;
          console.log('📦 Categories with products loaded from API:', this.categories);
          
          // Extract all products from categories for the dropdown
          this.allProducts = [];
          this.categories.forEach(category => {
            if (category.products && category.products.length > 0) {
              category.products.forEach(catProduct => {
                const product: IProduct = {
                  id: catProduct.id,
                  name: catProduct.name,
                  price: catProduct.price,
                  discountPrice: catProduct.price, // Assuming no discount for now
                  imageUrl: catProduct.imageUrl || '',
                  imageUrls: catProduct.imageUrls || [],
                  category: category.name, // Use category name as the category field
                  categoryName: category.name, // Also set categoryName for compatibility
                  subCategoryId: '',
                  subCategoryName: '',
                  techCompanyId: catProduct.techCompanyId || '',
                  techCompanyName: catProduct.techCompanyName || '',
                  status: 'Approved', // Default status
                  specifications: [] // Will be loaded when product is selected
                };
                this.allProducts.push(product);
              });
            }
          });
          
          console.log('📋 Products loaded for dropdown (without specifications):', this.allProducts);
          console.log('📊 Total products loaded:', this.allProducts.length);
          console.log('🏷️ Available categories:', this.categories.map(c => c.name));
        }
      },
      error: (err) => {
        console.error('Category API error:', err);
        this.categories = [];
        this.allProducts = [];
      }
    });
  }

  onCategoryChange(): void {
    if (!this.selectedCategory) return;

    console.log('Selected category:', this.selectedCategory);
    console.log('All products:', this.allProducts);
    console.log('Product categories:', this.allProducts.map(p => p.category));
    console.log('Product category names:', this.allProducts.map(p => p.categoryName));
    
    // More flexible filtering - handle case sensitivity and exact matching
    const filtered = this.allProducts.filter(p => {
      // Check both category and categoryName fields
      const productCategory = p.category || p.categoryName;
      if (!productCategory) return false;
      
      console.log(`Comparing: "${productCategory}" with "${this.selectedCategory}"`);
      
      // Exact match
      if (productCategory === this.selectedCategory) {
        console.log(`✅ Exact match found for: ${p.name}`);
        return true;
      }
      
      // Case-insensitive match
      if (productCategory?.toLowerCase() === this.selectedCategory?.toLowerCase()) {
        console.log(`✅ Case-insensitive match found for: ${p.name}`);
        return true;
      }
      
      // Handle variations like "GraphicsCard" vs "Graphics Cards"
      const normalizedProduct = productCategory?.replace(/\s+/g, '').toLowerCase() || '';
      const normalizedSelected = this.selectedCategory?.replace(/\s+/g, '').toLowerCase() || '';
      if (normalizedProduct === normalizedSelected) {
        console.log(`✅ Normalized match found for: ${p.name}`);
        return true;
      }
      
      console.log(`❌ No match for: ${p.name} (${productCategory})`);
      return false;
    });

    console.log('Filtered products:', filtered);
    console.log('Filtered product names:', filtered.map(p => p.name));

    this.filteredProducts1 = filtered;
    this.filteredProducts2 = filtered;

    this.selectedProduct1 = null;
    this.selectedProduct2 = null;
    this.comparisonResults = [];
  }

  onProductSelect(column: 1 | 2, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const productId = selectElement.value;

    if (!productId) {
      if (column === 1) this.selectedProduct1 = null;
      else this.selectedProduct2 = null;
      this.comparisonResults = [];
      return;
    }

    console.log(`Selecting product with ID: ${productId}`);
    
    // Set loading state
    this.loading = true;
    this.error = '';
    
    // Load the full product with specifications from the Product API
    this.productService.getProductById(productId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const product = response.data;
          console.log(`Product loaded with specifications:`, product);
          console.log(`Product specifications:`, product.specifications);
          
          if (column === 1) {
            this.selectedProduct1 = product;
            console.log('Product 1 selected:', product.name);
          } else {
            this.selectedProduct2 = product;
            console.log('Product 2 selected:', product.name);
          }

          if (this.selectedProduct1 && this.selectedProduct2) {
            console.log('Both products selected, comparing specifications...');
            this.compareSpecs();
          }
        } else {
          console.error('Failed to load product:', response.message);
          this.error = 'Failed to load product. Please try again.';
        }
        
        // Clear loading state
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = 'Error loading product. Please try again.';
        this.loading = false;
      }
    });
  }

  async loadProductSpecifications(product: IProduct): Promise<IProduct> {
    console.log(`Attempting to load specifications for product: ${product.name} (ID: ${product.id})`);
    console.log(`API URL: ${Environment.baseUrl}/Product/${product.id}/specifications`);
    
    try {
      const response = await this.productService.getProductSpecifications(product.id).toPromise();
      console.log(`API Response for ${product.name}:`, response);
      
      if (response && response.success) {
        console.log(`✅ Successfully loaded specifications for ${product.name}:`, response.data);
        return {
          ...product,
          specifications: response.data
        };
      } else {
        console.warn(`❌ API returned success=false for ${product.name}:`, response?.message);
        // Return product with empty specifications if API fails
        return {
          ...product,
          specifications: []
        };
      }
    } catch (error) {
      console.error(`❌ Error loading product specifications for ${product.name}:`, error);
      
      // Return product with empty specifications if API call fails
      return {
        ...product,
        specifications: []
      };
    }
  }

  compareSpecs(): void {
    if (!this.selectedProduct1 || !this.selectedProduct2) {
      this.comparisonResults = [];
      return;
    }

    console.log('🔍 Comparing specifications between:');
    console.log('Product 1:', this.selectedProduct1.name, this.selectedProduct1.specifications);
    console.log('Product 2:', this.selectedProduct2.name, this.selectedProduct2.specifications);

    const specs1 = this.selectedProduct1.specifications || [];
    const specs2 = this.selectedProduct2.specifications || [];

    console.log('📊 Specs1 count:', specs1.length);
    console.log('📊 Specs2 count:', specs2.length);
    console.log('🔑 Specs1 keys:', specs1.map(s => s.key));
    console.log('🔑 Specs2 keys:', specs2.map(s => s.key));

    if (specs1.length === 0 && specs2.length === 0) {
      console.warn('⚠️ No specifications found in either product!');
      this.comparisonResults = [];
      return;
    }

    // Create a comprehensive comparison by combining all unique specifications
    const allSpecKeys = new Set([
      ...specs1.map(s => s.key),
      ...specs2.map(s => s.key)
    ]);

    console.log('🎯 All unique spec keys:', Array.from(allSpecKeys));

    this.comparisonResults = Array.from(allSpecKeys).map(specKey => {
      const spec1 = specs1.find(s => s.key === specKey);
      const spec2 = specs2.find(s => s.key === specKey);
      
      if (!spec1 && !spec2) {
        return {
          key: specKey,
          value1: 'N/A',
          value2: 'N/A',
          better: null,
          comparison: 'No data available',
          difference: 'N/A'
        };
      }

      if (!spec1) {
        return {
          key: specKey,
          value1: 'N/A',
          value2: spec2!.value.toString(),
          better: null,
          comparison: `${this.selectedProduct2!.name} only`,
          difference: 'N/A'
        };
      }

      if (!spec2) {
        return {
          key: specKey,
          value1: spec1.value.toString(),
          value2: 'N/A',
          better: null,
          comparison: `${this.selectedProduct1!.name} only`,
          difference: 'N/A'
        };
      }

      const comparison = this.compareSpecificationValues(spec1.key, spec1.value, spec2.value);
      
      return {
        key: spec1.key,
        value1: spec1.value.toString(),
        value2: spec2.value.toString(),
        better: comparison.better,
        comparison: comparison.comparison,
        difference: comparison.difference,
        unit: comparison.unit
      };
    });

    console.log('Final comparison results:', this.comparisonResults);
  }

  private compareSpecificationValues(specKey: string, value1: string, value2: string): {
    better: string | null;
    comparison: string;
    difference: string;
    unit?: string;
  } {
    // Clean and normalize the specification key for better matching
    const normalizedKey = specKey.toLowerCase().trim();
    
    // Extract numeric values, handling different formats
    const num1 = this.extractNumericValue(value1);
    const num2 = this.extractNumericValue(value2);
    
    // If both values are not numbers, do text comparison
    if (num1 === null || num2 === null) {
      if (value1.toLowerCase() === value2.toLowerCase()) {
        return {
          better: null,
          comparison: 'Equal',
          difference: 'Same value'
        };
      } else {
        return {
          better: null,
          comparison: 'Different',
          difference: `${value1} vs ${value2}`
        };
      }
    }

    // Define specification types and their comparison logic
    const specTypes = this.getSpecificationTypes();
    const specType = this.findSpecificationType(normalizedKey, specTypes);
    
    let better: string | null = null;
    let comparison = '';
    let difference = '';
    let unit = this.extractUnit(value1) || this.extractUnit(value2) || '';

    switch (specType) {
      case 'higher_better':
        if (num1 > num2) {
          better = this.selectedProduct1!.name;
          comparison = `${this.selectedProduct1!.name} is better`;
          difference = `+${(num1 - num2).toFixed(2)}`;
        } else if (num1 < num2) {
          better = this.selectedProduct2!.name;
          comparison = `${this.selectedProduct2!.name} is better`;
          difference = `+${(num2 - num1).toFixed(2)}`;
        } else {
          comparison = 'Equal performance';
          difference = '0';
        }
        break;

      case 'lower_better':
        if (num1 < num2) {
          better = this.selectedProduct1!.name;
          comparison = `${this.selectedProduct1!.name} is better`;
          difference = `-${(num2 - num1).toFixed(2)}`;
        } else if (num1 > num2) {
          better = this.selectedProduct2!.name;
          comparison = `${this.selectedProduct2!.name} is better`;
          difference = `-${(num1 - num2).toFixed(2)}`;
        } else {
          comparison = 'Equal performance';
          difference = '0';
        }
        break;

      case 'memory':
        if (num1 > num2) {
          better = this.selectedProduct1!.name;
          comparison = `${this.selectedProduct1!.name} has more memory`;
          difference = `+${(num1 - num2).toFixed(0)}`;
        } else if (num1 < num2) {
          better = this.selectedProduct2!.name;
          comparison = `${this.selectedProduct2!.name} has more memory`;
          difference = `+${(num2 - num1).toFixed(0)}`;
        } else {
          comparison = 'Equal memory';
          difference = '0';
        }
        break;

      case 'speed':
        if (num1 > num2) {
          better = this.selectedProduct1!.name;
          comparison = `${this.selectedProduct1!.name} has higher speed`;
          difference = `+${(num1 - num2).toFixed(0)}`;
        } else if (num1 < num2) {
          better = this.selectedProduct2!.name;
          comparison = `${this.selectedProduct2!.name} has higher speed`;
          difference = `+${(num2 - num1).toFixed(0)}`;
        } else {
          comparison = 'Equal speed';
          difference = '0';
        }
        break;

      case 'clock_speed':
        if (num1 > num2) {
          better = this.selectedProduct1!.name;
          comparison = `${this.selectedProduct1!.name} has higher clock speed`;
          difference = `+${(num1 - num2).toFixed(0)}`;
        } else if (num1 < num2) {
          better = this.selectedProduct2!.name;
          comparison = `${this.selectedProduct2!.name} has higher clock speed`;
          difference = `+${(num2 - num1).toFixed(0)}`;
        } else {
          comparison = 'Equal clock speed';
          difference = '0';
        }
        break;

      case 'power_consumption':
        if (num1 < num2) {
          better = this.selectedProduct1!.name;
          comparison = `${this.selectedProduct1!.name} is more power efficient`;
          difference = `-${(num2 - num1).toFixed(0)}`;
        } else if (num1 > num2) {
          better = this.selectedProduct2!.name;
          comparison = `${this.selectedProduct2!.name} is more power efficient`;
          difference = `-${(num1 - num2).toFixed(0)}`;
        } else {
          comparison = 'Equal power consumption';
          difference = '0';
        }
        break;

      case 'price':
        if (num1 < num2) {
          better = this.selectedProduct1!.name;
          comparison = `${this.selectedProduct1!.name} is cheaper`;
          difference = `-$${(num2 - num1).toFixed(2)}`;
          unit = '$';
        } else if (num1 > num2) {
          better = this.selectedProduct2!.name;
          comparison = `${this.selectedProduct2!.name} is cheaper`;
          difference = `-$${(num1 - num2).toFixed(2)}`;
          unit = '$';
        } else {
          comparison = 'Equal price';
          difference = '$0';
          unit = '$';
        }
        break;

      default:
        if (num1 > num2) {
          better = this.selectedProduct1!.name;
          comparison = `${this.selectedProduct1!.name} has higher value`;
          difference = `+${(num1 - num2).toFixed(2)}`;
        } else if (num1 < num2) {
          better = this.selectedProduct2!.name;
          comparison = `${this.selectedProduct2!.name} has higher value`;
          difference = `+${(num2 - num1).toFixed(2)}`;
        } else {
          comparison = 'Equal values';
          difference = '0';
        }
    }

    return { better, comparison, difference, unit };
  }

  private extractNumericValue(value: string): number | null {
    // Remove common units and extract numeric value
    const cleanValue = value.replace(/[^\d.-]/g, '');
    const num = parseFloat(cleanValue);
    return isNaN(num) ? null : num;
  }

  private extractUnit(value: string): string {
    // Extract unit from value string
    const unitMatch = value.match(/[a-zA-Z%]+/g);
    return unitMatch ? unitMatch.join('') : '';
  }

  private findSpecificationType(key: string, specTypes: { [key: string]: string }): string {
    // Try exact match first
    if (specTypes[key]) {
      return specTypes[key];
    }
    
    // Try partial matches
    for (const [specKey, specType] of Object.entries(specTypes)) {
      if (key.includes(specKey) || specKey.includes(key)) {
        return specType;
      }
    }
    
    // Default to numeric comparison
    return 'numeric';
  }

  private getSpecificationTypes(): { [key: string]: string } {
    return {
      // Higher is better
      'memory': 'memory',
      'ram': 'memory',
      'storage': 'memory',
      'capacity': 'memory',
      'cores': 'higher_better',
      'cuda cores': 'higher_better',
      'stream processors': 'higher_better',
      'core clock': 'clock_speed',
      'boost clock': 'clock_speed',
      'base clock': 'clock_speed',
      'frequency': 'clock_speed',
      'speed': 'speed',
      'speed mhz': 'speed',
      'bandwidth': 'higher_better',
      'memory bandwidth': 'higher_better',
      'cache': 'memory',
      'l3 cache': 'memory',
      'l2 cache': 'memory',
      'threads': 'higher_better',
      'performance': 'higher_better',
      'score': 'higher_better',
      'rating': 'higher_better',
      
      // Lower is better
      'power consumption': 'power_consumption',
      'tdp': 'power_consumption',
      'wattage': 'power_consumption',
      'latency': 'lower_better',
      'response time': 'lower_better',
      'delay': 'lower_better',
      'wait time': 'lower_better',
      
      // Price comparison
      'price': 'price',
      'cost': 'price',
      
      // Text-based specs
      'type': 'text',
      'status': 'text',
      'manufacturer': 'text',
      'brand': 'text',
      'model': 'text',
      'interface': 'text',
      'form factor': 'text',
      'color': 'text',
      'material': 'text'
    };
  }

  getPerformanceSummary(): { betterCount: number; equalCount: number; totalCount: number } | null {
    if (!this.comparisonResults.length) return null;

    const betterCount = this.comparisonResults.filter(result => result.better !== null).length;
    const equalCount = this.comparisonResults.filter(result => 
      result.comparison.includes('Equal') || result.comparison === 'Equal'
    ).length;
    const totalCount = this.comparisonResults.length;

    return {
      betterCount,
      equalCount,
      totalCount
    };
  }

  getRecommendation(): string {
    if (!this.comparisonResults.length || !this.selectedProduct1 || !this.selectedProduct2) {
      return 'Select two products to compare for recommendations.';
    }

    const summary = this.getPerformanceSummary();
    if (!summary) return 'Unable to generate recommendation.';

    const product1Better = this.comparisonResults.filter(result => 
      result.better === this.selectedProduct1!.name
    ).length;
    const product2Better = this.comparisonResults.filter(result => 
      result.better === this.selectedProduct2!.name
    ).length;

    if (product1Better > product2Better) {
      const percentage = Math.round((product1Better / summary.betterCount) * 100);
      return `${this.selectedProduct1!.name} appears to be the better choice, winning ${product1Better} out of ${summary.betterCount} specifications (${percentage}% better specs).`;
    } else if (product2Better > product1Better) {
      const percentage = Math.round((product2Better / summary.betterCount) * 100);
      return `${this.selectedProduct2!.name} appears to be the better choice, winning ${product2Better} out of ${summary.betterCount} specifications (${percentage}% better specs).`;
    } else {
      return 'Both products are very similar in performance. Consider factors like price, brand preference, or specific features that matter most to you.';
    }
  }

  resetComparison(): void {
    this.selectedCategory = null;
    this.filteredProducts1 = [];
    this.filteredProducts2 = [];
    this.selectedProduct1 = null;
    this.selectedProduct2 = null;
    this.comparisonResults = [];
  }

  // Helper method to get product specifications from API
  getProductSpecifications(productName: string, categoryName: string): any[] {
    // Return default specifications - these will be replaced by API data
    // The actual specifications should come from the product data loaded from API
    return [
      { id: '1', key: 'Type', value: categoryName },
      { id: '2', key: 'Price', value: 'Varies' },
      { id: '3', key: 'Status', value: 'Available' }
    ];
  }

  // Debug method to show category information
  debugCategories(): void {
    console.log('=== CATEGORY DEBUG INFO ===');
    console.log('Selected category:', this.selectedCategory);
    console.log('Available categories:', this.categories.map(c => ({ id: c.id, name: c.name, productCount: c.products?.length || 0 })));
    console.log('All products:', this.allProducts.length);
    
    this.categories.forEach((category, index) => {
      console.log(`Category ${index + 1}: ${category.name} (${category.products?.length || 0} products)`);
      if (category.products) {
        category.products.forEach((product, pIndex) => {
          console.log(`  Product ${pIndex + 1}: ${product.name} (ID: ${product.id})`);
        });
      }
    });
    
    console.log('=== EXTRACTED PRODUCTS ===');
    this.allProducts.forEach((product, index) => {
      console.log(`Product ${index + 1}: ${product.name}`);
      console.log(`  - category field: "${product.category}"`);
      console.log(`  - categoryName field: "${product.categoryName}"`);
    });
  }

  // Test method to manually trigger comparison (for debugging)
  testComparison(): void {
    console.log('🧪 Testing comparison with specific product IDs...');
    
    // Use the exact product IDs from your curl examples
    const rtx3050Id = 'e0dc4df4-64a3-47e2-ba98-c2318e13fe12';
    const rtx4090Id = 'ce0702b5-fe57-4e8d-9eac-d50758ac19fe';
    
    console.log('Loading RTX 3050...');
    this.productService.getProductById(rtx3050Id).subscribe({
      next: (response1) => {
        if (response1.success && response1.data) {
          this.selectedProduct1 = response1.data;
          console.log('✅ RTX 3050 loaded:', this.selectedProduct1);
          
          console.log('Loading RTX 4090...');
          this.productService.getProductById(rtx4090Id).subscribe({
            next: (response2) => {
              if (response2.success && response2.data) {
                this.selectedProduct2 = response2.data;
                console.log('✅ RTX 4090 loaded:', this.selectedProduct2);
                
                console.log('🔄 Starting comparison...');
                this.compareSpecs();
              } else {
                console.error('❌ Failed to load RTX 4090:', response2.message);
              }
            },
            error: (error) => {
              console.error('❌ Error loading RTX 4090:', error);
            }
          });
        } else {
          console.error('❌ Failed to load RTX 3050:', response1.message);
        }
      },
      error: (error) => {
        console.error('❌ Error loading RTX 3050:', error);
      }
    });
  }
}
