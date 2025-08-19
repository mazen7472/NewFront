export interface GeneralResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export enum DeliveryPersonStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected'
}

export interface DeliveryPersonUpdateDTO {
  vehicleNumber?: string;
  vehicleType?: string;
  vehicleImage?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  isAvailable?: boolean;
  accountStatus: DeliveryPersonStatus;
}

export interface DeliveryPerson {
  id: string;
  vehicleNumber?: string;
  vehicleType?: string;
  vehicleImage?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  isAvailable: boolean;
  accountStatus: DeliveryPersonStatus;
}

export interface Offer {
  id: string;
  orderId: string;
  driverId: string;
  status: string;
  createdAt: string;
}
