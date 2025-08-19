import { Component, Input, OnInit } from '@angular/core';
import { DeliveryPersonProfileDTO } from '../../../../Interfaces/GenProfileInterfaces/DeliveryPersonProfileDTO';
import { ProfilesService } from '../../../../Services/profiles.service';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgIf],
  selector: 'app-deliveryperson-profile-details',
  templateUrl: './deliveryperson-profile-details.component.html'
})
export class DeliveryPersonProfileDetailsComponent implements OnInit {
  @Input() userId!: string | undefined;
  deliveryPerson?: DeliveryPersonProfileDTO;

  constructor(private profileService: ProfilesService) {}

  ngOnInit(): void {
    this.profileService.getDeliveryPersonProfile(this.userId).subscribe({
      next: (data) => (this.deliveryPerson = data.data),
      error: (err) => console.error('Error loading delivery profile', err)
    });
  }
}