import { Component, Input, OnInit } from '@angular/core';
import { TechCompanyProfileDTO } from '../../../../Interfaces/GenProfileInterfaces/TechCompanyProfileDTO';
import { ProfilesService } from '../../../../Services/profiles.service';
import { NgFor, NgIf } from '@angular/common';


@Component({
  standalone: true,
  imports: [NgIf,NgFor],
  selector: 'app-techcompany-profile-details',
  templateUrl: './techcompany-profile-details.component.html'
})
export class TechCompanyProfileDetailsComponent implements OnInit {
  @Input() userId!: string | undefined;
  company?: TechCompanyProfileDTO;

  constructor(private profileService: ProfilesService) {}

  ngOnInit(): void {
    this.profileService.getTechCompanyProfile(this.userId).subscribe({
      next: (data) => (this.company = data.data),
      error: (err) => console.error('Error loading company profile', err)
    });
  }
}