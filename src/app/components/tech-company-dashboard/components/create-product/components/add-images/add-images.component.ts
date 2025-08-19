import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../../../../../../Services/product.service';
import { ToastrService } from 'ngx-toastr';
import { FilePreviewPipe } from '../../../../../../Pipes/transform.pipe';

@Component({
  selector: 'app-add-images',
  standalone: true,
  imports: [FilePreviewPipe],
  templateUrl: './add-images.component.html',
  styleUrl: './add-images.component.css'
})
export class AddImagesComponent {
  @Input() productIdForImages!: string;
  @Output() resetForm = new EventEmitter<void>(); // <-- Event to notify parent

  selectedMainImage: File | null = null;
  selectedExtraImages: File[] = [];

  private productService = inject(ProductService);
  private toastr = inject(ToastrService);

  onMainImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.selectedMainImage = file;
  }

  onExtraImagesSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.selectedExtraImages = Array.from(files);
    }
  }

  uploadImages() {
    if (!this.productIdForImages || !this.selectedMainImage) {
      this.toastr.error('Please select the main image.');
      return;
    }

    const formData = new FormData();
    formData.append('ImageUrl', this.selectedMainImage); // Single main image
    this.selectedExtraImages.forEach(file => formData.append('ImageUrls', file));

    this.productService.uploadImage(this.productIdForImages, formData).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success('Images uploaded successfully!');
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Failed to upload images.');
      }
    });
  }

  // Reset and go back to create form
  goBack() {
  // Clear local state
  this.selectedMainImage = null;
  this.selectedExtraImages = [];
  this.productIdForImages = '';

  // Clear the file input values visually
  const mainInput = document.querySelector<HTMLInputElement>('input[type="file"]');
  if (mainInput) mainInput.value = '';

  // Notify parent to show the form again
  this.resetForm.emit();
}

}
