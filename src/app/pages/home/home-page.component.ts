import { Component, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

type HomeLink = {
  label: string;
  path: string;
  backgroundImageUrl: string;
};

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  activeBackgroundImageUrl = 'assets/media/performance/home/shows-night.webp';
  previousBackgroundImageUrl = '';
  isFadingBackground = false;
  private fadeTimeout?: ReturnType<typeof setTimeout>;

  quickLinks: HomeLink[] = [
    {
      label: 'Shows & Night',
      path: '/shows-night',
      backgroundImageUrl: 'assets/media/performance/home/shows-night.webp'
    },
    {
      label: 'Events',
      path: '/events',
      backgroundImageUrl: 'assets/media/performance/home/events.webp'
    },
    {
      label: 'Brands',
      path: '/brands',
      backgroundImageUrl: 'assets/media/performance/home/brands.webp'
    },
    {
      label: 'Architecture & Interiors',
      path: '/architecture-interiors',
      backgroundImageUrl: 'assets/media/performance/home/architecture-interiors.webp'
    },
    {
      label: 'Contact',
      path: '/contact',
      backgroundImageUrl: 'assets/media/performance/home/contact.webp'
    }
  ];

  constructor() {
    this.preloadBackgroundImages();
  }

  ngOnDestroy(): void {
    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
    }
  }

  setActiveBackground(link: HomeLink): void {
    if (link.backgroundImageUrl === this.activeBackgroundImageUrl) {
      return;
    }

    this.previousBackgroundImageUrl = this.activeBackgroundImageUrl;
    this.activeBackgroundImageUrl = link.backgroundImageUrl;
    this.isFadingBackground = true;

    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
    }

    this.fadeTimeout = setTimeout(() => {
      this.isFadingBackground = false;
      this.previousBackgroundImageUrl = '';
    }, 600);
  }

  private preloadBackgroundImages(): void {
    if (typeof Image === 'undefined') {
      return;
    }

    this.quickLinks.forEach((link) => {
      const image = new Image();
      image.src = link.backgroundImageUrl;
    });
  }
}
