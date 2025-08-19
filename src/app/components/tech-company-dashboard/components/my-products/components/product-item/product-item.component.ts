import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../../../../../../Interfaces/iproduct';
import { CartService } from '../../../../../../Services/cart.service';
import { WishlistService } from '../../../../../../Services/wishlist.service';
import { ImageUtilityService } from '../../../../../../Services/image-utility.service';
import { ProductService } from '../../../../../../Services/product.service';
import { Environment } from '../../../../../../Environment/environment';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent {
  @Input() productC!: IProduct;
  @Output() addToCart = new EventEmitter<string>();

  _cartService = inject(CartService);
  _wishlistService = inject(WishlistService);
  _toastr = inject(ToastrService);
  _imageUtility = inject(ImageUtilityService);
  _productService = inject(ProductService);

  // Modal state
  showModal = false;
  modalProduct!: IProduct | null;

  // Add product to cart
  onAddToCart() {
    this.addToCart.emit(this.productC.id);
  }

  // Construct a proper image URL
 getProductImageUrl(): string {
     if (this.productC.imageUrl) {
       const backendBase = Environment.baseImageUrl.replace(/\/+$/, '');
       return this.productC.imageUrl.startsWith('http') 
         ? this.productC.imageUrl 
         : `${backendBase}/${this.productC.imageUrl.replace(/^\/+/, '')}`;
     }
     return '../../../../../assets/Images/about.jpg';
   }
 
   onImgError(event: Event) {
     const img = event.target as HTMLImageElement;
     img.src = '../../../../../assets/Images/about.jpg';
   }

  // Add to wishlist
  onAddToWishlist(product: IProduct) {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      this._toastr.error('Please login first');
      return;
    }

    this._wishlistService.addItemToCustomerWishlist(customerId, product.id).subscribe({
      next: () => {
        this._toastr.success('Added to wishlist!');
        this._wishlistService.initializeWishlistState();
      },
      error: () => {
        this._toastr.error(`Item already in wishlist ${product.name}`);
      }
    });
  }

  // Open product modal
  openModal(productId: string) {
    this._productService.getProductById(productId).subscribe({
      next: (res) => {
        this.modalProduct = res.data;
        this.showModal = true;
      },
      error: () => {
        this._toastr.error('Failed to load product details');
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.modalProduct = null;
  }

  onAddToCartFromModal() {
    if (!this.modalProduct) return;

    this._cartService.addItem(this.modalProduct.id).subscribe({
      next: () => this._toastr.success(`${this.modalProduct?.name} added to cart!`),
      error: () => this._toastr.error('Failed to add to cart')
    });
  }

  onAddToWishlistFromModal() {
    if (!this.modalProduct) return;
    this.onAddToWishlist(this.modalProduct);
  }
}
