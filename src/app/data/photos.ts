import { MediaGroup, MediaItem, MediaType, PortfolioGroup } from '../models/media.model';

type MediaInput = Omit<MediaItem, 'type' | 'sectionSlug' | 'groupSlug'> & {
  groupSlug?: string;
  sectionSlug?: string;
  type?: MediaType;
};

type GroupConfig = {
  title?: string;
  description: string;
  coverImage?: string;
  coverType?: MediaType;
};

export function getMediaType(src: string): MediaType {
  const extension = src.split('.').pop()?.toLowerCase();

  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'].includes(extension ?? '')) {
    return 'image';
  }

  if (['mp4', 'webm', 'mov'].includes(extension ?? '')) {
    return 'video';
  }

  return 'image';
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getOptimizedMediaSrc(src: string): string {
  const mediaType = getMediaType(src);

  if (mediaType === 'video' && !src.endsWith('.mp4')) {
    return src;
  }

  const optimizedSrc = mediaType === 'image' ? src.replace(/\.(jpe?g|png|webp)$/i, '.webp') : src;

  if (optimizedSrc.startsWith('assets/images/brands/')) {
    return optimizedSrc.replace('assets/images/brands/', 'assets/media/');
  }

  if (optimizedSrc.startsWith('assets/images/shows-night/')) {
    return optimizedSrc.replace('assets/images/shows-night/', 'assets/media/');
  }

  if (optimizedSrc.startsWith('assets/images/events/')) {
    return optimizedSrc.replace('assets/images/events/', 'assets/media/events/');
  }

  if (optimizedSrc.startsWith('assets/images/architecture-interiors/')) {
    return optimizedSrc.replace('assets/images/architecture-interiors/', 'assets/media/architecture-interiors/');
  }

  return optimizedSrc;
}

const createMediaItem = (item: MediaInput): MediaItem => {
  const src = getOptimizedMediaSrc(item.src);

  return {
    ...item,
    src,
    sectionSlug: item.sectionSlug ?? item.category,
    groupSlug: item.groupSlug ?? slugify(item.subcategory ?? item.category),
    type: item.type ?? getMediaType(src)
  };
};

const groupKey = (sectionSlug: string, title: string): string => `${sectionSlug}/${title}`;

const GROUP_CONFIG: Record<string, GroupConfig> = {
  [groupKey('events', 'Papagayo')]: { description: 'Selección de fotografía' },
  [groupKey('events', 'Redbull x La Fabrica')]: {
    description: 'Selección de video',
    coverImage: 'assets/media/events/EVENTS/REDBULL X LA FABRICA/cover.webp'
  },
  [groupKey('events', 'Mola')]: {
    description: 'Selección de video',
    coverImage: 'assets/media/events/EVENTS/MOLA/cover.webp'
  },
  [groupKey('events', 'Meed x Session')]: {
    description: 'Selección de video',
    coverImage: 'assets/media/events/EVENTS/MEED X SESSION/cover.webp'
  },
  [groupKey('brands', 'Caffuchinos')]: { description: 'Selección de fotografía' },
  [groupKey('brands', 'Paprika')]: { description: 'Selección de fotografía' },
  [groupKey('brands', 'Mas Indumentaria')]: { title: 'Más', description: 'Selección de fotografía' },
  [groupKey('brands', 'Di Coccia')]: { description: 'Selección de fotografía' },
  [groupKey('brands', 'Mante')]: {
    description: 'Selección de video',
    coverImage: 'assets/media/BRANDS/MANTE/cover.webp'
  },
  [groupKey('brands', 'Victory')]: {
    description: 'Selección de video',
    coverImage: 'assets/media/BRANDS/VICTORY/cover.webp'
  },
  [groupKey('shows-night', 'YSY A')]: { description: 'Selección de fotografía' },
  [groupKey('shows-night', 'Hernan Cattaneo')]: { description: 'Selección de video' },
  [groupKey('shows-night', 'Amelie Lens')]: {
    description: 'Selección de video',
    coverImage: 'assets/media/SHOWS . NIGHT/AMELIE LENS/cover.webp'
  },
  [groupKey('shows-night', 'Argy')]: {
    description: 'Selección de video',
    coverImage: 'assets/media/SHOWS . NIGHT/ARGY/cover.webp'
  },
  [groupKey('shows-night', 'Konstantin Sibold - Adam Sellouk')]: {
    description: 'Selección de video',
    coverImage: 'assets/media/SHOWS . NIGHT/KONSTANTIN SIBOLD - ADAM SELLOUK/cover.webp'
  },
  [groupKey('shows-night', 'Mau P')]: {
    description: 'Selección de video',
    coverImage: 'assets/media/SHOWS . NIGHT/MAU P/cover.webp'
  },
  [groupKey('shows-night', 'Rufus Du Sol')]: {
    description: 'Selección de video',
    coverImage: 'assets/media/SHOWS . NIGHT/RUFUS DU SOL/cover.webp'
  },
  [groupKey('shows-night', 'Tobi Amuchastegui Boat Party')]: {
    description: 'Selección de video',
    coverImage: 'assets/media/SHOWS . NIGHT/TOBI AMUCHASTEGUI BOAT PARTY/cover.webp'
  },
  [groupKey('shows-night', 'Pawsa')]: {
    description: 'Selección de video',
    coverImage: 'assets/media/SHOWS . NIGHT/PAWSA/cover.webp'
  },
  [groupKey('architecture-interiors', 'Architecture & Interiors')]: { title: 'Architecture & Interiors', description: 'Selección de fotografía' },
  [groupKey('architecture-interiors', 'Videos de arquitectura')]: {
    description: 'Selección de video',
    coverImage: 'assets/media/architecture-interiors/ARCHITECTURE . INTERIORS/DSC08890.webp'
  }
};

const OPTIMIZED_COVER_OVERRIDES: Record<string, string> = {
  'events/papagayo': 'assets/media/Portadas/events/EVENTS/PAPAGAYO/DSC04727.webp',
  'events/meed-x-session': 'assets/media/Portadas/events/EVENTS/SESSION X MEED/DSC05311.webp',

  'brands/paprika': 'assets/media/Portadas/brands/BRANDS/PAPRIKA/DSC01199.webp',
  'brands/mas-indumentaria': 'assets/media/Portadas/brands/BRANDS/MAS/DSC01707.webp',
  'brands/di-coccia': 'assets/media/Portadas/brands/BRANDS/DI COCCIA/DSC05923.webp',
  'brands/mante': 'assets/media/Portadas/brands/BRANDS/MANTE/PORTADA MANTE.webp',
  'brands/victory': 'assets/media/Portadas/brands/BRANDS/VICTORY/PORTADA VICTORY.webp',

  'shows-night/ysy-a': 'assets/media/Portadas/shows/SHOWS/YSY A/DSC04824-2.webp',
  'shows-night/amelie-lens': 'assets/media/Portadas/shows/SHOWS/AMELIE/AMELIE PORTADAÇ.webp',
  'shows-night/argy': 'assets/media/Portadas/shows/SHOWS/ARGY/ARGY PORTADA.webp',
  'shows-night/konstantin-sibold-adam-sellouk': 'assets/media/Portadas/shows/SHOWS/KONSTANTIN/PORTADA KONSTANTIN.webp',
  'shows-night/mau-p': 'assets/media/Portadas/shows/SHOWS/MAU P/MAU P.webp',
  'shows-night/pawsa': 'assets/media/Portadas/shows/SHOWS/PAWSA/PORTADA PAWSA.webp',
  'shows-night/rufus-du-sol': 'assets/media/Portadas/shows/SHOWS/RUFUS DU SOL/PORTADA RUFUS.webp',
  'shows-night/tobi-amuchastegui-boat-party': 'assets/media/Portadas/shows/SHOWS/TOBI AMUCHASTEGUI/DSC05233.webp'
};

const getOptimizedCoverOverride = (sectionSlug: string, title: string): string | undefined =>
  OPTIMIZED_COVER_OVERRIDES[`${sectionSlug}/${slugify(title)}`];

export const MEDIA_ITEMS: MediaItem[] = [
  createMediaItem({ id: 'events-papagayo-01', title: 'Papagayo 01', category: 'events', subcategory: 'Papagayo', src: 'assets/images/events/EVENTS/papagayo/FOTOS/DSC04831.jpg' }),
  createMediaItem({ id: 'events-papagayo-02', title: 'Papagayo 02', category: 'events', subcategory: 'Papagayo', src: 'assets/images/events/EVENTS/papagayo/FOTOS/DSC04817.jpg' }),
  createMediaItem({ id: 'events-papagayo-03', title: 'Papagayo 03', category: 'events', subcategory: 'Papagayo', src: 'assets/images/events/EVENTS/papagayo/FOTOS/DSC04803.jpg' }),
  createMediaItem({ id: 'events-papagayo-04', title: 'Papagayo 04', category: 'events', subcategory: 'Papagayo', src: 'assets/images/events/EVENTS/papagayo/FOTOS/DSC04779.jpg' }),
  createMediaItem({ id: 'events-papagayo-05', title: 'Papagayo 05', category: 'events', subcategory: 'Papagayo', src: 'assets/images/events/EVENTS/papagayo/FOTOS/DSC04765.jpg' }),
  createMediaItem({ id: 'events-papagayo-06', title: 'Papagayo 06', category: 'events', subcategory: 'Papagayo', src: 'assets/images/events/EVENTS/papagayo/FOTOS/DSC04727.jpg' }),
  createMediaItem({ id: 'events-redbull-video-01', title: 'Redbull x La Fabrica', category: 'events', subcategory: 'Redbull x La Fabrica', src: 'assets/images/events/EVENTS/REDBULL X LA FABRICA/REDBULL X LA FABRICA.mp4' }),
  createMediaItem({ id: 'events-mola-video-01', title: 'Mola Auto', category: 'events', subcategory: 'Mola', src: 'assets/images/events/EVENTS/MOLA/MOLA AUTO.mp4' }),
  createMediaItem({ id: 'events-mola-video-02', title: 'Mola Casette', category: 'events', subcategory: 'Mola', src: 'assets/images/events/EVENTS/MOLA/MOLA CASETTE.mp4' }),
  createMediaItem({ id: 'events-meed-video-01', title: 'B2B Session', category: 'events', subcategory: 'Meed x Session', src: 'assets/images/events/EVENTS/MEED X SESSION/B2B.mp4' }),

  createMediaItem({ id: 'brands-caffuchinos-01', title: 'Caffuchinos 01', category: 'brands', subcategory: 'Caffuchinos', src: 'assets/images/brands/BRANDS/CAFFUCHINOS/DSC09354.jpg' }),
  createMediaItem({ id: 'brands-caffuchinos-02', title: 'Caffuchinos 02', category: 'brands', subcategory: 'Caffuchinos', src: 'assets/images/brands/BRANDS/CAFFUCHINOS/DSC09342.jpg' }),
  createMediaItem({ id: 'brands-caffuchinos-03', title: 'Caffuchinos 03', category: 'brands', subcategory: 'Caffuchinos', src: 'assets/images/brands/BRANDS/CAFFUCHINOS/DSC09337.jpg' }),
  createMediaItem({ id: 'brands-caffuchinos-04', title: 'Caffuchinos 04', category: 'brands', subcategory: 'Caffuchinos', src: 'assets/images/brands/BRANDS/CAFFUCHINOS/DSC09301.jpg' }),
  createMediaItem({ id: 'brands-paprika-01', title: 'Paprika 01', category: 'brands', subcategory: 'Paprika', src: 'assets/images/brands/BRANDS/PAPRIKA/DSC09127.jpg' }),
  createMediaItem({ id: 'brands-paprika-02', title: 'Paprika 02', category: 'brands', subcategory: 'Paprika', src: 'assets/images/brands/BRANDS/PAPRIKA/DSC09060.jpg' }),
  createMediaItem({ id: 'brands-paprika-03', title: 'Paprika 03', category: 'brands', subcategory: 'Paprika', src: 'assets/images/brands/BRANDS/PAPRIKA/DSC08116.jpg' }),
  createMediaItem({ id: 'brands-mas-01', title: 'Mas Indumentaria 01', category: 'brands', subcategory: 'Mas Indumentaria', src: 'assets/images/brands/BRANDS/MAS INDUMENTARIA/DSC01938.jpg' }),
  createMediaItem({ id: 'brands-mas-02', title: 'Mas Indumentaria 02', category: 'brands', subcategory: 'Mas Indumentaria', src: 'assets/images/brands/BRANDS/MAS INDUMENTARIA/DSC01826.jpg' }),
  createMediaItem({ id: 'brands-di-coccia-01', title: 'Di Coccia 01', category: 'brands', subcategory: 'Di Coccia', src: 'assets/images/brands/BRANDS/DI COCCIA/DSC05998.jpg' }),
  createMediaItem({ id: 'brands-di-coccia-02', title: 'Di Coccia 02', category: 'brands', subcategory: 'Di Coccia', src: 'assets/images/brands/BRANDS/DI COCCIA/DSC05923.jpg' }),
  createMediaItem({ id: 'brands-mante-video-01', title: 'Mante 01', category: 'brands', subcategory: 'Mante', src: 'assets/images/brands/BRANDS/MANTE/MANTE 01.mp4' }),
  createMediaItem({ id: 'brands-mante-video-02', title: 'Mante Preview', category: 'brands', subcategory: 'Mante', src: 'assets/images/brands/BRANDS/MANTE/MANTE PREVIEW 2.mp4' }),
  createMediaItem({ id: 'brands-victory-video-01', title: 'Victory R1', category: 'brands', subcategory: 'Victory', src: 'assets/images/brands/BRANDS/VICTORY/VICTORY R1.mp4' }),
  createMediaItem({ id: 'brands-victory-video-02', title: 'Victory R2', category: 'brands', subcategory: 'Victory', src: 'assets/images/brands/BRANDS/VICTORY/VICTORY R2.mp4' }),

  createMediaItem({ id: 'shows-ysy-a-01', title: 'YSY A 01', category: 'shows-night', subcategory: 'YSY A', src: 'assets/images/shows-night/SHOWS . NIGHT/YSY A/DSC06122.jpg' }),
  createMediaItem({ id: 'shows-ysy-a-02', title: 'YSY A 02', category: 'shows-night', subcategory: 'YSY A', src: 'assets/images/shows-night/SHOWS . NIGHT/YSY A/DSC06021.jpg' }),
  createMediaItem({ id: 'shows-ysy-a-03', title: 'YSY A 03', category: 'shows-night', subcategory: 'YSY A', src: 'assets/images/shows-night/SHOWS . NIGHT/YSY A/DSC06002.jpg' }),
  createMediaItem({ id: 'shows-ysy-a-04', title: 'YSY A 04', category: 'shows-night', subcategory: 'YSY A', src: 'assets/images/shows-night/SHOWS . NIGHT/YSY A/DSC05367.jpg' }),
  createMediaItem({ id: 'shows-hernan-01', title: 'Hernan Cattaneo', category: 'shows-night', subcategory: 'Hernan Cattaneo', src: 'assets/images/shows-night/SHOWS . NIGHT/HERNAN CATTANEO/GO.jpg' }),
  createMediaItem({ id: 'shows-hernan-video-01', title: 'Hernan Cattaneo 01', category: 'shows-night', subcategory: 'Hernan Cattaneo', src: 'assets/images/shows-night/SHOWS . NIGHT/HERNAN CATTANEO/1.mp4' }),
  createMediaItem({ id: 'shows-hernan-video-02', title: 'Hernan Cattaneo 02', category: 'shows-night', subcategory: 'Hernan Cattaneo', src: 'assets/images/shows-night/SHOWS . NIGHT/HERNAN CATTANEO/2.mp4' }),
  createMediaItem({ id: 'shows-amelie-video-01', title: 'Amelie Lens 01', category: 'shows-night', subcategory: 'Amelie Lens', src: 'assets/images/shows-night/SHOWS . NIGHT/AMELIE LENS/AMELIE DROP 2.mp4' }),
  createMediaItem({ id: 'shows-argy-video-01', title: 'Argy 01', category: 'shows-night', subcategory: 'Argy', src: 'assets/images/shows-night/SHOWS . NIGHT/ARGY/ARGY 1.mp4' }),
  createMediaItem({ id: 'shows-konstantin-video-01', title: 'Konstantin & Adam 01', category: 'shows-night', subcategory: 'Konstantin Sibold - Adam Sellouk', src: 'assets/images/shows-night/SHOWS . NIGHT/KONSTANTIN SIBOLD - ADAM SELLOUK/KONSTANTIN Y ADAM 1.mp4' }),
  createMediaItem({ id: 'shows-mau-p-video-01', title: 'Mau P 01', category: 'shows-night', subcategory: 'Mau P', src: 'assets/images/shows-night/SHOWS . NIGHT/MAU P/MAUPAPI.mp4' }),
  createMediaItem({ id: 'shows-rufus-video-01', title: 'Rufus Du Sol 01', category: 'shows-night', subcategory: 'Rufus Du Sol', src: 'assets/images/shows-night/SHOWS . NIGHT/RUFUS DU SOL/RUFUS 1.mp4' }),
  createMediaItem({ id: 'shows-tobi-video-01', title: 'Boat Party 01', category: 'shows-night', subcategory: 'Tobi Amuchastegui Boat Party', src: 'assets/images/shows-night/SHOWS . NIGHT/TOBI AMUCHASTEGUI BOAT PARTY/02.mp4' }),

  createMediaItem({ id: 'architecture-01', title: 'Architecture 01', category: 'architecture-interiors', subcategory: 'Architecture & Interiors', src: 'assets/images/architecture-interiors/ARCHITECTURE . INTERIORS/DSC08890.jpg' }),
  createMediaItem({ id: 'architecture-02', title: 'Architecture 02', category: 'architecture-interiors', subcategory: 'Architecture & Interiors', src: 'assets/images/architecture-interiors/ARCHITECTURE . INTERIORS/DSC08834.jpg' }),
  createMediaItem({ id: 'architecture-03', title: 'Architecture 03', category: 'architecture-interiors', subcategory: 'Architecture & Interiors', src: 'assets/images/architecture-interiors/ARCHITECTURE . INTERIORS/DSC08823.jpg' }),
  createMediaItem({ id: 'architecture-04', title: 'Architecture 04', category: 'architecture-interiors', subcategory: 'Architecture & Interiors', src: 'assets/images/architecture-interiors/ARCHITECTURE . INTERIORS/DSC04643.jpg' }),
  createMediaItem({ id: 'architecture-05', title: 'Architecture 05', category: 'architecture-interiors', subcategory: 'Architecture & Interiors', src: 'assets/images/architecture-interiors/ARCHITECTURE . INTERIORS/DSC04549.jpg' }),
  createMediaItem({ id: 'architecture-06', title: 'Architecture 06', category: 'architecture-interiors', subcategory: 'Architecture & Interiors', src: 'assets/images/architecture-interiors/ARCHITECTURE . INTERIORS/DSC03516.jpg' }),
  createMediaItem({ id: 'architecture-07', title: 'Architecture 07', category: 'architecture-interiors', subcategory: 'Architecture & Interiors', src: 'assets/images/architecture-interiors/ARCHITECTURE . INTERIORS/DSC03459.jpg' }),
  createMediaItem({ id: 'architecture-08', title: 'Architecture 08', category: 'architecture-interiors', subcategory: 'Architecture & Interiors', src: 'assets/images/architecture-interiors/ARCHITECTURE . INTERIORS/DSC02802.jpg' }),

  createMediaItem({ id: 'events-papagayo-07', title: 'Papagayo 07', category: 'events', subcategory: 'Papagayo', src: 'assets/images/events/EVENTS/papagayo/FOTOS/DSC03778-Mejorado-NR.jpg' }),
  createMediaItem({ id: 'events-papagayo-08', title: 'Papagayo 08', category: 'events', subcategory: 'Papagayo', src: 'assets/images/events/EVENTS/papagayo/FOTOS/DSC03752-Mejorado-NR.jpg' }),
  createMediaItem({ id: 'events-papagayo-09', title: 'Papagayo 09', category: 'events', subcategory: 'Papagayo', src: 'assets/images/events/EVENTS/papagayo/FOTOS/DSC03745-Mejorado-NR.jpg' }),
  createMediaItem({ id: 'events-papagayo-10', title: 'Papagayo 10', category: 'events', subcategory: 'Papagayo', src: 'assets/images/events/EVENTS/papagayo/FOTOS/DSC03697-Mejorado-NR.jpg' }),
  createMediaItem({ id: 'events-mola-video-03', title: 'Mola Hotel', category: 'events', subcategory: 'Mola', src: 'assets/images/events/EVENTS/MOLA/MOLA HOTEL.mp4' }),
  createMediaItem({ id: 'events-mola-video-04', title: 'Mola Makeup', category: 'events', subcategory: 'Mola', src: 'assets/images/events/EVENTS/MOLA/MOLA MAKEUP.mp4' }),
  createMediaItem({ id: 'events-mola-video-05', title: 'Mola Telefono', category: 'events', subcategory: 'Mola', src: 'assets/images/events/EVENTS/MOLA/MOLA TELEFONO.mp4' }),
  createMediaItem({ id: 'events-meed-video-02', title: 'Mima Session', category: 'events', subcategory: 'Meed x Session', src: 'assets/images/events/EVENTS/MEED X SESSION/MIMA SESSION 03.mp4' }),
  createMediaItem({ id: 'events-meed-video-03', title: 'Malen TS Session', category: 'events', subcategory: 'Meed x Session', src: 'assets/images/events/EVENTS/MEED X SESSION/MALEN TS SESSION 04.mp4' }),
  createMediaItem({ id: 'events-meed-video-04', title: 'Pampa Session', category: 'events', subcategory: 'Meed x Session', src: 'assets/images/events/EVENTS/MEED X SESSION/PAMPA SESSION 01.mp4' }),
  createMediaItem({ id: 'events-meed-video-05', title: 'Wendy Session', category: 'events', subcategory: 'Meed x Session', src: 'assets/images/events/EVENTS/MEED X SESSION/WENDY SESSION 02.mp4' }),

  createMediaItem({ id: 'brands-caffuchinos-05', title: 'Caffuchinos 05', category: 'brands', subcategory: 'Caffuchinos', src: 'assets/images/brands/BRANDS/CAFFUCHINOS/DSC09298.jpg' }),
  createMediaItem({ id: 'brands-caffuchinos-06', title: 'Caffuchinos 06', category: 'brands', subcategory: 'Caffuchinos', src: 'assets/images/brands/BRANDS/CAFFUCHINOS/DSC09285.jpg' }),
  createMediaItem({ id: 'brands-caffuchinos-07', title: 'Caffuchinos 07', category: 'brands', subcategory: 'Caffuchinos', src: 'assets/images/brands/BRANDS/CAFFUCHINOS/DSC09234.jpg' }),
  createMediaItem({ id: 'brands-caffuchinos-08', title: 'Caffuchinos 08', category: 'brands', subcategory: 'Caffuchinos', src: 'assets/images/brands/BRANDS/CAFFUCHINOS/DSC09185.jpg' }),
  createMediaItem({ id: 'brands-paprika-04', title: 'Paprika 04', category: 'brands', subcategory: 'Paprika', src: 'assets/images/brands/BRANDS/PAPRIKA/DSC01247.jpg' }),
  createMediaItem({ id: 'brands-paprika-05', title: 'Paprika 05', category: 'brands', subcategory: 'Paprika', src: 'assets/images/brands/BRANDS/PAPRIKA/DSC01236.jpg' }),
  createMediaItem({ id: 'brands-paprika-06', title: 'Paprika 06', category: 'brands', subcategory: 'Paprika', src: 'assets/images/brands/BRANDS/PAPRIKA/DSC01220.jpg' }),
  createMediaItem({ id: 'brands-paprika-07', title: 'Paprika 07', category: 'brands', subcategory: 'Paprika', src: 'assets/images/brands/BRANDS/PAPRIKA/DSC01199.jpg' }),
  createMediaItem({ id: 'brands-paprika-08', title: 'Paprika 08', category: 'brands', subcategory: 'Paprika', src: 'assets/images/brands/BRANDS/PAPRIKA/DSC01196.jpg' }),
  createMediaItem({ id: 'brands-paprika-09', title: 'Paprika 09', category: 'brands', subcategory: 'Paprika', src: 'assets/images/brands/BRANDS/PAPRIKA/DSC01114.jpg' }),
  createMediaItem({ id: 'brands-mas-03', title: 'Mas Indumentaria 03', category: 'brands', subcategory: 'Mas Indumentaria', src: 'assets/images/brands/BRANDS/MAS INDUMENTARIA/DSC01727.jpg' }),
  createMediaItem({ id: 'brands-mas-04', title: 'Mas Indumentaria 04', category: 'brands', subcategory: 'Mas Indumentaria', src: 'assets/images/brands/BRANDS/MAS INDUMENTARIA/DSC01707.jpg' }),
  createMediaItem({ id: 'brands-mas-05', title: 'Mas Indumentaria 05', category: 'brands', subcategory: 'Mas Indumentaria', src: 'assets/images/brands/BRANDS/MAS INDUMENTARIA/DSC01704.jpg' }),
  createMediaItem({ id: 'brands-mas-06', title: 'Mas Indumentaria 06', category: 'brands', subcategory: 'Mas Indumentaria', src: 'assets/images/brands/BRANDS/MAS INDUMENTARIA/DSC01683.jpg' }),
  createMediaItem({ id: 'brands-di-coccia-03', title: 'Di Coccia 03', category: 'brands', subcategory: 'Di Coccia', src: 'assets/images/brands/BRANDS/DI COCCIA/DSC05916.jpg' }),
  createMediaItem({ id: 'brands-di-coccia-04', title: 'Di Coccia 04', category: 'brands', subcategory: 'Di Coccia', src: 'assets/images/brands/BRANDS/DI COCCIA/DSC05843.jpg' }),
  createMediaItem({ id: 'brands-di-coccia-05', title: 'Di Coccia 05', category: 'brands', subcategory: 'Di Coccia', src: 'assets/images/brands/BRANDS/DI COCCIA/DSC05813.jpg' }),
  createMediaItem({ id: 'brands-di-coccia-06', title: 'Di Coccia 06', category: 'brands', subcategory: 'Di Coccia', src: 'assets/images/brands/BRANDS/DI COCCIA/DSC05771.jpg' }),
  createMediaItem({ id: 'brands-di-coccia-07', title: 'Di Coccia 07', category: 'brands', subcategory: 'Di Coccia', src: 'assets/images/brands/BRANDS/DI COCCIA/DSC05749.jpg' }),
  createMediaItem({ id: 'brands-di-coccia-08', title: 'Di Coccia 08', category: 'brands', subcategory: 'Di Coccia', src: 'assets/images/brands/BRANDS/DI COCCIA/DSC05721.jpg' }),
  createMediaItem({ id: 'brands-di-coccia-09', title: 'Di Coccia 09', category: 'brands', subcategory: 'Di Coccia', src: 'assets/images/brands/BRANDS/DI COCCIA/DSC05643.jpg' }),
  createMediaItem({ id: 'brands-di-coccia-10', title: 'Di Coccia 10', category: 'brands', subcategory: 'Di Coccia', src: 'assets/images/brands/BRANDS/DI COCCIA/DSC05566.jpg' }),
  createMediaItem({ id: 'brands-di-coccia-11', title: 'Di Coccia 11', category: 'brands', subcategory: 'Di Coccia', src: 'assets/images/brands/BRANDS/DI COCCIA/DSC05513.jpg' }),
  createMediaItem({ id: 'brands-mante-video-03', title: 'Mante 03', category: 'brands', subcategory: 'Mante', src: 'assets/images/brands/BRANDS/MANTE/MANTE 4.mp4' }),
  createMediaItem({ id: 'brands-mante-video-04', title: 'Mante Ambo Detalle', category: 'brands', subcategory: 'Mante', src: 'assets/images/brands/BRANDS/MANTE/MANTE AMBO DETALLE.mp4' }),
  createMediaItem({ id: 'brands-victory-video-03', title: 'Victory R3', category: 'brands', subcategory: 'Victory', src: 'assets/images/brands/BRANDS/VICTORY/VICTORY R3.mp4' }),
  createMediaItem({ id: 'brands-victory-video-04', title: 'Victory Reel 3', category: 'brands', subcategory: 'Victory', src: 'assets/images/brands/BRANDS/VICTORY/REEL VICTORY 3.mp4' }),
  createMediaItem({ id: 'brands-victory-video-05', title: 'Victory Reel 5', category: 'brands', subcategory: 'Victory', src: 'assets/images/brands/BRANDS/VICTORY/REEL VICTORY 5.mp4' }),

  createMediaItem({ id: 'shows-ysy-a-05', title: 'YSY A 05', category: 'shows-night', subcategory: 'YSY A', src: 'assets/images/shows-night/SHOWS . NIGHT/YSY A/DSC05120.jpg' }),
  createMediaItem({ id: 'shows-ysy-a-06', title: 'YSY A 06', category: 'shows-night', subcategory: 'YSY A', src: 'assets/images/shows-night/SHOWS . NIGHT/YSY A/DSC04973.jpg' }),
  createMediaItem({ id: 'shows-ysy-a-07', title: 'YSY A 07', category: 'shows-night', subcategory: 'YSY A', src: 'assets/images/shows-night/SHOWS . NIGHT/YSY A/DSC04962.jpg' }),
  createMediaItem({ id: 'shows-ysy-a-08', title: 'YSY A 08', category: 'shows-night', subcategory: 'YSY A', src: 'assets/images/shows-night/SHOWS . NIGHT/YSY A/DSC04913.jpg' }),
  createMediaItem({ id: 'shows-ysy-a-09', title: 'YSY A 09', category: 'shows-night', subcategory: 'YSY A', src: 'assets/images/shows-night/SHOWS . NIGHT/YSY A/DSC04824-2.jpg' }),
  createMediaItem({ id: 'shows-ysy-a-10', title: 'YSY A 10', category: 'shows-night', subcategory: 'YSY A', src: 'assets/images/shows-night/SHOWS . NIGHT/YSY A/DSC04745.jpg' }),
  createMediaItem({ id: 'shows-amelie-video-02', title: 'Amelie Lens 02', category: 'shows-night', subcategory: 'Amelie Lens', src: 'assets/images/shows-night/SHOWS . NIGHT/AMELIE LENS/AMELIE DROP 5.mp4' }),
  createMediaItem({ id: 'shows-amelie-video-03', title: 'Amelie Lens 03', category: 'shows-night', subcategory: 'Amelie Lens', src: 'assets/images/shows-night/SHOWS . NIGHT/AMELIE LENS/AMELIE DROP 7.mp4' }),
  createMediaItem({ id: 'shows-argy-video-02', title: 'Argy 02', category: 'shows-night', subcategory: 'Argy', src: 'assets/images/shows-night/SHOWS . NIGHT/ARGY/ARGY 2.mp4' }),
  createMediaItem({ id: 'shows-argy-video-03', title: 'Argy 03', category: 'shows-night', subcategory: 'Argy', src: 'assets/images/shows-night/SHOWS . NIGHT/ARGY/ARGY 3.mp4' }),
  createMediaItem({ id: 'shows-argy-video-04', title: 'Argy 04', category: 'shows-night', subcategory: 'Argy', src: 'assets/images/shows-night/SHOWS . NIGHT/ARGY/ARGY 4.mp4' }),
  createMediaItem({ id: 'shows-rufus-video-02', title: 'Rufus Du Sol 02', category: 'shows-night', subcategory: 'Rufus Du Sol', src: 'assets/images/shows-night/SHOWS . NIGHT/RUFUS DU SOL/RUFUS 2.mp4' }),
  createMediaItem({ id: 'shows-rufus-video-03', title: 'Rufus Du Sol 03', category: 'shows-night', subcategory: 'Rufus Du Sol', src: 'assets/images/shows-night/SHOWS . NIGHT/RUFUS DU SOL/RUFUS 3.mp4' }),

  createMediaItem({ id: 'shows-hernan-video-03', title: 'Hernan Cattaneo 03', category: 'shows-night', subcategory: 'Hernan Cattaneo', src: 'assets/images/shows-night/SHOWS . NIGHT/HERNAN CATTANEO/3.mp4' }),
  createMediaItem({ id: 'shows-hernan-video-04', title: 'Hernan Cattaneo 04', category: 'shows-night', subcategory: 'Hernan Cattaneo', src: 'assets/images/shows-night/SHOWS . NIGHT/HERNAN CATTANEO/4.mp4' }),

  createMediaItem({ id: 'shows-amelie-video-04', title: 'Amelie Lens Drop 1', category: 'shows-night', subcategory: 'Amelie Lens', src: 'assets/images/shows-night/SHOWS . NIGHT/AMELIE LENS/AMELIE DROP 1.mp4' }),
  createMediaItem({ id: 'shows-amelie-video-05', title: 'Amelie Lens Drop 6', category: 'shows-night', subcategory: 'Amelie Lens', src: 'assets/images/shows-night/SHOWS . NIGHT/AMELIE LENS/AMELIE DROP 6.mp4' }),
  createMediaItem({ id: 'shows-amelie-video-06', title: 'Amelie Lens Drop 9', category: 'shows-night', subcategory: 'Amelie Lens', src: 'assets/images/shows-night/SHOWS . NIGHT/AMELIE LENS/AMELIE DROP 9.mp4' }),
  createMediaItem({ id: 'shows-amelie-video-07', title: 'Amelie Lens Fin', category: 'shows-night', subcategory: 'Amelie Lens', src: 'assets/images/shows-night/SHOWS . NIGHT/AMELIE LENS/AMELIE FIN.mp4' }),

  createMediaItem({ id: 'shows-konstantin-video-02', title: 'Adam Sellouk 01', category: 'shows-night', subcategory: 'Konstantin Sibold - Adam Sellouk', src: 'assets/images/shows-night/SHOWS . NIGHT/KONSTANTIN SIBOLD - ADAM SELLOUK/ADAM 1.mp4' }),
  createMediaItem({ id: 'shows-konstantin-video-03', title: 'Adam Sellouk 03', category: 'shows-night', subcategory: 'Konstantin Sibold - Adam Sellouk', src: 'assets/images/shows-night/SHOWS . NIGHT/KONSTANTIN SIBOLD - ADAM SELLOUK/ADAM 3.mp4' }),
  createMediaItem({ id: 'shows-konstantin-video-04', title: 'Konstantin Sibold 01', category: 'shows-night', subcategory: 'Konstantin Sibold - Adam Sellouk', src: 'assets/images/shows-night/SHOWS . NIGHT/KONSTANTIN SIBOLD - ADAM SELLOUK/KONSTANTIN 1.mp4' }),
  createMediaItem({ id: 'shows-konstantin-video-05', title: 'Konstantin Sibold 02', category: 'shows-night', subcategory: 'Konstantin Sibold - Adam Sellouk', src: 'assets/images/shows-night/SHOWS . NIGHT/KONSTANTIN SIBOLD - ADAM SELLOUK/KONSTANTIN 2.mp4' }),
  createMediaItem({ id: 'shows-konstantin-video-06', title: 'Konstantin & Adam 02', category: 'shows-night', subcategory: 'Konstantin Sibold - Adam Sellouk', src: 'assets/images/shows-night/SHOWS . NIGHT/KONSTANTIN SIBOLD - ADAM SELLOUK/KONSTANTIN Y ADAM 2.mp4' }),
  createMediaItem({ id: 'shows-konstantin-video-07', title: 'Ni La Lluvia Nos Para', category: 'shows-night', subcategory: 'Konstantin Sibold - Adam Sellouk', src: 'assets/images/shows-night/SHOWS . NIGHT/KONSTANTIN SIBOLD - ADAM SELLOUK/NI LAS LLUVIA NOS PARA.mp4' }),

  createMediaItem({ id: 'shows-mau-p-video-02', title: 'Mau P Drop', category: 'shows-night', subcategory: 'Mau P', src: 'assets/images/shows-night/SHOWS . NIGHT/MAU P/DRP.mp4' }),
  createMediaItem({ id: 'shows-mau-p-video-03', title: 'Like I Like It', category: 'shows-night', subcategory: 'Mau P', src: 'assets/images/shows-night/SHOWS . NIGHT/MAU P/LIKE I LIKE IT.mp4' }),
  createMediaItem({ id: 'shows-mau-p-video-04', title: 'One More Time', category: 'shows-night', subcategory: 'Mau P', src: 'assets/images/shows-night/SHOWS . NIGHT/MAU P/MAU P ONE MORE TIMME.mp4' }),
  createMediaItem({ id: 'shows-mau-p-video-05', title: 'Mau P', category: 'shows-night', subcategory: 'Mau P', src: 'assets/images/shows-night/SHOWS . NIGHT/MAU P/MAU PP.mp4' }),

  createMediaItem({ id: 'shows-pawsa-video-01', title: 'Pawsa Close', category: 'shows-night', subcategory: 'Pawsa', src: 'assets/images/shows-night/SHOWS . NIGHT/PAWSA/PAWSA CLOSE - Trim.mp4' }),
  createMediaItem({ id: 'shows-pawsa-video-02', title: 'Pawsa Drop', category: 'shows-night', subcategory: 'Pawsa', src: 'assets/images/shows-night/SHOWS . NIGHT/PAWSA/PAWSA DROP.mp4' }),
  createMediaItem({ id: 'shows-pawsa-video-03', title: 'Pick Up The Phone', category: 'shows-night', subcategory: 'Pawsa', src: 'assets/images/shows-night/SHOWS . NIGHT/PAWSA/PAWSA PICK UP THE PHONE.mp4' }),
  createMediaItem({ id: 'shows-pawsa-video-04', title: 'Too Cool', category: 'shows-night', subcategory: 'Pawsa', src: 'assets/images/shows-night/SHOWS . NIGHT/PAWSA/PAWSA TOO COOL 2.mp4' }),

  createMediaItem({ id: 'shows-tobi-video-02', title: 'Boat Party 04', category: 'shows-night', subcategory: 'Tobi Amuchastegui Boat Party', src: 'assets/images/shows-night/SHOWS . NIGHT/TOBI AMUCHASTEGUI BOAT PARTY/04.mp4' }),
  createMediaItem({ id: 'shows-tobi-video-03', title: 'Boat Party 05', category: 'shows-night', subcategory: 'Tobi Amuchastegui Boat Party', src: 'assets/images/shows-night/SHOWS . NIGHT/TOBI AMUCHASTEGUI BOAT PARTY/05.mp4' }),
  createMediaItem({ id: 'shows-tobi-video-04', title: 'Boat Party 07', category: 'shows-night', subcategory: 'Tobi Amuchastegui Boat Party', src: 'assets/images/shows-night/SHOWS . NIGHT/TOBI AMUCHASTEGUI BOAT PARTY/07.mp4' }),
  createMediaItem({ id: 'shows-tobi-video-05', title: 'Boat Party 09', category: 'shows-night', subcategory: 'Tobi Amuchastegui Boat Party', src: 'assets/images/shows-night/SHOWS . NIGHT/TOBI AMUCHASTEGUI BOAT PARTY/09.mp4' }),
  createMediaItem({ id: 'shows-tobi-video-06', title: 'Boat Party 12', category: 'shows-night', subcategory: 'Tobi Amuchastegui Boat Party', src: 'assets/images/shows-night/SHOWS . NIGHT/TOBI AMUCHASTEGUI BOAT PARTY/12.mp4' })
];

export const getMediaByCategory = (category: string): MediaItem[] =>
  MEDIA_ITEMS.filter((item) => item.category === category);

export const getPortfolioGroupsBySection = (sectionSlug: string): PortfolioGroup[] =>
  getMediaGroupsByCategory(sectionSlug).map((group) => ({
    id: `${group.sectionSlug}-${group.slug}`,
    title: group.title,
    slug: group.slug,
    sectionSlug: group.sectionSlug,
    year: group.year,
    description: group.description,
    coverImage: group.coverSrc,
    coverType: group.coverType
  }));

export const getAllPortfolioGroups = (): PortfolioGroup[] => {
  const sectionSlugs = Array.from(new Set(MEDIA_ITEMS.map((item) => item.sectionSlug)));

  return sectionSlugs.flatMap((sectionSlug) => getPortfolioGroupsBySection(sectionSlug));
};

export const getRecommendedGroups = (sectionSlug: string, groupSlug: string, limit = 4): PortfolioGroup[] => {
  const allGroups = getAllPortfolioGroups().filter(
    (group) => !(group.sectionSlug === sectionSlug && group.slug === groupSlug)
  );
  const sameSectionGroups = allGroups.filter((group) => group.sectionSlug === sectionSlug);
  const otherSectionGroups = allGroups.filter((group) => group.sectionSlug !== sectionSlug);

  return [...sameSectionGroups, ...otherSectionGroups].slice(0, limit);
};

export const getMediaItemsByGroup = (sectionSlug: string, groupSlug: string): MediaItem[] =>
  MEDIA_ITEMS.filter((item) => item.sectionSlug === sectionSlug && item.groupSlug === groupSlug);

export const getMediaGroupBySlug = (sectionSlug: string, groupSlug: string): MediaGroup | undefined =>
  getMediaGroupsByCategory(sectionSlug).find((group) => group.slug === groupSlug);

export const getMediaGroupsByCategory = (category: string): MediaGroup[] => {
  const groups = new Map<string, MediaItem[]>();

  getMediaByCategory(category).forEach((item) => {
    const title = item.subcategory ?? item.category;
    groups.set(title, [...(groups.get(title) ?? []), item]);
  });

  const mediaGroups = Array.from(groups.entries()).map(([title, items]) => {
    const config = GROUP_CONFIG[groupKey(category, title)];
    const optimizedCover = getOptimizedCoverOverride(category, title);
    const imageCover = items.find((item) => item.type === 'image');
    const fallbackCover = imageCover ?? items[0];
    const coverSrc = optimizedCover ?? config?.coverImage ?? imageCover?.src ?? fallbackCover.src;
    const coverType: MediaType = optimizedCover ? 'image' : (config?.coverType ?? (config?.coverImage ? 'image' : (imageCover?.type ?? fallbackCover.type)));

    return {
      title: config?.title ?? title,
      slug: slugify(title),
      sectionSlug: category,
      year: '2026',
      description: config?.description ?? 'Selección de fotografía',
      coverSrc,
      coverType,
      items
    };
  });

  if (category === 'architecture-interiors') {
    const title = 'Videos de arquitectura';
    const config = GROUP_CONFIG[groupKey(category, title)];

    mediaGroups.push({
      title,
      slug: slugify(title),
      sectionSlug: category,
      year: '2026',
      description: config?.description,
      coverSrc: config?.coverImage ?? 'assets/media/architecture-interiors/ARCHITECTURE . INTERIORS/DSC08890.webp',
      coverType: 'image',
      items: []
    });
  }

  return mediaGroups;
};
