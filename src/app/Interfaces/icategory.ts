
export interface IGeneralResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ICategory {
  id: string;
  name: string;

}

export interface ICategoryWithProducts {
  id: string;
  name: string;
  description: string;
  image: string | null;
  products: ICategoryProduct[];
  subCategories: any[];
}

export interface ICategoryProduct {
  id: string;
    name: string;
    title?: string;
    description?: string;
    link?: string;
    price: number;
    discountPrice: number;
    imageUrl: string;
    imageUrls: string[];
    category?: string;
    categoryName: string | null;
    subCategoryId: string;
    subCategoryName: string;
    status: ProductStatus;
    stock?: number;
    techCompanyId: string;
    techCompanyName?: string;
    specifications?: ProductSpecification[]; // <-- Add this
    warranties?: Warranty[]; 
}
export type ProductStatus = 'None' | 'Pending' | 'Approved' | 'Rejected';
export interface ProductSpecification {
  id: string;
  key: string;
  value: string;
}
export interface Warranty {
  id: string;
  description: string;
  startDate: string;
  endDate: string;
}
export interface ICategoryCreate {
  name: string;
}

export interface ICategoryUpdate {
  id: string;
  name: string;
}
