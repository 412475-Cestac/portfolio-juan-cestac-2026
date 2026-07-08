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
  activeBackgroundImageUrl = 'assets/media/Portadas/shows/SHOWS/YSY A/DSC04824-2.webp';
  previousBackgroundImageUrl = '';
  isFadingBackground = false;
  private fadeTimeout?: ReturnType<typeof setTimeout>;

  quickLinks: HomeLink[] = [
    {
      label: 'Shows & Night',
      path: '/shows-night',
      backgroundImageUrl: 'assets/media/Portadas/shows/SHOWS/YSY A/DSC04824-2.webp'
    },
    {
      label: 'Events',
      path: '/events',
      backgroundImageUrl: 'assets/media/Portadas/events/EVENTS/PAPAGAYO/DSC04727.webp'
    },
    {
      label: 'Brands',
      path: '/brands',
      backgroundImageUrl: 'assets/media/Portadas/brands/BRANDS/VICTORY/PORTADA VICTORY.webp'
    },
    {
      label: 'Architecture & Interiors',
      path: '/architecture-interiors',
      backgroundImageUrl: 'assets/media/architecture-interiors/ARCHITECTURE . INTERIORS/DSC08890.webp'
    },
    {
      label: 'Contact',
      path: '/contact',
      backgroundImageUrl: 'assets/media/contact/contact.webp'
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
