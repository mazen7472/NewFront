
export interface WishListItemCreateDTO {
  productId: string;
  cartId?: string;
}

export interface WishListCreateDTO {
  customerId: string;
  items?: WishListItemCreateDTO[];
}

export interface WishListItemReadDTO {
  id: string;
  productId: string;
  productName?: string;
  productImageUrl?: string;
  createdAt: string;
}

export interface WishListReadDTO {
  id: string;
  customerId: string;
  items: WishListItemReadDTO[];
}

export interface GeneralResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}