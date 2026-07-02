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
    { label: 'SHOWS & NIGHT', path: '/shows-night', videoUrl: 'assets/videos/home/shows-night.mp4' },
    { label: 'EVENTOS', path: '/events', videoUrl: 'assets/videos/home/events.mp4' },
    { label: 'MARCAS', path: '/brands', videoUrl: 'assets/videos/home/brands.mp4' },
    {
      label: 'ARQUITECTURA E INTERIORES',
      path: '/architecture-interiors',
      videoUrl: 'assets/videos/home/architecture-interiors.mp4'
    },
    { label: 'CONTACTO', path: '/contact', videoUrl: 'assets/videos/home/contact.mp4' }
  ];

  setActiveVideo(videoUrl: string): void {
    this.activeVideoUrl = videoUrl;
  }
}
