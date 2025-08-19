import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralProfileReadDTO } from '../../../../Interfaces/GenProfileInterfaces/GeneralProfileReadDTO';
import { ProfilesService } from '../../../../Services/profiles.service';
import { CustomerProfileDetailsComponent } from '../../Components/customer-profile-details/customer-profile-details.component';
import { TechCompanyProfileDetailsComponent } from '../../Components/techcompany-profile-details/techcompany-profile-details.component';
import { DeliveryPersonProfileDetailsComponent } from '../../Components/deliveryperson-profile-details/deliveryperson-profile-details.component';
import { NgIf } from '@angular/common';
import { ChatComponent } from "./chat/chat.component";


@Component({
  standalone: true,
  selector: 'app-profile-details',
  imports: [CustomerProfileDetailsComponent, TechCompanyProfileDetailsComponent, DeliveryPersonProfileDetailsComponent, NgIf, ChatComponent],
  templateUrl: './profile-details.component.html'
})
export class ProfileDetailsComponent implements OnInit {
  profile?: GeneralProfileReadDTO;
  userId!: string;
  loading = true;

  constructor(private route: ActivatedRoute, private profileService: ProfilesService) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfileById(this.userId).subscribe({
      next: (data) => {
        this.profile = data.data;
        this.loading = false;
        console.log(data);
      },
      error: (err) => {
        console.error('Error fetching profile', err);
        this.loading = false;
      }
    });
  }
}