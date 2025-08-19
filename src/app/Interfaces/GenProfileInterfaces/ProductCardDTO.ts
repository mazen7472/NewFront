export interface ProductCardDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  imageUrl: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  categoryName?: string;
  subCategoryId: string;
  subCategoryName?: string;
  techCompanyId: string;
  techCompanyName?: string;
  techCompanyAddress: string;
  techCompanyUserId: string;
  techCompanyImage: string;
  specifications: SpecificationDTO[];
  warranties: WarrantyDTO[];
}

export interface SpecificationDTO {
  id: string;
  key: string;
  value: string;
}

export interface WarrantyDTO {
  id: string;
  type: string;
  duration: string;
  description: string;
  startDate: string;
  endDate: string;
}