import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  defaultVideoUrl = 'assets/videos/home/shows-night.mp4';
  activeVideoUrl = this.defaultVideoUrl;

  quickLinks = [
    { label: 'shows & night', path: '/shows-night', videoUrl: 'assets/videos/home/shows-night.mp4' },
    { label: 'eventos', path: '/events', videoUrl: 'assets/videos/home/events.mp4' },
    { label: 'marcas', path: '/brands', videoUrl: 'assets/videos/home/brands.mp4' },
    {
      label: 'arquitectura e interiores',
      path: '/architecture-interiors',
      videoUrl: 'assets/videos/home/architecture-interiors.mp4'
    },
    { label: 'contacto', path: '/contact', videoUrl: 'assets/videos/home/contact.mp4' }
  ];

  setActiveVideo(videoUrl: string): void {
    this.activeVideoUrl = videoUrl;
  }
}
