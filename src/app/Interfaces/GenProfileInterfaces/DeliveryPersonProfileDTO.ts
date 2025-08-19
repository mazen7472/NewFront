export interface DeliveryPersonProfileDTO {
  userId: string;
  fullName: string;
  userName: string;
  vehicleNumber?: string;
  vehicleType?: string;
  vehicleImage?: string;
  license?: string;
  isAvailable: boolean;
  lastOnline?: string;
  deliveriesCount: number;
  offersCount: number;
}