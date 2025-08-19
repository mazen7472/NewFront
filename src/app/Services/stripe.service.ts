import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;
  private readonly apiUrl = 'https://localhost:5001/api/payments';
  private publishableKey: string | null = null;

  constructor(private http: HttpClient) {
    // Initialize Stripe after fetching publishable key from backend
    this.stripePromise = this.loadPublishableKey();
  }

  private async loadPublishableKey(): Promise<Stripe | null> {
    const response: any = await firstValueFrom(this.http.get(`${this.apiUrl}/publishable-key`));
    this.publishableKey = response.data.key;
    return loadStripe(this.publishableKey!);
  }

  async createPaymentIntent(amount: number, currency: string): Promise<string> {
    const result: any = await firstValueFrom(
      this.http.post(`${this.apiUrl}/create-intent`, { amount, currency })
    );
    return result.data.clientSecret;
  }

  async confirmCardPayment(clientSecret: string, cardElement: StripeCardElement) {
    const stripe = await this.stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement }
    });

    if (error) throw error;
    return paymentIntent;
  }
}