import { ProductCardDTO } from "./ProductCardDTO";

export interface TechCompanyProfileDTO {
  userId: string;
  fullName: string;
  userName: string;
  rating?: number;
  description?: string;
  products: ProductCardDTO[];
  maintenancesCount: number;
  deliveriesCount: number;
  pcAssembliesCount: number;
}