import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';

// Interfaces for API responses
export interface GeneralResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
}

// Product interfaces
export interface ProductDTO {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description?: string;
  stock: number;
  status: string;
  categoryId?: string;
  subCategoryId?: string;
  techCompanyId?: string;
  categoryName: string;
  categoryEnum?: string;
  subCategoryName?: string;
  imageUrl?: string;
  image1Url?: string;
  image2Url?: string;
  image3Url?: string;
  image4Url?: string;
  techCompanyName: string;
  techCompanyAddress: string;
  specifications?: SpecificationDTO[];
  warranties?: WarrantyDTO[];
}

export interface ProductCreateDTO {
  name: string;
  price: number;
  description?: string;
  stock: number;
  categoryId?: string;
  subCategoryId?: string;
  techCompanyId?: string;
}

export interface ProductUpdateDTO {
  name?: string;
  price?: number;
  description?: string;
  stock?: number;
  categoryId?: string;
  subCategoryId?: string;
  techCompanyId?: string;
}

export interface SpecificationDTO {
  id: string;
  name: string;
  value: string;
}

export interface WarrantyDTO {
  id: string;
  name: string;
  duration: number;
  description?: string;
}

// Cart interfaces
export interface CartReadDTO {
  id: string;
  customerId: string;
  items: CartItemDTO[];
  totalAmount: number;
}

export interface CartItemDTO {
  productId: string;
  quantity: number;
  productName: string;
  price: number;
  imageUrl?: string;
}

export interface CartUpdateItemQuantityDTO {
  productId: string;
  quantity: number;
}

export interface CartCheckoutDTO {
  customerId: string;
  deliveryAddress: string;
  paymentMethod: string;
  items: CartItemDTO[];
}

// Order interfaces
export interface OrderReadDTO {
  id: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  orderItems: OrderItemReadDTO[];
}

export interface OrderItemReadDTO {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

// Maintenance interfaces
export interface MaintenanceDTO {
  id: string;
  customerName: string;
  techCompanyName: string;
  productName: string;
  serviceType: string;
  warrantyStart: string;
  warrantyEnd: string;
  status: string;
  notes?: string;
}

export interface MaintenanceCreateDTO {
  customerId: string;
  techCompanyId: string;
  warrantyId?: string;
  status: string;
  notes?: string;
}

export interface MaintenanceUpdateDTO {
  techCompanyId?: string;
  status?: string;
  notes?: string;
}

export interface MaintenanceNearestDTO {
  id: string;
  techCompanyName: string;
  distance: number;
  rating: number;
  address: string;
}

// PC Assembly interfaces
export interface PCAssemblyDTO {
  id: string;
  customerId: string;
  status: string;
  totalAmount: number;
  components: PCAssemblyComponentDTO[];
}

export interface PCAssemblyComponentDTO {
  id: string;
  productId: string;
  productName: string;
  price: number;
  category: string;
}

export interface PCAssemblyCreateDTO {
  customerId: string;
  components: string[];
}

export interface PCAssemblyUpdateDTO {
  components?: string[];
  status?: string;
}

export interface AddComponentToBuildDTO {
  productId: string;
  category: string;
}

// Category interfaces
export interface CategoryDTO {
  id: string;
  name: string;
  description?: string;
}

export interface SubCategoryDTO {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
}

// Wishlist interfaces
export interface WishListDTO {
  id: string;
  customerId: string;
  productId: string;
  productName: string;
  price: number;
  imageUrl?: string;
}

// Delivery interfaces
export interface DeliveryDTO {
  id: string;
  orderId: string;
  deliveryPersonId?: string;
  status: string;
  pickupDate?: string;
  deliveryDate?: string;
  address: string;
}

export interface AssignDeliveryDTO {
  orderId: string;
  deliveryPersonId: string;
}

// Commission interfaces
export interface CommissionDTO {
  id: string;
  techCompanyId: string;
  orderId: string;
  amount: number;
  percentage: number;
  status: string;
}

export interface CommissionCreateDTO {
  techCompanyId: string;
  orderId: string;
  amount: number;
  percentage: number;
}

export interface CommissionUpdateDTO {
  amount?: number;
  percentage?: number;
  status?: string;
}

// Notification interfaces
export interface NotificationDTO {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationCreateDTO {
  userId: string;
  title: string;
  message: string;
}

// Image Upload interfaces
export interface ImageUploadResponse {
  success: boolean;
  data: {
    imageUrl: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = Environment.baseUrl;

  constructor(private http: HttpClient) { }

  // ==================== PRODUCT APIs ====================
  
  getAllProducts(params: {
    pageNumber?: number;
    pageSize?: number;
    status?: string;
    categoryEnum?: string;
    subCategoryName?: string;
    search?: string;
    sortBy?: string;
    sortDesc?: boolean;
  } = {}): Observable<PaginatedResponse<ProductDTO>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] !== undefined) {
        httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
      }
    });
    return this.http.get<PaginatedResponse<ProductDTO>>(`${this.baseUrl}/Product/all`, { params: httpParams });
  }

  getProductById(id: string): Observable<GeneralResponse<ProductDTO>> {
    return this.http.get<GeneralResponse<ProductDTO>>(`${this.baseUrl}/Product/${id}`);
  }

  getPendingProducts(params: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDesc?: boolean;
  } = {}): Observable<PaginatedResponse<ProductDTO>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] !== undefined) {
        httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
      }
    });
    return this.http.get<PaginatedResponse<ProductDTO>>(`${this.baseUrl}/Product/pending`, { params: httpParams });
  }

  getProductsByCategory(categoryEnum: string, params: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDesc?: boolean;
  } = {}): Observable<PaginatedResponse<ProductDTO>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] !== undefined) {
        httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
      }
    });
    return this.http.get<PaginatedResponse<ProductDTO>>(`${this.baseUrl}/Product/category/${categoryEnum}`, { params: httpParams });
  }

  createProduct(product: ProductCreateDTO, category: string, status: string): Observable<GeneralResponse<string>> {
    return this.http.post<GeneralResponse<string>>(`${this.baseUrl}/Product?category=${category}&status=${status}`, product);
  }

  updateProduct(id: string, product: ProductUpdateDTO, category?: string, status?: string): Observable<GeneralResponse<string>> {
    let url = `${this.baseUrl}/Product/${id}`;
    const params: string[] = [];
    if (category) params.push(`category=${category}`);
    if (status) params.push(`status=${status}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.http.put<GeneralResponse<string>>(url, product);
  }

  deleteProduct(id: string): Observable<GeneralResponse<string>> {
    return this.http.delete<GeneralResponse<string>>(`${this.baseUrl}/Product/${id}`);
  }

  uploadProductImage(productId: string, imageFile: File): Observable<GeneralResponse<string>> {
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    return this.http.post<GeneralResponse<string>>(`${this.baseUrl}/Product/${productId}/upload-image`, formData);
  }

  // ==================== CART APIs ====================

  getCart(customerId: string): Observable<GeneralResponse<CartReadDTO>> {
    return this.http.get<GeneralResponse<CartReadDTO>>(`${this.baseUrl}/Cart/${customerId}`);
  }

  addToCart(customerId: string, item: CartItemDTO): Observable<GeneralResponse<string>> {
    return this.http.post<GeneralResponse<string>>(`${this.baseUrl}/Cart/${customerId}/items`, item);
  }

  updateCartItemQuantity(customerId: string, updateDto: CartUpdateItemQuantityDTO): Observable<GeneralResponse<string>> {
    return this.http.put<GeneralResponse<string>>(`${this.baseUrl}/Cart/${customerId}/items`, updateDto);
  }

  removeFromCart(customerId: string, productId: string): Observable<GeneralResponse<string>> {
    return this.http.delete<GeneralResponse<string>>(`${this.baseUrl}/Cart/${customerId}/items/${productId}`);
  }

  clearCart(customerId: string): Observable<GeneralResponse<string>> {
    return this.http.delete<GeneralResponse<string>>(`${this.baseUrl}/Cart/${customerId}/clear`);
  }

  checkout(customerId: string): Observable<GeneralResponse<OrderReadDTO>> {
    return this.http.post<GeneralResponse<OrderReadDTO>>(`${this.baseUrl}/Cart/${customerId}/checkout`, {});
  }

  checkoutWithDetails(checkoutDto: CartCheckoutDTO): Observable<GeneralResponse<OrderReadDTO>> {
    return this.http.post<GeneralResponse<OrderReadDTO>>(`${this.baseUrl}/Cart/checkout`, checkoutDto);
  }

  // ==================== ORDER APIs ====================

  getOrder(id: string): Observable<GeneralResponse<OrderReadDTO>> {
    return this.http.get<GeneralResponse<OrderReadDTO>>(`${this.baseUrl}/Orders/${id}`);
  }

  getAllOrders(): Observable<GeneralResponse<OrderReadDTO[]>> {
    return this.http.get<GeneralResponse<OrderReadDTO[]>>(`${this.baseUrl}/Orders`);
  }

  getOrdersByCustomer(customerId: string): Observable<GeneralResponse<OrderReadDTO[]>> {
    return this.http.get<GeneralResponse<OrderReadDTO[]>>(`${this.baseUrl}/Orders/by-customer/${customerId}`);
  }

  getOrderHistory(customerId: string): Observable<GeneralResponse<OrderReadDTO[]>> {
    return this.http.get<GeneralResponse<OrderReadDTO[]>>(`${this.baseUrl}/Orders/customer/${customerId}/history`);
  }

  // ==================== MAINTENANCE APIs ====================

  getAllMaintenance(): Observable<GeneralResponse<MaintenanceDTO[]>> {
    return this.http.get<GeneralResponse<MaintenanceDTO[]>>(`${this.baseUrl}/Maintenance`);
  }

  getMaintenanceById(id: string): Observable<GeneralResponse<MaintenanceDTO>> {
    return this.http.get<GeneralResponse<MaintenanceDTO>>(`${this.baseUrl}/Maintenance/${id}`);
  }

  createMaintenance(maintenance: MaintenanceCreateDTO, status: string = 'Requested'): Observable<GeneralResponse<string>> {
    return this.http.post<GeneralResponse<string>>(`${this.baseUrl}/Maintenance?status=${status}`, maintenance);
  }

  updateMaintenance(id: string, maintenance: MaintenanceUpdateDTO, status?: string): Observable<GeneralResponse<string>> {
    let url = `${this.baseUrl}/Maintenance/${id}`;
    if (status) url += `?status=${status}`;
    return this.http.put<GeneralResponse<string>>(url, maintenance);
  }

  deleteMaintenance(id: string): Observable<GeneralResponse<string>> {
    return this.http.delete<GeneralResponse<string>>(`${this.baseUrl}/Maintenance/${id}`);
  }

  getMaintenanceByTechCompany(techCompanyId: string): Observable<GeneralResponse<MaintenanceDTO[]>> {
    return this.http.get<GeneralResponse<MaintenanceDTO[]>>(`${this.baseUrl}/Maintenance/tech-company/${techCompanyId}`);
  }

  getAvailableMaintenanceRequests(): Observable<GeneralResponse<MaintenanceDTO[]>> {
    return this.http.get<GeneralResponse<MaintenanceDTO[]>>(`${this.baseUrl}/Maintenance/available-requests`);
  }

  acceptMaintenanceRequest(maintenanceId: string, techCompanyId: string): Observable<GeneralResponse<string>> {
    return this.http.post<GeneralResponse<string>>(`${this.baseUrl}/Maintenance/${maintenanceId}/accept`, techCompanyId);
  }

  completeMaintenance(maintenanceId: string, techCompanyId: string, notes: string): Observable<GeneralResponse<string>> {
    const request = { techCompanyId, notes };
    return this.http.post<GeneralResponse<string>>(`${this.baseUrl}/Maintenance/${maintenanceId}/complete`, request);
  }

  updateMaintenanceStatus(maintenanceId: string, status: string, notes?: string): Observable<GeneralResponse<string>> {
    let url = `${this.baseUrl}/Maintenance/${maintenanceId}/status?status=${status}`;
    if (notes) url += `&notes=${notes}`;
    return this.http.put<GeneralResponse<string>>(url, {});
  }

  getNearestMaintenance(customerId: string): Observable<GeneralResponse<MaintenanceNearestDTO[]>> {
    return this.http.get<GeneralResponse<MaintenanceNearestDTO[]>>(`${this.baseUrl}/Maintenance/nearest?customerId=${customerId}`);
  }

  // ==================== PC ASSEMBLY APIs ====================

  createPCAssembly(assembly: PCAssemblyCreateDTO): Observable<GeneralResponse<PCAssemblyDTO>> {
    return this.http.post<GeneralResponse<PCAssemblyDTO>>(`${this.baseUrl}/PCAssembly`, assembly);
  }

  getPCAssemblyById(id: string): Observable<GeneralResponse<PCAssemblyDTO>> {
    return this.http.get<GeneralResponse<PCAssemblyDTO>>(`${this.baseUrl}/PCAssembly/${id}`);
  }

  getAllPCAssemblies(): Observable<GeneralResponse<PCAssemblyDTO[]>> {
    return this.http.get<GeneralResponse<PCAssemblyDTO[]>>(`${this.baseUrl}/PCAssembly`);
  }

  getPCAssembliesByCustomer(customerId: string): Observable<GeneralResponse<PCAssemblyDTO[]>> {
    return this.http.get<GeneralResponse<PCAssemblyDTO[]>>(`${this.baseUrl}/PCAssembly/customer/${customerId}`);
  }

  updatePCAssembly(id: string, assembly: PCAssemblyUpdateDTO): Observable<GeneralResponse<PCAssemblyDTO>> {
    return this.http.put<GeneralResponse<PCAssemblyDTO>>(`${this.baseUrl}/PCAssembly/${id}`, assembly);
  }

  getComponentsByCategory(category: string, params: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortDesc?: boolean;
  } = {}): Observable<PaginatedResponse<ProductDTO>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] !== undefined) {
        httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
      }
    });
    return this.http.get<PaginatedResponse<ProductDTO>>(`${this.baseUrl}/PCAssembly/build/components/${category}`, { params: httpParams });
  }

  getPCComponentCategories(): Observable<GeneralResponse<string[]>> {
    return this.http.get<GeneralResponse<string[]>>(`${this.baseUrl}/PCAssembly/build/categories`);
  }

  addComponentToBuild(assemblyId: string, component: AddComponentToBuildDTO): Observable<GeneralResponse<string>> {
    return this.http.post<GeneralResponse<string>>(`${this.baseUrl}/PCAssembly/build/${assemblyId}/add-component`, component);
  }

  removeComponentFromBuild(assemblyId: string, itemId: string): Observable<GeneralResponse<string>> {
    return this.http.delete<GeneralResponse<string>>(`${this.baseUrl}/PCAssembly/build/${assemblyId}/remove-component/${itemId}`);
  }

  getPCBuildStatus(assemblyId: string): Observable<GeneralResponse<{ status: string }>> {
    return this.http.get<GeneralResponse<{ status: string }>>(`${this.baseUrl}/PCAssembly/build/${assemblyId}/status`);
  }

  getPCBuildTotal(assemblyId: string): Observable<GeneralResponse<{ total: number }>> {
    return this.http.get<GeneralResponse<{ total: number }>>(`${this.baseUrl}/PCAssembly/build/${assemblyId}/total`);
  }

  getCompatibleComponents(productId: string): Observable<GeneralResponse<ProductDTO[]>> {
    return this.http.get<GeneralResponse<ProductDTO[]>>(`${this.baseUrl}/PCAssembly/build/compatible/${productId}`);
  }

  // ==================== CATEGORY APIs ====================

  getAllCategories(): Observable<GeneralResponse<CategoryDTO[]>> {
    return this.http.get<GeneralResponse<CategoryDTO[]>>(`${this.baseUrl}/Category`);
  }

  getCategoryById(id: string): Observable<GeneralResponse<CategoryDTO>> {
    return this.http.get<GeneralResponse<CategoryDTO>>(`${this.baseUrl}/Category/${id}`);
  }

  getAllSubCategories(): Observable<GeneralResponse<SubCategoryDTO[]>> {
    return this.http.get<GeneralResponse<SubCategoryDTO[]>>(`${this.baseUrl}/SubCategory`);
  }

  getSubCategoryById(id: string): Observable<GeneralResponse<SubCategoryDTO>> {
    return this.http.get<GeneralResponse<SubCategoryDTO>>(`${this.baseUrl}/SubCategory/${id}`);
  }

  getSubCategoriesByCategory(categoryId: string): Observable<GeneralResponse<SubCategoryDTO[]>> {
    return this.http.get<GeneralResponse<SubCategoryDTO[]>>(`${this.baseUrl}/SubCategory/category/${categoryId}`);
  }

  // ==================== WISHLIST APIs ====================

  getWishlist(customerId: string): Observable<GeneralResponse<WishListDTO[]>> {
    return this.http.get<GeneralResponse<WishListDTO[]>>(`${this.baseUrl}/WishList/${customerId}`);
  }

  addToWishlist(customerId: string, productId: string): Observable<GeneralResponse<string>> {
    return this.http.post<GeneralResponse<string>>(`${this.baseUrl}/WishList/${customerId}/add`, { productId });
  }

  removeFromWishlist(customerId: string, productId: string): Observable<GeneralResponse<string>> {
    return this.http.delete<GeneralResponse<string>>(`${this.baseUrl}/WishList/${customerId}/remove/${productId}`);
  }

  // ==================== DELIVERY APIs ====================

  getAllDeliveries(): Observable<GeneralResponse<DeliveryDTO[]>> {
    return this.http.get<GeneralResponse<DeliveryDTO[]>>(`${this.baseUrl}/Delivery`);
  }

  getDeliveryById(id: string): Observable<GeneralResponse<DeliveryDTO>> {
    return this.http.get<GeneralResponse<DeliveryDTO>>(`${this.baseUrl}/Delivery/${id}`);
  }

  getDeliveriesByOrder(orderId: string): Observable<GeneralResponse<DeliveryDTO[]>> {
    return this.http.get<GeneralResponse<DeliveryDTO[]>>(`${this.baseUrl}/Delivery/orders/${orderId}`);
  }

  getDeliveriesByPerson(deliveryPersonId: string): Observable<GeneralResponse<DeliveryDTO[]>> {
    return this.http.get<GeneralResponse<DeliveryDTO[]>>(`${this.baseUrl}/Delivery/person/${deliveryPersonId}`);
  }

  assignDelivery(assignment: AssignDeliveryDTO): Observable<GeneralResponse<string>> {
    return this.http.post<GeneralResponse<string>>(`${this.baseUrl}/Delivery/assign`, assignment);
  }

  updateDeliveryStatus(id: string, status: string): Observable<GeneralResponse<string>> {
    return this.http.put<GeneralResponse<string>>(`${this.baseUrl}/Delivery/${id}/status?status=${status}`, {});
  }

  // ==================== COMMISSION APIs ====================

  getAllCommissions(): Observable<GeneralResponse<CommissionDTO[]>> {
    return this.http.get<GeneralResponse<CommissionDTO[]>>(`${this.baseUrl}/Commission`);
  }

  getCommissionById(id: string): Observable<GeneralResponse<CommissionDTO>> {
    return this.http.get<GeneralResponse<CommissionDTO>>(`${this.baseUrl}/Commission/${id}`);
  }

  getCommissionsByTechCompany(techCompanyId: string): Observable<GeneralResponse<CommissionDTO[]>> {
    return this.http.get<GeneralResponse<CommissionDTO[]>>(`${this.baseUrl}/Commission/tech-company/${techCompanyId}`);
  }

  createCommission(commission: CommissionCreateDTO): Observable<GeneralResponse<string>> {
    return this.http.post<GeneralResponse<string>>(`${this.baseUrl}/Commission`, commission);
  }

  updateCommission(id: string, commission: CommissionUpdateDTO): Observable<GeneralResponse<string>> {
    return this.http.put<GeneralResponse<string>>(`${this.baseUrl}/Commission/${id}`, commission);
  }

  // ==================== NOTIFICATION APIs ====================

  getAllNotifications(): Observable<GeneralResponse<NotificationDTO[]>> {
    return this.http.get<GeneralResponse<NotificationDTO[]>>(`${this.baseUrl}/Notification`);
  }

  getNotificationById(id: string): Observable<GeneralResponse<NotificationDTO>> {
    return this.http.get<GeneralResponse<NotificationDTO>>(`${this.baseUrl}/Notification/${id}`);
  }

  getNotificationsByUser(userId: string): Observable<GeneralResponse<NotificationDTO[]>> {
    return this.http.get<GeneralResponse<NotificationDTO[]>>(`${this.baseUrl}/Notification/user/${userId}`);
  }

  createNotification(notification: NotificationCreateDTO): Observable<GeneralResponse<string>> {
    return this.http.post<GeneralResponse<string>>(`${this.baseUrl}/Notification`, notification);
  }

  markNotificationAsRead(id: string): Observable<GeneralResponse<string>> {
    return this.http.put<GeneralResponse<string>>(`${this.baseUrl}/Notification/${id}/mark-read`, {});
  }

  // ==================== IMAGE UPLOAD APIs ====================

  uploadImage(imageFile: File): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    return this.http.post<ImageUploadResponse>(`${this.baseUrl}/ImageUpload/upload`, formData);
  }

  deleteImage(imageUrl: string): Observable<GeneralResponse<string>> {
    return this.http.delete<GeneralResponse<string>>(`${this.baseUrl}/ImageUpload/delete?imageUrl=${encodeURIComponent(imageUrl)}`);
  }
} 