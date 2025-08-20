import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { StripeCardElement } from '@stripe/stripe-js';
import { StripeService } from '../../Services/stripe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartItemReadDTO } from '../../Services/cart.service';
import { Environment } from '../../Environment/environment';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy {
  @ViewChild('cardElement', { static: true }) cardElementRef!: ElementRef;

  paymentForm: FormGroup;
  message = '';
  stripeCard!: StripeCardElement | null;
  isProcessing = false;
  
  // Cart checkout data
  cartData: any = null;
  isCartCheckout = false;
  customerId: string = '';

  constructor(
    private fb: FormBuilder, 
    private stripeService: StripeService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient
  ) {
    this.paymentForm = this.fb.group({
      amount: [this.cartData?.total || 0, [Validators.required, Validators.min(0.01)]],
      currency: ['USD', [Validators.required]],
      // Removed deliveryAddress - not needed for this checkout flow
    });
  }

  async ngOnInit() {
    console.log('Payment component initializing...');
    
    try {
      // Check if this is a cart checkout
      this.route.queryParams.subscribe(params => {
        console.log('Route params:', params);
        if (params['from'] === 'cart') {
          this.isCartCheckout = true;
          this.customerId = params['customerId'] || '';
          console.log('Cart checkout detected, customerId:', this.customerId);
          this.loadCartData();
        }
      });

      // Test backend connection
      await this.testBackendConnection();

      // Create Stripe card element
      console.log('Creating Stripe card element...');
      this.stripeCard = await this.stripeService.createCardElement();
      if (!this.stripeCard) {
        throw new Error('Stripe Card element failed to load');
      }

      // Mount the element in the div
      console.log('Mounting Stripe card element...');
      this.stripeCard.mount(this.cardElementRef.nativeElement);
      console.log('Stripe card element mounted successfully');
      
    } catch (err: any) {
      console.error('Error in ngOnInit:', err);
      this.message = `Stripe init error: ${err.message}`;
      this.toastr.error(`Stripe initialization failed: ${err.message}`);
    }
  }

  public async testBackendConnection(): Promise<void> {
    try {
      console.log('Testing backend connection...');
      const response: any = await this.http.get(`${Environment.baseUrl}/payments/publishable-key`).toPromise();
      console.log('Backend connection test successful:', response);
      this.toastr.success('✅ Backend connection successful!');
    } catch (error: any) {
      console.error('Backend connection test failed:', error);
      if (error.status === 0) {
        this.toastr.warning('⚠️ Cannot connect to backend server. Please ensure the backend is running on ' + Environment.baseUrl);
      } else {
        this.toastr.warning(`⚠️ Backend connection issue: ${error.status} - ${error.message}`);
      }
    }
  }

  getBackendUrl(): string {
    return Environment.baseUrl;
  }

  getJwtTokenStatus(): string {
    const token = localStorage.getItem('jwtToken');
    if (!token) return 'Not found';
    if (token.length < 10) return 'Invalid (too short)';
    return `Found (${token.length} chars)`;
  }

  loadCartData(): void {
    try {
      console.log('Loading cart data...');
      const cartDataStr = localStorage.getItem('stripeCartData');
      console.log('Cart data from localStorage:', cartDataStr);
      
      if (cartDataStr) {
        this.cartData = JSON.parse(cartDataStr);
        console.log('Parsed cart data:', this.cartData);
        
        this.paymentForm.patchValue({
          amount: this.cartData.total,
          currency: 'usd'
        });
      } else {
        console.log('No cart data found in localStorage');
      }
    } catch (error) {
      console.error('Failed to load cart data:', error);
      this.toastr.error('Failed to load cart data');
    }
  }

  clearCartData(): void {
    try {
      localStorage.removeItem('stripeCartData');
      this.cartData = null;
      this.isCartCheckout = false;
      this.customerId = '';
      this.paymentForm.patchValue({
        amount: 0,
        currency: 'usd'
      });
      this.toastr.success('Cart data cleared successfully');
    } catch (error) {
      console.error('Failed to clear cart data:', error);
      this.toastr.error('Failed to clear cart data');
    }
  }

  async pay(): Promise<void> {
    if (this.paymentForm.invalid) {
      this.message = '❌ Please fill in all required fields correctly.';
      return;
    }

    if (!this.stripeCard) {
      this.message = '❌ Stripe card element not initialized.';
      return;
    }

    this.isProcessing = true;
    this.message = '';

    try {
      if (this.isCartCheckout) {
        await this.processCartPayment();
      } else {
        await this.processGenericPayment();
      }
    } catch (error: any) {
      this.message = `❌ Payment failed: ${error.message}`;
      this.toastr.error(error.message);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processCartPayment(): Promise<void> {
    try {
      console.log('Step 1: Creating payment intent...');
      console.log('Customer ID:', this.customerId);
      console.log('Cart items:', this.cartData.items);
      
      // Step 1: Create payment intent
      const { paymentIntentId, clientSecret } = await this.stripeService.createCartPaymentIntent(
        this.customerId, 
        this.cartData.items
      );
      
      console.log('Payment intent created successfully:');
      console.log('- paymentIntentId:', paymentIntentId);
      console.log('- clientSecret:', clientSecret ? 'Present' : 'Missing');
      console.log('- paymentIntentId type:', typeof paymentIntentId);
      console.log('- paymentIntentId length:', paymentIntentId ? paymentIntentId.length : 'N/A');

      if (!paymentIntentId) {
        throw new Error('Failed to create payment intent - no paymentIntentId returned');
      }

      if (typeof paymentIntentId !== 'string' || paymentIntentId.trim() === '') {
        throw new Error(`Invalid paymentIntentId: ${paymentIntentId} (type: ${typeof paymentIntentId})`);
      }

      console.log('Step 2: Confirming payment with Stripe...');
      // Step 2: Confirm payment with Stripe
      const paymentIntent = await this.stripeService.confirmCardPayment(clientSecret, this.stripeCard!);
      console.log('Payment confirmed:', paymentIntent);

      if (paymentIntent?.status === 'succeeded') {
        console.log('Step 3: Placing order with payment verification...');
        console.log('Using paymentIntentId for order placement:', paymentIntentId);
        console.log('PaymentIntentId before order placement:', {
          value: paymentIntentId,
          type: typeof paymentIntentId,
          length: paymentIntentId.length,
          trimmed: paymentIntentId.trim()
        });
        
        // Step 3: Place order with payment verification
        await this.placeOrderWithPayment(paymentIntentId);
        
        this.message = `✅ Payment succeeded! Order placed successfully.`;
        this.toastr.success('Payment successful! Order placed successfully.');
        
        // Clear cart data and redirect
        localStorage.removeItem('stripeCartData');
        setTimeout(() => {
          this.router.navigate(['/order']);
        }, 2000);
      } else {
        throw new Error('Payment was not completed successfully');
      }
    } catch (error: any) {
      console.error('Cart payment error:', error);
      throw new Error(`Cart payment failed: ${error.message}`);
    }
  }

  private async processGenericPayment(): Promise<void> {
    const { amount, currency } = this.paymentForm.value;
    console.log('Processing generic payment:', { amount, currency });

    try {
      // Create payment intent
      const { paymentIntentId, clientSecret } = await this.stripeService.createPaymentIntent(amount, currency);
      console.log('Generic payment intent created:', { paymentIntentId, clientSecret });

      // Confirm payment
      const paymentIntent = await this.stripeService.confirmCardPayment(clientSecret, this.stripeCard!);
      console.log('Generic payment confirmed:', paymentIntent);

      if (paymentIntent?.status === 'succeeded') {
        this.message = `✅ Payment succeeded! PaymentIntent ID: ${paymentIntent.id}`;
        this.toastr.success('Payment successful!');
      } else {
        throw new Error('Payment was not completed successfully');
      }
    } catch (error: any) {
      console.error('Generic payment error:', error);
      throw new Error(`Generic payment failed: ${error.message}`);
    }
  }

  private async placeOrderWithPayment(paymentIntentId: string): Promise<void> {
    try {
      console.log('=== ORDER PLACEMENT START ===');
      console.log('Placing order with payment:', paymentIntentId);
      console.log('PaymentIntentId parameter received:', {
        value: paymentIntentId,
        type: typeof paymentIntentId,
        length: paymentIntentId.length,
        trimmed: paymentIntentId.trim()
      });
      
      // Create the checkout data according to CartCheckoutDTO interface
      const checkoutData = {
        customerId: this.customerId,
        deliveryId: null, // Not required for this flow
        serviceUsageId: null, // Not required for this flow
        promoCode: null, // Not required for this flow
        paymentIntentId: paymentIntentId, // This is required by the backend
        productIds: this.cartData.items.map((item: any) => item.productId) // Send product IDs as required by backend
      };

      console.log('Checkout data being sent to backend:');
      console.log('- customerId:', checkoutData.customerId);
      console.log('- paymentIntentId:', checkoutData.paymentIntentId);
      console.log('- productIds:', checkoutData.productIds);
      console.log('- Full checkout data:', JSON.stringify(checkoutData, null, 2));
      
      // Use the correct checkout endpoint that exists in the backend
      const response: any = await this.http.post(
        `${Environment.baseUrl}/Cart/checkout`,
        checkoutData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken') || ''}`
          }
        }
      ).toPromise();

      console.log('Order placement response:', response);
      console.log('=== ORDER PLACEMENT END ===');

      if (!response || !response.success) {
        throw new Error(response?.message || 'Order placement failed');
      }

      console.log('Order placed successfully:', response);
      
    } catch (error: any) {
      console.error('Order placement error:', error);
      console.error('Error details:', {
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        error: error.error
      });
      
      // Provide more specific error messages
      if (error.status === 0) {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      } else if (error.status === 400) {
        throw new Error(`Bad request: ${error.error?.message || 'Invalid checkout data'}`);
      } else if (error.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.status === 404) {
        throw new Error('Order endpoint not found. Please check the API configuration.');
      } else if (error.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(`Order placement failed: ${error.message || 'Unknown error'}`);
      }
    }
  }

  ngOnDestroy() {
    if (this.stripeCard) {
      this.stripeCard.destroy();
    }
  }
}