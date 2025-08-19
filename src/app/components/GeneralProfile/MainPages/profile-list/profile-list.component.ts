import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ProfilesService } from '../../../../Services/profiles.service';
import { GeneralProfileReadDTO } from '../../../../Interfaces/GenProfileInterfaces/GeneralProfileReadDTO';
import { Environment } from '../../../../Environment/environment';

@Component({
  standalone: true,
  selector: 'app-profile-list',
  imports: [NgIf, NgFor],
  templateUrl: './profile-list.component.html'
})
export class ProfileListComponent implements OnInit {
  profiles: GeneralProfileReadDTO[] = [];
  loading = true;

  private _router = inject(Router);
  private _profilesService = inject(ProfilesService);

  ngOnInit(): void {
    this._profilesService.getAllProfiles().subscribe({
      next: (res) => {
        this.profiles = res?.data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching profiles', err);
        this.loading = false;
      }
    });
  }

  viewDetails(userId: string): void {
    this._router.navigate(['/profile-details', userId]);
  }

  /**
   * Return the correct profile photo URL
   * - If API returns a full URL, use it
   * - If API returns a relative file/path, prefix with backend base
   * - Fallback to local asset
   */
  getPhotoUrl(profile: GeneralProfileReadDTO): string {
    const raw = profile?.profilePhotoUrl?.toString().trim() || '';
    if (!raw) return 'assets/default-user.png';

    if (/^https?:\/\//i.test(raw)) return raw;

    const backendBase = Environment.baseImageUrl.replace(/\/+$/, '');
    const cleaned = raw.replace(/^\/+/, '');
    return `${backendBase}/${cleaned}`;
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/default-user.png';
  }

  trackByUserId = (_: number, p: GeneralProfileReadDTO) => p.userId;
}