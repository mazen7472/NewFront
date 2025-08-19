export interface GeneralResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export enum DeliveryClusterStatus {
  Pending = 'Pending',
  Assigned = 'Assigned',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum DeliveryOfferStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Declined = 'Declined',
  Canceled = 'Canceled',
  Expired = 'Expired'
}

export interface DeliveryOfferDTO {
  id: string;
  deliveryId: string;
  clusterId: string;
  deliveryPersonId: string;
  status: DeliveryOfferStatus;
  createdAt?: Date;
  expiryTime?: Date;
  isActive: boolean;

  // Optional related info
  deliveryTrackingNumber?: string;
  customerName?: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
}

export interface DeliveryClusterTrackingDTO {
  clusterId: string;
  deliveryId: string;
  techCompanyId: string;
  techCompanyName: string;
  distanceKm: number;
  price: number;
  assignedDriverId: string;
  driverName: string;
  assignmentTime?: Date;
  dropoffLatitude?: number;
  dropoffLongitude?: number;
  sequenceOrder: number;
  estimatedDistance: number;
  estimatedPrice: number;
  status: DeliveryClusterStatus;
  location: string;
  lastUpdated: Date;
  pickupConfirmed: boolean;
  pickupConfirmedAt?: Date;
}

export interface DeliveryClusterDTO {
  id: string;
  deliveryId: string;
  techCompanyId: string;
  techCompanyName: string;
  distanceKm: number;
  price: number;
  status: DeliveryClusterStatus;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignmentTime?: Date;
  retryCount: number;
  lastRetryTime?: Date;
  dropoffLatitude?: number;
  dropoffLongitude?: number;
  pickupLatitude?: number;
  pickupLongitude?: number;
  sequenceOrder: number;
  driverOfferCount: number;
  latitude?: number;
  longitude?: number;
  estimatedDistance?: number;
  estimatedPrice?: number;
  tracking?: DeliveryClusterTrackingDTO;
  offers?: DeliveryOfferDTO[];
}

export interface DeliveryClusterCreateDTO {
  deliveryId: string;
  techCompanyId: string;
  techCompanyName: string;
  distanceKm: number;
  price: number;
  assignedDriverId?: string;
  dropoffLatitude?: number;
  dropoffLongitude?: number;
  pickupLatitude?: number;
  pickupLongitude?: number;
  pickupConfirmed?: boolean;
  pickupConfirmedAt?: Date;
  sequenceOrder: number;
  tracking?: DeliveryClusterTrackingDTO;
}
