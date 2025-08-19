import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-slider',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.css'
})
export class HomeSliderComponent {
  // Bootstrap carousel will be initialized automatically via data-bs-ride
}
