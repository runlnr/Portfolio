/**
 * Type Definitions for Portfolio Projects & Case Studies
 */

export interface ProjectCredit {
  role: string;
  name: string;
}

export interface ProjectTabs {
  deliverables?: string;
  context?: string;
  challengeSolution?: string;
  challenge?: string;
  solution?: string;
  credits?: string;
}

export interface ProjectGalleryFullItem {
  type?: 'full';
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

export interface ProjectGridSubItem {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

export interface ProjectGalleryGridItem {
  type: 'grid-2';
  items: ProjectGridSubItem[];
}

export type ProjectGalleryItem = ProjectGalleryFullItem | ProjectGalleryGridItem;

export interface Project {
  id: string;
  number: string;
  title: string;
  medium: string;
  year: string;
  type: string;
  client: string;
  category: string;
  field: string;
  disciplines: string[];
  services: string;
  timeline: string;
  honor: string;
  stack: string;
  tags: string[];
  behanceUrl: string;
  visitUrl: string;
  image: string;
  placeholderColor?: string;
  credits: ProjectCredit[];
  description: string;
  tabs: ProjectTabs;
  gallery: ProjectGalleryItem[];
  duration?: string;
  date?: string;
}

declare global {
  interface Window {
    SWAG_PROJECTS: Project[];
    LOADER_CONFIG?: {
      fillDuration?: number;
      fillEasingExp?: number;
      whiteHoldDuration?: number;
      logoFadeDuration?: number;
      blackHoldDuration?: number;
      fadeDuration?: number;
      slideUpDuration?: number;
    };
    TRANSITION_CONFIG?: {
      coverDuration?: number;
      holdDuration?: number;
      revealDuration?: number;
      ease?: string;
    };
    PROJECT_SCRAMBLE_DURATION?: number;
    HERO_SCRAMBLE_DURATION?: number;
    replayIntroLoader?: () => void;
    triggerViewportTextReveal?: () => void;
    previewLoader?: (state?: string | boolean) => void;
    freezeIntroLoader?: (state?: string | boolean) => void;
    initWorksPage?: () => void;
    initProjectPage?: () => void;
    initScherreScroll?: () => void;
    initFutureThreeScroll?: () => void;
    openContactModal?: () => void;
    closeContactModal?: () => void;
    openProjectModal?: (id: string) => void;
    closeProjectModal?: () => void;
    cn?: (...inputs: any[]) => string;
    cva?: (base?: string, config?: any) => (props?: any) => string;
    initIcons?: () => void;
  }
}
