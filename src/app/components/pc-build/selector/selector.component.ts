import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { IProduct } from '../../../Interfaces/iproduct';
import { PCAssemblyService } from '../../../Services/pcassembly.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../Services/cart.service';

@Component({
  selector: 'app-selector',
  standalone: true,
  imports: [NgClass, NgIf, DecimalPipe ],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.css'
})
export class SelectorComponent implements OnInit {
  components: {
    name: string;
    id: string;
    selected: boolean;
    selectedProduct: any;
  }[] = [
    { name: 'Processor', id: 'Processor', selected: false, selectedProduct: null },
    { name: 'Motherboard', id: 'Motherboard', selected: false, selectedProduct: null },
    { name: 'CPUCooler', id: 'CPUCooler', selected: false, selectedProduct: null },
    { name: 'Case', id: 'Case', selected: false, selectedProduct: null },
    { name: 'GraphicsCard', id: 'GraphicsCard', selected: false, selectedProduct: null },
    { name: 'RAM', id: 'RAM', selected: false, selectedProduct: null },
    { name: 'Storage', id: 'Storage', selected: false, selectedProduct: null },
    { name: 'CaseCooler', id: 'CaseCooler', selected: false, selectedProduct: null },
    { name: 'PowerSupply', id: 'PowerSupply', selected: false, selectedProduct: null },
    { name: 'Monitor', id: 'Monitor', selected: false, selectedProduct: null },
    { name: 'Accessories', id: 'Accessories', selected: false, selectedProduct: null }
  ];

  build!: any;

  constructor(
    private router: Router,
    private pcAssemblyService: PCAssemblyService,
    private toastr: ToastrService,
    private cartService: CartService
    
  ) {}

  ngOnInit(): void {
    const buildId = typeof window !== 'undefined' ? localStorage.getItem('pcAssemblyId') : null;
    if (buildId) {
      this.loadBuild(buildId);
    }

    const nav = this.router.getCurrentNavigation();
    const product = nav?.extras.state?.['selectedProduct'];
    if (product && product.category) {
      this.setSelectedProduct(product.category, product);
    }

    // Fix invalid states after initialization
    this.components.forEach(c => {
      if (c.selected && !c.selectedProduct) {
        c.selected = false;
      }
    });
  }

  loadBuild(buildId: string): void {
  this.pcAssemblyService.getPcAssemblyDetails(buildId).subscribe({
    next: (response) => {
      this.build = response.data;
      const items = response.data?.components;
      if (Array.isArray(items)) {
        items.forEach(item => {
          if (item.productId) {  // ✅ Only set if real data exists
            const product: any = {
              id: item.productId,
              name: item.productName,
              imageUrl: (item as any).productImageUrl ?? '',
              category: item.componentType,
              categoryName: item.componentType,
              subCategoryId: '',
              subCategoryName: item.subCategoryName,
              price: item.price,
              discountPrice: item.discount && item.discount > 0 ? (item.price - item.discount) : item.price,
              status: item.status,
              itemId: item.itemId
            };
            this.setSelectedProduct(product.category ?? '', product);
          }
        });
      }

      // ✅ Make sure nothing is stuck as selected if it's actually empty
      this.components.forEach(c => {
        if (!c.selectedProduct) {
          c.selected = false;
        }
      });
    },
    error: err => {
      console.error('Error loading build:', err);
    }
  });
}


  navigateToCategory(componentId: string) {
    this.router.navigate(['/selector-category-details', componentId]);
  }

  chooseAnother(name: string) {
    const item = this.components.find(c => c.name === name);
    if (item) {
      item.selected = false;
      item.selectedProduct = null;
    }
  }

  removeComponent(itemId: string | undefined) {
  if (!itemId) {
    console.warn('No item ID to remove');
    return;
  }

  this.pcAssemblyService.removeComponentFromBuild(itemId).subscribe({
    next: (response) => {
      if (response.success) {
        // Update UI state (optional if you re-fetch the build)
        const index = this.components.findIndex(c => c.selectedProduct?.itemId === itemId);
        if (index !== -1) {
          this.components[index].selected = false;
          this.components[index].selectedProduct = null;
        }

        // ✅ Re-fetch the full build data to get updated totalCost
        const buildId = localStorage.getItem('pcAssemblyId');
        if (buildId) {
          this.loadBuild(buildId);
        }
      } else {
        console.error(`❌ Failed to remove component ${itemId}:`, response.message);
      }
    },
    error: (err) => {
      console.error(`❌ Error removing component ${itemId}:`, err);
    }
  });
}


  setSelectedProduct(category: string, product: IProduct) {
  const categoryMap: { [key: string]: string } = {
    'Processors': 'Processor',
    'Graphics Cards': 'GraphicsCard',
    'Motherboards': 'Motherboard',
    'CPU Cooler': 'CPUCooler',
    'Case': 'Case',
    'RAM': 'RAM',
    'Storage': 'Storage',
    'Case Cooler': 'CaseCooler',
    'Power Supply': 'PowerSupply',
    'Monitor': 'Monitor',
    'Accessories': 'Accessories',
    'Expensions & Networking': 'Accessories'
  };

  // Normalize the category key
  const normalizedComponentName = categoryMap[category] || category;

  // Try to find match by name first, then fallback to id (just in case)
  const item =
    this.components.find(c => c.name === normalizedComponentName) ||
    this.components.find(c => c.id === normalizedComponentName);

  if (item) {
    item.selected = true;
    item.selectedProduct = product;
  } else {
    console.warn(`⚠️ Could not find component for category: ${category}`);
  }
}


  addToCart() {
  if (!this.build?.assemblyId || this.build.assemblyFee == null) {
    console.error('Missing build information. Cannot add to cart.');
    return;
  }

  const assemblyId = this.build.assemblyId;
  const assemblyFee = this.build.assemblyFee;

  // TODO: Replace this with the actual logged-in customer ID logic
  const customerId = localStorage.getItem('customerId') || '';
  if (!customerId) {
    console.error('No customer ID found. Cannot add to cart.');
    return;
  }

  this.pcAssemblyService.addBuildToCart(assemblyId).subscribe({
    next: (response) => {
      if (response.success) {
        console.log('✅ Build added to cart:', response);
        // Optionally navigate or show a toast/snackbar
        this.cartService.initializeCartState();
        this.toastr.success('Build added to cart successfully!');
      } else {
        console.warn('⚠️ Failed to add build to cart:', response.message);
        this.toastr.error('Failed to add build to cart: ' + response.message);
      }
    },
    error: (err) => {
      console.error('❌ Error while adding build to cart:', err);
      this.toastr.error('Something went wrong while adding to cart.');
    }
  });
}

}
