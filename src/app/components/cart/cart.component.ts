import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, CartItemReadDTO, CartService } from '../../Services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { Environment } from '../../Environment/environment';
import { loadStripe } from '@stripe/stripe-js';


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
    private cartService: CartService,  // use camelCase by convention
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
        console.log(res);
        this.CartItems = res.data.cartItems;  // <-- direct assign
        this.cartService.updateCartState(this.CartItems); // You may need to adjust this method later to accept CartItemReadDTO[]
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

  checkout(): void {
    if (this.CartItems.length === 0) {
      this.toastr.warning('Your cart is empty');
      return;
    }

    this.isCheckingOut = true;

    console.log('🛒 Starting checkout process...');
    console.log('📦 Cart items:', this.CartItems);
    console.log('💰 Total amount:', this.getTotal());

    const checkoutData = {
  notes: `Order total: ${this.getTotal()} EGP`,
  items: this.CartItems.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,      // directly from CartItemReadDTO
    UnitPrice: item.unitPrice // directly from CartItemReadDTO
  }))
};


    console.log('📤 Sending checkout data:', checkoutData);

    this.cartService.checkout(checkoutData).subscribe({
      next: (res) => {
        console.log('✅ Checkout successful:', res);
        this.toastr.success('Order placed successfully!');
        this.isCheckingOut = false;

        // Clear cart after successful checkout
        this.cartService.clearCart().subscribe(() => {
          this.loadCart();
        });

        this.router.navigate(['/order']);
      },
      error: (err) => {
        console.error('❌ Checkout failed:', err);
        this.isCheckingOut = false;

        if (err.error?.message) {
          this.toastr.error(err.error.message);
        } else {
          this.toastr.error('Checkout failed. Please try again.');
        }
      }
    });
  }

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
  return '/assets/placeholder.jpg'; // fallback
}

/**
 * Handles broken images
 */
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

checkoutWithStripe(): void {
  if (this.CartItems.length === 0) {
    this.toastr.warning('Your cart is empty');
    return;
  }

  this.isCheckingOut = true;

  this.cartService.createStripeSession(this.CartItems).subscribe({
    next: async (res) => {
      const stripe = await loadStripe('pk_test_51Rwn7uC7LrcL50Sgy3jemleKmNPuMT7apQf5W4V335OJq6rn6LqSAViIgfKzgWhgnN5RC6ZrLQs76giC3ld4F45X00GrWPHc3A'); // Your Stripe public key
      if (!stripe) {
        this.toastr.error('Failed to load Stripe');
        this.isCheckingOut = false;
        return;
      }

      const { error } = await stripe.redirectToCheckout({ sessionId: res.sessionId });

      if (error) {
        console.error('Stripe checkout error:', error);
        this.toastr.error(error.message || 'Stripe checkout failed');
        this.isCheckingOut = false;
      }
    },
    error: (err) => {
      console.error('Failed to create Stripe session:', err);
      this.toastr.error('Failed to initiate Stripe checkout');
      this.isCheckingOut = false;
    }
  });
}

}
