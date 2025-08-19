import { ProductCategory } from './iproduct';

// Re-export ProductCategory for convenience
export { ProductCategory };

export interface PCAssemblyCreateDTO {
  customerId: string;
  name?: string;
  description?: string;
  budget?: number;
  serviceUsageId?: string;
}

export interface PCAssemblyReadDTO {
  id: string;
  name?: string;
  createdAt: string;
  customerId: string;
  serviceUsageId?: string;
  items: PCAssemblyItemReadDTO[];
}

export interface PCAssemblyUpdateDTO {
  name?: string;
  description?: string;
  budget?: number;
  status?: PCAssemblyStatus;
  serviceUsageId?: string;
  items?: PCAssemblyItemUpdateDTO[];
}

export interface PCAssemblyItemCreateDTO {
  productId: string;
  quantity: number;
  price: number;
}

export interface PCAssemblyItemReadDTO {
  itemId: string;
  productId: string;
  productName: string;
  productImageUrl?: string;
  subCategoryName?: string;
  category: string;
  status: string;
  price: number;
  discount?: number;
  quantity: number;
  total: number;
}

export interface PCAssemblyItemUpdateDTO {
  itemId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface AddComponentToBuildDTO {
  productId: string;
  category: ProductCategory;
}

export interface PCBuildStatusDTO {
  assemblyId: string;
  status: string;
  componentCount: number;
  totalCost: number;
  isComplete: boolean;
}

export interface PCBuildComponentDTO {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  subCategory: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  total: number;
  isSelected: boolean;
}

export interface PCBuildTotalDTO {
  assemblyId: string;
  subtotal: number;
  assemblyFee: number;
  totalAmount: number;
}

export interface CompatibleComponentDTO {
  productId: string;
  productName: string;
  category: string;
  price: number;
  compatibilityScore: number;
}

export interface PCBuildTableDTO {
  assemblyId: string;
  components: PCBuildTableItemDTO[];
  totalCost: number;
  assemblyFee: number;
  grandTotal: number;
  isComplete: boolean;
}

export interface PCBuildTableItemDTO {
  componentType: ProductCategory;
  componentDisplayName: string;
  productId?: string;
  productName?: string;
  subCategoryName?: string;
  status: string;
  price?: number;
  discount?: number;
  hasComponent: boolean;
  itemId?: string;
}

export interface CompatibleProductDTO {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  categoryName: string;
  subCategoryName: string;
  techCompanyName: string;
  specifications: SpecificationDTO[];
  isCompatible: boolean;
  compatibilityNotes?: string;
}

export interface CompatibilityFilterDTO {
  categoryId?: string;
  componentId?: string;
  subCategoryId?: string;
  maxPrice?: number;
  techCompanyId?: string;
}

export interface SpecificationDTO {
  key: string;
  value: string;
}

export enum PCAssemblyStatus {
  Draft = 'Draft',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface GeneralResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PCComponentCategory {
  value: ProductCategory;
  name: string;
  displayName: string;
}

export interface PcAssemblyItem {
  componentDisplayName: string;
  componentType: string;
  discount?: number;
  hasComponent: boolean;
  itemId: string;
  price: number;
  productId: string;
  productName: string;
  status: string;
  subCategoryName: string;
}
export type ProductStatus = 'None' | 'Pending' | 'Approved' | 'Rejected';

export interface PcAssemblyDetails {
  assemblyFee: number;
  assemblyId: string;
  components: PcAssemblyItem[];
  grandTotal: number;
  isComplete: boolean;
  totalCost: number;
}
