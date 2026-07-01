import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { EventsPageComponent } from './pages/events/events-page.component';
import { BrandsPageComponent } from './pages/brands/brands-page.component';
import { ShowsNightPageComponent } from './pages/shows-night/shows-night-page.component';
import { ArchitectureInteriorsPageComponent } from './pages/architecture-interiors/architecture-interiors-page.component';
import { ContactPageComponent } from './pages/contact/contact-page.component';
import { GroupGalleryPageComponent } from './pages/group-gallery/group-gallery-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'events', component: EventsPageComponent },
  { path: 'events/:groupSlug', component: GroupGalleryPageComponent, data: { sectionSlug: 'events' } },
  { path: 'brands', component: BrandsPageComponent },
  { path: 'brands/:groupSlug', component: GroupGalleryPageComponent, data: { sectionSlug: 'brands' } },
  { path: 'shows-night', component: ShowsNightPageComponent },
  { path: 'shows-night/:groupSlug', component: GroupGalleryPageComponent, data: { sectionSlug: 'shows-night' } },
  { path: 'architecture-interiors', component: ArchitectureInteriorsPageComponent },
  { path: 'architecture-interiors/:groupSlug', component: GroupGalleryPageComponent, data: { sectionSlug: 'architecture-interiors' } },
  { path: 'contact', component: ContactPageComponent },
  { path: '**', redirectTo: '' }
];
