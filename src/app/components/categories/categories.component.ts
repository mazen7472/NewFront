import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { CategoryService } from '../../Services/category.service';
import { ICategoryWithProducts } from '../../Interfaces/icategory';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Array<{ id: string; name: string; imageUrl: string }> = [];
  loading = false;
  error = '';

  // Map category names to images (add more as needed)
  categoryImageMap: { [key: string]: string } = {
    'Processors': 'assets/Images/Categories/processors.png',
    'Motherboards': 'assets/Images/Categories/motherboard.png',
    'Graphics Cards': 'assets/Images/video-card-1.png',
    'Laptop': 'assets/Images/Categories/laptop.png',
    'RAM': 'assets/Images/Categories/ram.png',
    'Storage': 'assets/Images/Categories/motherboard.png',
    'Power Supply': 'assets/Images/Categories/motherboard.png',
    'Monitor': 'assets/Images/Categories/laptop.png',
    'Accessories': 'assets/Images/Categories/customer-service-1.png',
    'Case Cooler': 'assets/Images/Categories/processors.png',
    'CPU Cooler': 'assets/Images/Categories/processors.png',
    'Case': 'assets/Images/Categories/motherboard.png',
    'Expensions & Networking': 'assets/Images/Categories/customer-service-1.png',
    'SERVICES': 'assets/Images/Categories/customer-service-1.png'
  };
  fallbackImage = 'assets/Images/Categories/customer-service-1.png';

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.categories = res.data.map(cat => ({
            id: cat.id,
            name: cat.name,
            imageUrl: this.categoryImageMap[cat.name] || this.fallbackImage
          }));
        } else {
          this.error = res.message || 'Failed to load categories';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load categories.';
        this.loading = false;
      }
    });
  }

  navigateToCategory(id: string) {
    console.log(`🧭 Navigating to category: ${id}`);
    this.router.navigate(['/category-details', id]);
  }

  trackById(index: number, item: { id: string }) {
    return item.id;
  }
}
