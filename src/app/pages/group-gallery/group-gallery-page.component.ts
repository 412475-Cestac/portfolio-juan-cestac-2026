import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { getMediaGroupBySlug, getRecommendedGroups } from '../../data/photos';
import { PhotoGridComponent } from '../../components/photo-grid/photo-grid.component';
import { MediaLightboxComponent } from '../../components/media-lightbox/media-lightbox.component';

const SECTION_TITLES: Record<string, string> = {
  events: 'Events',
  brands: 'Brands',
  'shows-night': 'Shows & Night',
  'architecture-interiors': 'Architecture & Interiors'
};

@Component({
  selector: 'app-group-gallery-page',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, PhotoGridComponent, MediaLightboxComponent],
  templateUrl: './group-gallery-page.component.html'
})
export class GroupGalleryPageComponent {
  private route = inject(ActivatedRoute);

  sectionSlug = this.route.snapshot.data['sectionSlug'] ?? '';
  groupSlug = this.route.snapshot.paramMap.get('groupSlug') ?? '';
  group = getMediaGroupBySlug(this.sectionSlug, this.groupSlug);
  relatedGroups = getRecommendedGroups(this.sectionSlug, this.groupSlug);
  sectionTitle = SECTION_TITLES[this.sectionSlug] ?? 'Portfolio';
  isDarkSection = this.sectionSlug === 'shows-night';
  isLightboxOpen = false;
  selectedIndex = 0;

  openLightbox(index: number): void {
    this.selectedIndex = index;
    this.isLightboxOpen = true;
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
  }
}
