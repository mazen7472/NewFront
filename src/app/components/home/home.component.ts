import { Component } from '@angular/core';
import { HomeSliderComponent } from "./components/home-slider/home-slider.component";
import { HomeCategoriesComponent } from "./components/home-categories/home-categories.component";
import { HomeServicesComponent } from "./components/home-services/home-services.component";
import { HomeProductsComponent } from "./components/home-products/home-products.component";
import { HomePrandsComponent } from "./components/home-prands/home-prands.component";
import { HomeBannerComponent } from "./components/home-banner/home-banner.component";
import { HeroComponent } from './components/hero/hero.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeSliderComponent, HomeCategoriesComponent, HomeServicesComponent, HomeProductsComponent, HomePrandsComponent, HomeBannerComponent,HeroComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {
  
}
