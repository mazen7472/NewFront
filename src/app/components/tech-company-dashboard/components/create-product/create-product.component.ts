import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ProductCategory,
  ProductCreateAllDTO,
  ProductPendingStatus,
  SpecificationDTO,
  WarrantyDTO
} from '../../../../Interfaces/iproduct';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../../Services/product.service';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { AddImagesComponent } from "./components/add-images/add-images.component";

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [ReactiveFormsModule, TitleCasePipe, CommonModule, AddImagesComponent],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent {

  productIdForImages: string = '';
  productCreated: boolean = false;
  form: FormGroup;
  categories = Object.values(ProductCategory);
  status = ProductPendingStatus;
  submitting = false;

  selectedImageFile: File | null = null;
  selectedImagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastr: ToastrService
  ) {
    const techCompanyId = localStorage.getItem('techCompanyId');

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      subCategoryName: [''],
      discountPrice: [0],
      techCompanyId: [techCompanyId || '', Validators.required],
      category: [ProductCategory.Motherboard, Validators.required],
      status: [ProductPendingStatus.Pending],
      specifications: this.fb.array([]),
      warranties: this.fb.array([])
    });

    if (!techCompanyId) {
      this.toastr.error('Admin ID not found in local storage.');
    }
  }

  get specifications(): FormArray {
    return this.form.get('specifications') as FormArray;
  }

  get warranties(): FormArray {
    return this.form.get('warranties') as FormArray;
  }

  addSpecification() {
    this.specifications.push(
      this.fb.group({
        key: ['', Validators.required],
        value: ['', Validators.required]
      })
    );
  }

  removeSpecification(index: number) {
    this.specifications.removeAt(index);
  }

  addWarranty() {
  this.warranties.push(
    this.fb.group({
      type: [''],
      description: [''],
      durationInMonths: [''],
      startDate: [''],
      endDate: ['']
    })
  );
}


  removeWarranty(index: number) {
    this.warranties.removeAt(index);
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting = true;

    const { category, status, specifications, warranties, ...productValues } = this.form.value;

    const dto: ProductCreateAllDTO = {
      product: { ...productValues, specifications: [], warranties: [] },
      warrantiesSpecs: {
        specifications: specifications.map((s: any) => ({ key: s.key, value: s.value })),
        warranties: warranties.map((w: any) => ({
          type: w.type,
          duration: w.durationInMonths,
          description: w.description,
          startDate: new Date(w.startDate).toISOString(),
          endDate: new Date(w.endDate).toISOString()
        }))
      }
    };

    this.productService.addProduct(dto, category, status).subscribe({
      next: (res) => {
        this.productIdForImages = res.data.id;
        this.toastr.success(res.message);

        // Hide the form and show the add-images component
        this.productCreated = true;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Something went wrong');
      },
      complete: () => (this.submitting = false)
    });
  }
// Called from AddImagesComponent
onResetForm() {
  this.productCreated = false;
  this.productIdForImages = '';

  // Reset form values
  this.form.reset({
    name: '',
    price: 0,
    stock: 0,
    discountPrice: 0,
    subCategoryName: '',
    description: '',
    techCompanyId: localStorage.getItem('techCompanyId') || '',
    category: ProductCategory.Motherboard,
    status: ProductPendingStatus.Pending
  });

  // Clear FormArrays safely
  while (this.specifications.length) this.specifications.removeAt(0);
  while (this.warranties.length) this.warranties.removeAt(0);

  // Ensure submitting flag is reset
  this.submitting = false;
}


}
