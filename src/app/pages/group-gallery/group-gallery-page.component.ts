import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { getMediaGroupBySlug, getRecommendedGroups } from '../../data/photos';
import { MediaGroup, PortfolioGroup } from '../../models/media.model';
import { PhotoGridComponent } from '../../components/photo-grid/photo-grid.component';
import { MediaLightboxComponent } from '../../components/media-lightbox/media-lightbox.component';

const SECTION_TITLES: Record<string, string> = {
  events: 'Eventos',
  brands: 'Marcas',
  'shows-night': 'Shows & Night',
  'architecture-interiors': 'Arquitectura e Interiores',
  'personal-work': 'Trabajo personal'
};

const SECTION_THEMES: Record<string, {
  pageClass: string;
  backClass: string;
  eyebrowClass: string;
  headingClass: string;
  descriptionClass: string;
  borderClass: string;
  relatedCardClass: string;
}> = {
  events: {
    pageClass: 'bg-[radial-gradient(circle_at_12%_6%,_rgba(180,83,9,0.13),_transparent_30%),linear-gradient(180deg,_#fffbeb_0%,_#f5f5f4_48%,_#d6d3d1_100%)] text-stone-950',
    backClass: 'text-stone-600 hover:text-stone-950',
    eyebrowClass: 'text-stone-500',
    headingClass: 'text-stone-950',
    descriptionClass: 'text-stone-600',
    borderClass: 'border-stone-200',
    relatedCardClass: 'ring-1 ring-stone-900/10 shadow-[0_24px_80px_rgba(68,64,60,0.12)]'
  },
  brands: {
    pageClass: 'bg-[radial-gradient(circle_at_82%_8%,_rgba(214,211,209,0.75),_transparent_28%),linear-gradient(180deg,_#fafaf9_0%,_#f5f5f4_46%,_#e7e5e4_100%)] text-neutral-950',
    backClass: 'text-neutral-500 hover:text-neutral-950',
    eyebrowClass: 'text-neutral-500',
    headingClass: 'text-neutral-950',
    descriptionClass: 'text-neutral-600',
    borderClass: 'border-neutral-200',
    relatedCardClass: 'ring-1 ring-neutral-900/10 shadow-[0_20px_70px_rgba(23,23,23,0.08)]'
  },
  'shows-night': {
    pageClass: 'bg-[radial-gradient(circle_at_12%_0%,_rgba(51,65,85,0.92),_transparent_34%),radial-gradient(circle_at_85%_70%,_rgba(30,41,59,0.72),_transparent_34%),linear-gradient(180deg,_#020617_0%,_#0f172a_48%,_#020617_100%)] text-white',
    backClass: 'text-slate-300 hover:text-white',
    eyebrowClass: 'text-slate-400',
    headingClass: 'text-white',
    descriptionClass: 'text-slate-300',
    borderClass: 'border-slate-800',
    relatedCardClass: 'ring-1 ring-white/10 shadow-[0_24px_90px_rgba(0,0,0,0.38)]'
  },
  'architecture-interiors': {
    pageClass: 'bg-[linear-gradient(135deg,_rgba(255,255,255,0.85)_0%,_transparent_32%),linear-gradient(180deg,_#fafafa_0%,_#e7e5e4_55%,_#d4d4d8_100%)] text-zinc-950',
    backClass: 'text-zinc-500 hover:text-zinc-950',
    eyebrowClass: 'text-zinc-500',
    headingClass: 'text-zinc-950',
    descriptionClass: 'text-zinc-600',
    borderClass: 'border-zinc-200',
    relatedCardClass: 'ring-1 ring-zinc-900/10 shadow-[0_22px_76px_rgba(39,39,42,0.1)]'
  },
  'personal-work': {
    pageClass: 'bg-[linear-gradient(180deg,_#f5f5f4_0%,_#e7e5e4_52%,_#d6d3d1_100%)] text-neutral-950',
    backClass: 'text-neutral-500 hover:text-neutral-950',
    eyebrowClass: 'text-neutral-500',
    headingClass: 'text-neutral-950',
    descriptionClass: 'text-neutral-600',
    borderClass: 'border-neutral-200',
    relatedCardClass: 'ring-1 ring-neutral-900/10 shadow-[0_24px_70px_rgba(64,64,64,0.12)]'
  }
};

@Component({
  selector: 'app-group-gallery-page',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, RouterLink, PhotoGridComponent, MediaLightboxComponent],
  templateUrl: './group-gallery-page.component.html'
})
export class GroupGalleryPageComponent {
  private route = inject(ActivatedRoute);

  sectionSlug = '';
  groupSlug = '';
  group: MediaGroup | undefined;
  relatedGroups: PortfolioGroup[] = [];
  sectionTitle = 'Portfolio';
  theme = SECTION_THEMES['brands'];
  isDarkSection = false;
  isLightboxOpen = false;
  selectedIndex = 0;

  constructor() {
    combineLatest([this.route.paramMap, this.route.data])
      .pipe(takeUntilDestroyed())
      .subscribe(([params, data]) => {
        this.sectionSlug = data['sectionSlug'] ?? '';
        this.groupSlug = params.get('groupSlug') ?? '';
        this.group = getMediaGroupBySlug(this.sectionSlug, this.groupSlug);
        this.relatedGroups = getRecommendedGroups(this.sectionSlug, this.groupSlug);
        this.sectionTitle = SECTION_TITLES[this.sectionSlug] ?? 'Portfolio';
        this.theme = SECTION_THEMES[this.sectionSlug] ?? SECTION_THEMES['brands'];
        this.isDarkSection = this.sectionSlug === 'shows-night';
        this.isLightboxOpen = false;
        this.selectedIndex = 0;
      });
  }

  openLightbox(index: number): void {
    this.selectedIndex = index;
    this.isLightboxOpen = true;
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
  }
}
