import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { ProductService } from '../../../../Services/product.service';
import { CartService } from '../../../../Services/cart.service';
import { WishlistService } from '../../../../Services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../../../../Interfaces/iproduct';
import { Subscription } from 'rxjs';
import { ImageUtilityService } from '../../../../Services/image-utility.service';
import { Environment } from '../../../../Environment/environment';

@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css']
})
export class ProductdetailsComponent implements OnInit, OnDestroy {
  productId!: string;
  product!: IProduct;
  isAddingToCart = false;
  private subscriptions: Subscription[] = [];
  currentSlideIndex = 0;

  profilePhotoUrl: string = 'assets/Images/default-profile.jpg';
  defaultPhotoUrl: string = 'assets/Images/default-profile.jpg';

  // Gallery
  productImages: string[] = [];
  selectedImage: string = '';

  private imageUtilityService = inject(ImageUtilityService);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.productId) return;

    this.subscriptions.push(
      this.productService.getProductById(this.productId).subscribe({
        next: (res) => {
          console.log(res);
          this.product = res.data;

          // Build correct backend URLs for images
          this.productImages = this.product.imageUrls && this.product.imageUrls.length
            ? this.product.imageUrls.map(img => {
                if (!img) return `https://picsum.photos/seed/${this.product.id}/600/400`;
                const backendBase = Environment.baseImageUrl.replace(/\/+$/, '');
                return img.startsWith('http') 
                       ? img 
                       : `${backendBase}/${img.replace(/^\/+/, '')}`;
              })
            : [this.product.imageUrl 
                ? `${Environment.baseImageUrl}${this.product.imageUrl.replace(/^\/+/, '')}`
                : `https://picsum.photos/seed/${this.product.id}/600/400`];

          this.selectedImage = this.productImages[0];
        },
        error: (err) => console.error('❌ Error fetching product:', err)
      })
    );

    this.loadProfilePhoto();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onAddToCart(): void {
    if (!this.product) return;
    this.isAddingToCart = true;

    this.cartService.addItem(this.product.id).subscribe({
      next: () => {
        this.cartService.initializeCartState();
        this.toastr.success(`${this.product.name} added to cart!`);
        this.isAddingToCart = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to add to cart');
        this.isAddingToCart = false;
      }
    });
  }

  onAddToWishlist(product: IProduct): void {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      this.toastr.error('Please log in first');
      return;
    }

    this.wishlistService.addItemToCustomerWishlist(customerId, product.id).subscribe({
      next: () => {
        this.toastr.success(`${product.name} added to wishlist!`);
        this.wishlistService.initializeWishlistState();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to add to wishlist');
      }
    });
  }

  selectImage(img: string): void {
    this.selectedImage = img;
  this.currentSlideIndex = this.productImages.indexOf(img);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) img.src = `${Environment.baseImageUrl}/photo`;
  }

  private loadProfilePhoto(): void {
    const userId = localStorage.getItem('customerId') || localStorage.getItem('userId');
    const storedPhotoName = localStorage.getItem('profilePhotoUrl') || 'photo';

    if (userId) {
      this.subscriptions.push(
        this.imageUtilityService.getProfileImageUrlFromAPI(userId, storedPhotoName).subscribe({
          next: (imageUrl) => (this.profilePhotoUrl = imageUrl),
          error: () => {
            // Build full fallback URL
            this.profilePhotoUrl = this.imageUtilityService.getProfileImageUrl(userId, storedPhotoName);
            if (storedPhotoName) {
              const apiBaseUrl = Environment.baseImageUrl.replace(/\/+$/, '');
              const cleanedPath = storedPhotoName.replace(/^\/+/, '');
              this.profilePhotoUrl = `${apiBaseUrl}/${cleanedPath}`;
            }
          }
        })
      );
    }
  }

prevSlide() {
  if (!this.productImages?.length) return;
  this.currentSlideIndex = (this.currentSlideIndex - 1 + this.productImages.length) % this.productImages.length;
  this.selectedImage = this.productImages[this.currentSlideIndex];
}

nextSlide() {
  if (!this.productImages?.length) return;
  this.currentSlideIndex = (this.currentSlideIndex + 1) % this.productImages.length;
  this.selectedImage = this.productImages[this.currentSlideIndex];
}
}
