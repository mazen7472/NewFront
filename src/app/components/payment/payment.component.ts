import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { StripeCardElement, StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeService } from '../../Services/stripe.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  @ViewChild('cardElement') cardElementRef!: ElementRef;

  paymentForm: FormGroup;
  message = '';
  stripeCard!: StripeCardElement;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: { color: '#32325d', fontSize: '16px', '::placeholder': { color: '#a0aec0' } },
      invalid: { color: '#fa755a' }
    }
  };

  elementsOptions: StripeElementsOptions = { locale: 'en' };

  constructor(private fb: FormBuilder, private stripeService: StripeService) {
    this.paymentForm = this.fb.group({
      amount: [10, [Validators.required, Validators.min(1)]],
      currency: ['usd', Validators.required]
    });
  }

  async ngOnInit() {
    const stripe = await this.stripeService['stripePromise'];
    if (!stripe) throw new Error('Stripe failed to load');

    const elements = stripe.elements();
    this.stripeCard = elements.create('card', this.cardOptions);
    this.stripeCard.mount(this.cardElementRef.nativeElement);
  }

  async pay() {
    if (this.paymentForm.invalid) return;

    const { amount, currency } = this.paymentForm.value;

    try {
      const clientSecret = await this.stripeService.createPaymentIntent(amount, currency);
      const paymentIntent = await this.stripeService.confirmCardPayment(clientSecret, this.stripeCard);
      this.message = `Payment ${paymentIntent.status}`;
    } catch (err: any) {
      this.message = `Payment error: ${err.message}`;
    }
  }
}