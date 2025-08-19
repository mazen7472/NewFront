import { Pipe, PipeTransform } from '@angular/core';
import { ImageUtilityService } from '../Services/image-utility.service';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {

  constructor(private imageUtility: ImageUtilityService) {}

  /**
   * Transforms an image URL or controller name to the correct format
   * @param value - Can be a controller name, existing image URL, or object with controllerName and photoName
   * @param photoName - Optional photo name (defaults to 'photo')
   * @returns The formatted image URL
   */
  transform(value: string | { controllerName: string; photoName?: string }, photoName?: string): string {
    // If value is an object with controllerName and photoName
    if (typeof value === 'object' && value.controllerName) {
      return this.imageUtility.getImageUrl(value.controllerName, value.photoName || 'photo');
    }

    // If value is already a valid image URL, return it as is
    if (typeof value === 'string' && this.imageUtility.isValidImageUrl(value)) {
      return value;
    }

    // If value is a controller name (string)
    if (typeof value === 'string') {
      return this.imageUtility.getImageUrl(value, photoName || 'photo');
    }

    // Fallback to default placeholder
    return 'assets/Images/placeholder.png';
  }
} 