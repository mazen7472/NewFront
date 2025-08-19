import { Injectable } from '@angular/core';
import { Environment } from '../Environment/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageUtilityService {

  constructor(private _HttpClient: HttpClient) { }

  /**
   * Constructs an image URL according to the pattern: localhost/7230/assets/controllername/photo
   * @param controllerName - The controller name (e.g., 'product', 'category', 'profile')
   * @param photoName - The photo filename (optional, defaults to 'photo')
   * @returns The complete image URL
   */
  getImageUrl(controllerName: string, photoName: string = 'photo'): string {
    const baseUrl = Environment.useHttps ? 'https://localhost:7230' : 'http://localhost:7230';
    return `${baseUrl}/assets/${controllerName}/${photoName}`;
  }

  /**
   * Constructs a product image URL
   * @param productId - The product ID
   * @param photoName - The photo filename (optional, defaults to 'photo')
   * @returns The complete product image URL
   */
  getProductImageUrl(productId: string, photoName: string = 'photo'): string {
    return this.getImageUrl('product', photoName);
  }

  /**
   * Constructs a category image URL
   * @param categoryId - The category ID
   * @param photoName - The photo filename (optional, defaults to 'photo')
   * @returns The complete category image URL
   */
  getCategoryImageUrl(categoryId: string, photoName: string = 'photo'): string {
    return this.getImageUrl('category', photoName);
  }

  /**
   * Constructs a subcategory image URL
   * @param subCategoryId - The subcategory ID
   * @param photoName - The photo filename (optional, defaults to 'photo')
   * @returns The complete subcategory image URL
   */
  getSubCategoryImageUrl(subCategoryId: string, photoName: string = 'photo'): string {
    return this.getImageUrl('subcategory', photoName);
  }

  /**
   * Constructs a profile image URL
   * @param userId - The user ID
   * @param photoName - The photo filename (optional, defaults to 'photo')
   * @returns The complete profile image URL
   */
  getProfileImageUrl(userId: string | null, photoName: string = 'photo'): string {
    return this.getImageUrl('profile', photoName);
  }

  /**
   * Constructs a brand image URL
   * @param brandId - The brand ID
   * @param photoName - The photo filename (optional, defaults to 'photo')
   * @returns The complete brand image URL
   */
  getBrandImageUrl(brandId: string, photoName: string = 'photo'): string {
    return this.getImageUrl('brand', photoName);
  }

  /**
   * Constructs a custom controller image URL
   * @param controllerName - The custom controller name
   * @param photoName - The photo filename (optional, defaults to 'photo')
   * @returns The complete image URL
   */
  getCustomImageUrl(controllerName: string, photoName: string = 'photo'): string {
    return this.getImageUrl(controllerName, photoName);
  }

  /**
   * Validates if an image URL follows the expected pattern
   * @param imageUrl - The image URL to validate
   * @returns True if the URL follows the expected pattern
   */
  isValidImageUrl(imageUrl: string): boolean {
    const expectedPattern = /^https?:\/\/localhost:7230\/assets\/[^\/]+\/[^\/]+$/;
    return expectedPattern.test(imageUrl);
  }

  /**
   * Extracts controller name from an image URL
   * @param imageUrl - The image URL
   * @returns The controller name or null if not found
   */
  extractControllerName(imageUrl: string): string | null {
    const match = imageUrl.match(/\/assets\/([^\/]+)\//);
    return match ? match[1] : null;
  }

  /**
   * Extracts photo name from an image URL
   * @param imageUrl - The image URL
   * @returns The photo name or null if not found
   */
  extractPhotoName(imageUrl: string): string | null {
    const match = imageUrl.match(/\/assets\/[^\/]+\/([^\/]+)$/);
    return match ? match[1] : null;
  }

  /**
   * Gets profile image URL from backend API (for dynamic profile images)
   * @param userId - The user ID
   * @param photoName - The photo filename (optional, defaults to 'photo')
   * @returns Observable of the profile image URL
   */
  getProfileImageUrlFromAPI(userId: string | null, photoName: string = 'photo'): Observable<string> {
    return this._HttpClient.get<string>(`${Environment.baseImageUrl}ImageUpload/GetProfileImage?userId=${userId}&photoName=${photoName}`);
  }
} 