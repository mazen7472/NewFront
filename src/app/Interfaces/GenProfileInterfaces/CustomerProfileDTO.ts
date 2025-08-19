export interface CustomerProfileDTO {
  userId: string;
  fullName: string;
  userName: string;
  email: string;
  ordersCount: number;
  deliveriesCount: number;
  pcAssembliesCount: number;
  maintenancesCount: number;
}