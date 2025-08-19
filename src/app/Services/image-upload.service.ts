import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';
import { ImageUtilityService } from './image-utility.service';

export interface ImageUploadRequest {
  file: File;
  controllerName: string;
}

export interface ImageUploadResponse {
  success: boolean;
  message: string;
  data?: {
    imageUrl: string;
    fileName: string;
  };
}

export interface ImageValidationResponse {
  success: boolean;
  message: string;
  data?: {
    isValid: boolean;
    errors?: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private apiUrl = `${Environment.baseImageUrl}/ImageUpload`;

  constructor(
    private http: HttpClient,
    private imageUtility: ImageUtilityService
  ) {}

  // Upload image
  uploadImage(file: File, controllerName: string): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<ImageUploadResponse>(`${this.apiUrl}/upload/${controllerName}`, formData);
  }

  // Delete image
  deleteImage(imageUrl: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`, { 
      body: { imageUrl } 
    });
  }

  // Validate image
  validateImage(file: File): Observable<ImageValidationResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<ImageValidationResponse>(`${this.apiUrl}/validate`, formData);
  }

  // Upload product image
  uploadProductImage(file: File, productId: string): Observable<ImageUploadResponse> {
    return this.uploadImage(file, 'product');
  }

  // Upload category image
  uploadCategoryImage(file: File, categoryId: string): Observable<ImageUploadResponse> {
    return this.uploadImage(file, 'category');
  }

  // Upload subcategory image
  uploadSubCategoryImage(file: File, subCategoryId: string): Observable<ImageUploadResponse> {
    return this.uploadImage(file, 'subcategory');
  }

  // Delete product image
  deleteProductImage(productId: string): Observable<any> {
    return this.http.delete(`${Environment.baseUrl}/Product/${productId}/delete-image`);
  }

  // Delete category image
  deleteCategoryImage(categoryId: string): Observable<any> {
    return this.http.delete(`${Environment.baseUrl}/Category/${categoryId}/delete-image`);
  }

  // Delete subcategory image
  deleteSubCategoryImage(subCategoryId: string): Observable<any> {
    return this.http.delete(`${Environment.baseUrl}/SubCategory/${subCategoryId}/delete-image`);
  }

  /**
   * Constructs an image URL according to the pattern: localhost/7230/assets/controllername/photo
   * @param controllerName - The controller name (e.g., 'product', 'category', 'profile')
   * @param photoName - The photo filename (optional, defaults to 'photo')
   * @returns The complete image URL
   */
  constructImageUrl(controllerName: string, photoName: string = 'photo'): string {
    return this.imageUtility.getImageUrl(controllerName, photoName);
  }

  /**
   * Constructs a product image URL
   * @param productId - The product ID
   * @param photoName - The photo filename (optional, defaults to 'photo')
   * @returns The complete product image URL
   */
  constructProductImageUrl(productId: string, photoName: string = 'photo'): string {
    return this.imageUtility.getProductImageUrl(productId, photoName);
  }

  /**
   * Constructs a category image URL
   * @param categoryId - The category ID
   * @param photoName - The photo filename (optional, defaults to 'photo')
   * @returns The complete category image URL
   */
  constructCategoryImageUrl(categoryId: string, photoName: string = 'photo'): string {
    return this.imageUtility.getCategoryImageUrl(categoryId, photoName);
  }

  /**
   * Constructs a profile image URL
   * @param userId - The user ID
   * @param photoName - The photo filename (optional, defaults to 'photo')
   * @returns The complete profile image URL
   */
  constructProfileImageUrl(userId: string, photoName: string = 'photo'): string {
    return this.imageUtility.getProfileImageUrl(userId, photoName);
  }
} 