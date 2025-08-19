import { Component, Input, OnInit } from '@angular/core';
import { CustomerProfileDTO } from '../../../../Interfaces/GenProfileInterfaces/CustomerProfileDTO';
import { ProfilesService } from '../../../../Services/profiles.service';
import { NgIf } from '@angular/common';
import { GeneralResponse } from '../../../../Interfaces/iorder';


@Component({
  standalone: true,
  imports: [NgIf],
  selector: 'app-customer-profile-details',
  templateUrl: './customer-profile-details.component.html'
})
export class CustomerProfileDetailsComponent implements OnInit {
  @Input() userId!: string | undefined;
  customer?: CustomerProfileDTO;

  constructor(private profileService: ProfilesService) {}

  ngOnInit(): void {
    this.profileService.getCustomerProfile(this.userId).subscribe({
      next: (data) => (this.customer = data.data),
      error: (err) => console.error('Error loading customer profile', err)
    });
  }
}