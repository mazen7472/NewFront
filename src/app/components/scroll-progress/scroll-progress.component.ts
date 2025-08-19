import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-progress.component.html',
  styleUrls: ['./scroll-progress.component.css'],
})
export class ScrollProgressComponent implements OnInit {
  scrollValue: number = 0;
  showButton: boolean = false;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isBrowser) return;

    const pos = document.documentElement.scrollTop || document.body.scrollTop;
    const height =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;

    this.scrollValue = Math.round((pos * 100) / height);
    this.showButton = pos > 100;

    const progress = document.getElementById('progress');
    if (progress) {
      progress.style.background = `conic-gradient(var(--primary-color) ${this.scrollValue}%, transparent ${this.scrollValue}%)`;
    }
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.onWindowScroll();
    }
  }

  scrollToTop() {
    if (!this.isBrowser) return;

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}
