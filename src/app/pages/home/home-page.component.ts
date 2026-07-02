import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

type HomeLink = {
  label: string;
  path: string;
  videoMobileUrl: string;
  videoDesktopUrl: string;
  posterUrl: string;
};

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  @ViewChild('heroVideo') private heroVideo?: ElementRef<HTMLVideoElement>;

  defaultVideoUrl = 'assets/media/home/shows-night-desktop.mp4';
  defaultPosterUrl = 'assets/media/home/shows-night-poster.webp';
  activeVideoUrl = this.defaultVideoUrl;
  activePosterUrl = this.defaultPosterUrl;
  shouldLoadVideo = false;
  private activeLink?: HomeLink;
  private observer?: IntersectionObserver;

  quickLinks: HomeLink[] = [
    {
      label: 'Shows & Night',
      path: '/shows-night',
      videoMobileUrl: 'assets/media/home/shows-night-mobile.mp4',
      videoDesktopUrl: 'assets/media/home/shows-night-desktop.mp4',
      posterUrl: 'assets/media/home/shows-night-poster.webp'
    },
    {
      label: 'Eventos',
      path: '/events',
      videoMobileUrl: 'assets/media/home/events-mobile.mp4',
      videoDesktopUrl: 'assets/media/home/events-desktop.mp4',
      posterUrl: 'assets/media/home/events-poster.webp'
    },
    {
      label: 'Marcas',
      path: '/brands',
      videoMobileUrl: 'assets/media/home/brands-mobile.mp4',
      videoDesktopUrl: 'assets/media/home/brands-desktop.mp4',
      posterUrl: 'assets/media/home/brands-poster.webp'
    },
    {
      label: 'Arquitectura e Interiores',
      path: '/architecture-interiors',
      videoMobileUrl: 'assets/media/home/architecture-interiors-mobile.mp4',
      videoDesktopUrl: 'assets/media/home/architecture-interiors-desktop.mp4',
      posterUrl: 'assets/media/home/architecture-interiors-poster.webp'
    },
    {
      label: 'Contacto',
      path: '/contact',
      videoMobileUrl: 'assets/media/home/contact-mobile.mp4',
      videoDesktopUrl: 'assets/media/home/contact-desktop.mp4',
      posterUrl: 'assets/media/home/contact-poster.webp'
    }
  ];

  constructor() {
    this.activeLink = this.quickLinks[0];
    this.activeVideoUrl = this.resolveVideoUrl(this.activeLink);
  }

  ngAfterViewInit(): void {
    const video = this.heroVideo?.nativeElement;

    if (!video || typeof IntersectionObserver === 'undefined') {
      this.shouldLoadVideo = true;
      return;
    }

    this.observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        return;
      }

      this.shouldLoadVideo = true;
      this.observer?.disconnect();
    }, { rootMargin: '200px' });

    this.observer.observe(video);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  setActiveVideo(link: HomeLink): void {
    this.activeLink = link;
    this.activePosterUrl = link.posterUrl;
    this.activeVideoUrl = this.resolveVideoUrl(link);
  }

  private resolveVideoUrl(link: HomeLink): string {
    if (typeof window === 'undefined') {
      return link.videoDesktopUrl;
    }

    return window.innerWidth < 768 ? link.videoMobileUrl : link.videoDesktopUrl;
  }
}
