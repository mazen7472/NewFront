export type ProductStatus = 'None' | 'Pending' | 'Approved' | 'Rejected';

export interface ProductSpecification {
  id?: string;
  key: string;
  value: string;
}

export interface Warranty {
  id?: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface IProduct {
  id: string;
  name: string;
  title?: string;
  description?: string;
  link?: string;
  price: number;
  discountPrice: number;
  imageUrl: string;
  imageUrls:string[];
  category?: string;
  categoryName: string | null;
  subCategoryId: string;
  subCategoryName: string;
  status: ProductStatus;
  stock?: number;
  techCompanyId: string;
  techCompanyName?: string;
  techCompanyAddress?: string;
  TechCompanyImage?: string;
  specifications?: ProductSpecification[];
  warranties?: Warranty[];
}

export interface GeneralResponce {
  data: IProduct;
  message: string;
  success: boolean;
}

export interface IPagedProducts {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: IProduct[];
}

export interface SpecificationDTO {
  key: string;
  value: string;
}

export interface WarrantyDTO {
  Type: string;
  Duration: string;
  description: string;
  StartDate: Date;
  EndDate: Date;
  durationInMonths: number;
}

// -------------------- CATEGORY + STATUS ENUMS --------------------
export enum ProductCategory {
  Laptop = 'Laptop',
  Processor = 'Processor',
  Desktop = 'Desktop',
  Motherboard = 'Motherboard',
  CPUCooler = 'CPUCooler',
  Case = 'Case',
  GraphicsCard = 'GraphicsCard',
  RAM = 'RAM',
  Storage = 'Storage',
  CaseCooler = 'CaseCooler',
  PowerSupply = 'PowerSupply',
  Monitor = 'Monitor',
  Accessories = 'Accessories',
}

export enum ProductPendingStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2
}

export interface GeneralResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// -------------------- CREATE / UPDATE WRAPPERS --------------------
// Matches backend's ProductCreateAllDTO
export interface ProductCreateDTO {
  name: string;
  price: number;
  description?: string;
  stock: number;
  imageUrl?: string;
  subCategoryName?: string;
  discountPrice?: number;
  techCompanyId: string;
  specifications: SpecificationDTO[];
  warranties: WarrantyDTO[];
}

export interface ProductCreateWarSpecDTO {
  specifications?: SpecificationDTO[];
  warranties?: WarrantyDTO[];
}

export interface ProductCreateAllDTO {
  product: ProductCreateDTO;
  warrantiesSpecs: ProductCreateWarSpecDTO;
}

// Matches backend's ProductUpdateAllDTO
export interface ProductUpdateDTO extends Omit<ProductCreateDTO, 'techCompanyId'> {}

export interface ProductUpdateWarSpecDTO {
  specifications?: SpecificationDTO[];
  warranties?: WarrantyDTO[];
}

export interface ProductUpdateAllDTO {
  product: ProductUpdateDTO;
  warrantiesSpecs: ProductUpdateWarSpecDTO;
}

// -------------------- IMAGE UPLOAD / UPDATE --------------------
export interface ProductCreateImageUploadDTO {
  imageUrl?: File;      // Single image
  imageUrls?: File[];   // Multiple images
}
