import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, CartItemReadDTO, CartService } from '../../Services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { Environment } from '../../Environment/environment';
import { loadStripe } from '@stripe/stripe-js';
import { StripeService } from '../../Services/stripe.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  CartItems: CartItemReadDTO[] = [];
  isCheckingOut = false;

  constructor(
    private cartService: CartService,
    private stripeService: StripeService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.CartItems = res.data.cartItems;
          this.cartService.updateCartState(this.CartItems);
        } else {
          this.CartItems = [];
          this.toastr.warning('Failed to load cart items: ' + res.message);
        }
      },
      error: (err) => {
        console.error('Failed to load cart:', err);
        this.toastr.error('Failed to load cart items');
        this.CartItems = [];
      }
    });
  }

  addToCart(productId: string): void {
    this.cartService.addItem(productId).subscribe(() => this.loadCart());
  }

  updateItem(item: CartItem): void {
    this.cartService.updateItem(item).subscribe(() => this.loadCart());
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId).subscribe(() => this.loadCart());
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => this.loadCart());
  }

  // Standard checkout using backend
  checkout(): void {
    if (this.CartItems.length === 0) {
      this.toastr.warning('Your cart is empty');
      return;
    }

    this.isCheckingOut = true;

    const checkoutData = {
      notes: `Order total: ${this.getTotal()} EGP`,
      items: this.CartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        UnitPrice: item.unitPrice
      }))
    };

    this.cartService.checkout(checkoutData).subscribe({
      next: (res) => {
        this.toastr.success('Order placed successfully!');
        this.isCheckingOut = false;

        // Clear cart
        this.cartService.clearCart().subscribe(() => this.loadCart());
        this.router.navigate(['/order']);
      },
      error: (err) => {
        console.error('❌ Checkout failed:', err);
        this.isCheckingOut = false;
        this.toastr.error(err.error?.message || 'Checkout failed. Please try again.');
      }
    });
  }

  // Stripe Checkout - Navigate to payment page with cart data
  async checkoutWithStripe(): Promise<void> {
    if (this.CartItems.length === 0) {
      this.toastr.warning('Your cart is empty');
      return;
    }

    this.isCheckingOut = true;

    try {
      const customerId = localStorage.getItem('customerId'); 
      if (!customerId) {
        this.toastr.error('You must be logged in to proceed with payment.');
        this.isCheckingOut = false;
        return;
      }

      // Store cart data for payment page
      const cartData = {
        customerId: customerId,
        items: this.CartItems,
        total: this.getTotal()
      };
      
      localStorage.setItem('stripeCartData', JSON.stringify(cartData));
      
      // Navigate to payment page
      this.router.navigate(['/payment'], { 
        queryParams: { 
          from: 'cart',
          customerId: customerId 
        } 
      });

    } catch (err: any) {
      console.error('Stripe checkout failed:', err);
      this.toastr.error(err?.message || 'Stripe checkout failed');
      this.isCheckingOut = false;
    }
  }

  // Helpers
  getTotal(): number {
    return this.CartItems.reduce(
      (sum, item) => sum + (item.price ?? 0) * item.quantity,
      0
    );
  }

  hasDiscount(item: CartItem): boolean {
    return (
      item.product?.discountPrice !== undefined &&
      item.product?.UnitPrice !== undefined &&
      item.product.discountPrice < item.product.UnitPrice
    );
  }

  getCartItemImageUrl(item: CartItemReadDTO): string {
    if (item.imageUrl) {
      const backendBase = Environment.baseImageUrl.replace(/\/+$/, '');
      return item.imageUrl.startsWith('http')
        ? item.imageUrl
        : `${backendBase}/${item.imageUrl.replace(/^\/+/, '')}`;
    }
    return '/assets/placeholder.jpg';
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '../../../../../assets/Images/about.jpg';
  }

  increaseQuantity(item: CartItemReadDTO): void {
    const newQuantity = item.quantity + 1;
    this.cartService.updateItem({ productId: item.productId, quantity: newQuantity }).subscribe({
      next: () => this.loadCart(),
      error: (err) => {
        console.error('Failed to increase quantity', err);
        this.toastr.error('Failed to increase quantity');
      }
    });
  }

  decreaseQuantity(item: CartItemReadDTO): void {
    const newQuantity = item.quantity - 1;

    if (newQuantity < 1) {
      this.cartService.removeItem(item.productId).subscribe({
        next: () => this.loadCart(),
        error: (err) => {
          console.error('Failed to remove item', err);
          this.toastr.error('Failed to remove item');
        }
      });
      return;
    }

    this.cartService.updateItem({ productId: item.productId, quantity: newQuantity }).subscribe({
      next: () => this.loadCart(),
      error: (err) => {
        console.error('Failed to decrease quantity', err);
        this.toastr.error('Failed to decrease quantity');
      }
    });
  }
}
