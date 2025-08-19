import { Component } from '@angular/core';

@Component({
  selector: 'app-home-categories',
  standalone: true,
  imports: [],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.css'
})
export class HomeCategoriesComponent {
  categories = [
    { label: 'SERVICES', imageUrl: '../../../../../assets/Images/Categories/customer-service-1.png' },
    { label: 'Processors ', imageUrl: '../../../../../assets/Images/Categories/processors.png' },
    { label: 'Mother Boards', imageUrl: '../../../../../assets/Images/Categories/motherboard.png' },
    { label: 'Graphics Cards', imageUrl: '../../../../../assets/Images/Categories/video-card.png' },
    { label: 'LapTop', imageUrl: '../../../../../assets/Images/Categories/laptop.png' },
    { label: 'Ram', imageUrl: '../../../../../assets/Images/Categories/ram.png' }
  ];
}
