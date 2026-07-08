export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  sectionSlug: string;
  groupSlug: string;
  src: string;
  type: MediaType;
  poster?: string;
  description?: string;
}

export interface MediaGroup {
  title: string;
  slug: string;
  sectionSlug: string;
  year?: string;
  description?: string;
  coverSrc: string;
  coverType: MediaType;
  items: MediaItem[];
}

export interface PortfolioGroup {
  id: string;
  title: string;
  slug: string;
  sectionSlug: string;
  year?: string;
  description?: string;
  coverImage: string;
  coverType: MediaType;
}
