import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CartItemReadDTO } from './cart.service';
import { Environment } from '../Environment/environment';

export interface CustomerBasketDto {
  id: string;
  customerId: string;
  basketItems: BasketItemDto[];
  paymentIntentId?: string;
  clientSecret?: string;
  deliveryMethodId?: string;
  shippingPrice: number;
}

export interface BasketItemDto {
  id: string;
  productId: string;
  productName: string;
  price: number;
  qty: number;
  pictureUrl?: string;
  brand?: string;
  type?: string;
}

export interface OrderResultDto {
  id: string;
  orderDate: Date;
  totalAmount: number;
  status: string;
  customerId: string;
  serviceUsageId?: string;
  orderHistoryId?: string;
  orderItems: OrderItemResultDto[];
}

export interface OrderItemResultDto {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  pictureUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;
  private readonly apiUrl = `${Environment.baseUrl}/payments`;
  private publishableKey: string | null = null;

  constructor(private http: HttpClient) {
    console.log('StripeService constructor called');
    console.log('API URL:', this.apiUrl);
    this.stripePromise = this.loadPublishableKey();
  }

  // 🔹 Load Stripe publishable key from backend
  private async loadPublishableKey(): Promise<Stripe | null> {
    try {
      console.log('Loading publishable key from backend...');
      const response: any = await firstValueFrom(this.http.get(`${this.apiUrl}/publishable-key`));
      console.log('Backend response:', response);
      
      if (response.success && response.data?.key) {
        this.publishableKey = response.data.key;
        console.log('Using backend publishable key');
        return loadStripe(this.publishableKey!);
      } else {
        // Fallback to environment key if backend fails
        this.publishableKey = Environment.stripePublicKey;
        console.log('Using environment publishable key:', this.publishableKey);
        return loadStripe(this.publishableKey!);
      }
    } catch (error) {
      console.warn('Failed to load publishable key from backend, using environment key:', error);
      this.publishableKey = Environment.stripePublicKey;
      return loadStripe(this.publishableKey!);
    }
  }

  // 🔹 Create payment intent for cart checkout
  async createCartPaymentIntent(customerId: string, cartItems: CartItemReadDTO[]): Promise<{ paymentIntentId: string, clientSecret: string }> {
    try {
      console.log('Creating cart payment intent for customer:', customerId);
      console.log('Cart items:', cartItems);
      
      // Calculate total amount from cart items
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      console.log('Total amount:', totalAmount);
      
      const result: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/create-intent`, { 
          amount: totalAmount, 
          currency: 'usd' 
        })
      );
      
      console.log('Payment intent creation result:', result);
      
      if (result.success && result.data) {
        return {
          paymentIntentId: result.data.paymentIntentId,
          clientSecret: result.data.clientSecret
        };
      } else {
        throw new Error(result.message || 'Failed to create payment intent');
      }
    } catch (error: any) {
      console.error('Payment intent creation error:', error);
      throw new Error(`Payment intent creation failed: ${error.message}`);
    }
  }

  // 🔹 Generic payment intent
  async createPaymentIntent(amount: number, currency: string): Promise<{ paymentIntentId: string, clientSecret: string }> {
    try {
      console.log('Creating generic payment intent:', { amount, currency });
      
      const result: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/create-intent`, { amount, currency })
      );
      
      console.log('Generic payment intent result:', result);
      
      if (result.success && result.data) {
        return {
          paymentIntentId: result.data.paymentIntentId,
          clientSecret: result.data.clientSecret
        };
      } else {
        throw new Error(result.message || 'Failed to create payment intent');
      }
    } catch (error: any) {
      console.error('Generic payment intent error:', error);
      throw new Error(`Payment intent creation failed: ${error.message}`);
    }
  }

  // 🔹 Confirm card payment
  async confirmCardPayment(clientSecret: string, cardElement: StripeCardElement) {
    try {
      console.log('Confirming card payment with client secret...');
      const stripe = await this.stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement }
      });

      if (error) {
        console.error('Stripe payment confirmation error:', error);
        throw error;
      }
      
      console.log('Payment confirmed successfully:', paymentIntent);
      return paymentIntent;
    } catch (error) {
      console.error('Card payment confirmation error:', error);
      throw error;
    }
  }

  // 🔹 Check payment status
  async getPaymentStatus(paymentIntentId: string): Promise<string> {
    try {
      console.log('Getting payment status for:', paymentIntentId);
      const result: any = await firstValueFrom(
        this.http.get(`${this.apiUrl}/status/${paymentIntentId}`)
      );
      console.log('Payment status result:', result);
      return result.data?.status || 'unknown';
    } catch (error) {
      console.error('Failed to get payment status:', error);
      return 'unknown';
    }
  }

  // 🔹 Create Stripe Elements
  async createStripeElements(): Promise<StripeElements | null> {
    try {
      console.log('Creating Stripe elements...');
      const stripe = await this.stripePromise;
      if (!stripe) {
        console.error('Stripe not loaded');
        return null;
      }
      
      const elements = stripe.elements();
      console.log('Stripe elements created successfully');
      return elements;
    } catch (error) {
      console.error('Error creating Stripe elements:', error);
      return null;
    }
  }

  // 🔹 Create card element
  async createCardElement(): Promise<StripeCardElement | null> {
    try {
      console.log('Creating Stripe card element...');
      const elements = await this.createStripeElements();
      if (!elements) {
        console.error('Failed to create Stripe elements');
        return null;
      }

      // Use type assertion to fix the TypeScript error
      const cardElement = (elements as any).create('card', {
        style: {
          base: { 
            fontSize: '16px', 
            color: '#424770', 
            '::placeholder': { color: '#aab7c4' },
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            padding: '12px'
          },
          invalid: { color: '#9e2146' }
        }
      });
      
      console.log('Stripe card element created successfully');
      return cardElement;
    } catch (error) {
      console.error('Error creating Stripe card element:', error);
      return null;
    }
  }

  // 🔹 Process complete payment for cart
  async processPayment(
    type: 'cart' | 'basket',
    payload: any,
    cardElement: StripeCardElement
  ) {
    try {
      console.log('Processing payment:', { type, payload });
      
      if (type === 'cart') {
        const { clientSecret } = await this.createCartPaymentIntent(payload.customerId, payload.items);
        const paymentIntent = await this.confirmCardPayment(clientSecret, cardElement);

        return {
          success: paymentIntent?.status === 'succeeded',
          paymentIntentId: paymentIntent?.id
        };
      } else {
        const updatedBasket = await this.createBasketPaymentIntent(payload);
        if (!updatedBasket.clientSecret) throw new Error('Failed to create payment intent');

        const paymentIntent = await this.confirmCardPayment(updatedBasket.clientSecret, cardElement);

        return {
          success: paymentIntent?.status === 'succeeded',
          paymentIntentId: paymentIntent?.id
        };
      }
    } catch (error: any) {
      console.error('Process payment error:', error);
      return { success: false, error: error.message };
    }
  }

  // 🔹 Create or update basket payment intent
  async createBasketPaymentIntent(basket: CustomerBasketDto): Promise<CustomerBasketDto> {
    const result: any = await firstValueFrom(
      this.http.post(`${this.apiUrl}/basket/payment-intent`, basket)
    );
    return result.data;
  }

  // 🔹 Update order on payment succeeded
  async updateOrderPaymentSucceeded(paymentIntentId: string, basketId: string): Promise<OrderResultDto> {
    const result: any = await firstValueFrom(
      this.http.post(`${this.apiUrl}/payment-succeeded`, { paymentIntentId, basketId })
    );
    return result.data;
  }

  // 🔹 Update order on payment failed
  async updateOrderPaymentFailed(paymentIntentId: string): Promise<OrderResultDto> {
    const result: any = await firstValueFrom(
      this.http.post(`${this.apiUrl}/payment-failed`, { paymentIntentId })
    );
    return result.data;
  }

  // 🔹 Process complete payment for basket
  async processBasketPayment(basket: CustomerBasketDto, cardElement: StripeCardElement) {
    try {
      const updatedBasket = await this.createBasketPaymentIntent(basket);
      if (!updatedBasket.clientSecret) throw new Error('Failed to create payment intent');

      const paymentIntent = await this.confirmCardPayment(updatedBasket.clientSecret, cardElement);

      return {
        success: paymentIntent?.status === 'succeeded',
        paymentIntentId: paymentIntent?.id
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}