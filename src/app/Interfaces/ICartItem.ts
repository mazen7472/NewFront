import { IProduct } from './iproduct';

export interface ICartItem {
  productId: string;
  quantity: number;
  product?: IProduct; 
}