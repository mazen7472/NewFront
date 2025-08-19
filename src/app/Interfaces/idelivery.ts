export interface GeneralResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export enum DeliveryClusterStatus {
  Pending = 0,
  Assigned = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4
}

export interface DeliveryClusterTracking {
  id?: string;          // from BaseEntity
  clusterId: string;
  location: string;
  lastUpdated: string;
  lastRetryTime?: string;
  status: DeliveryClusterStatus;
  driver: string;
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
  pickupConfirmedAt?: string;

  sequenceOrder: number;
  tracking?: DeliveryClusterTracking;
}

export interface DeliveryCreateDTO {
  orderId: string;
  customerId: string;
  customerLatitude: number;
  customerLongitude: number;
  clusters: DeliveryClusterCreateDTO[];
}

export interface Delivery {
  id: string;
  orderId: string;
  customerId: string;
  customerLatitude: number;
  customerLongitude: number;
  clusters: DeliveryClusterCreateDTO[];
}
