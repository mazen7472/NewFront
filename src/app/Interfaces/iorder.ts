export interface OrderItemReadDTO {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderReadDTO {
  id: string;
  customerId: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  orderItems: OrderItemReadDTO[];
}

export interface CheckoutRequestDTO {
  customerId: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: {
    type: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
  };
  notes?: string;
}

export interface GeneralResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
