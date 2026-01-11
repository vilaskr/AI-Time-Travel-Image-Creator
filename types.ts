
export enum Era {
  CURRENT = 'Modern (2020s)',
  ERA_2010 = 'Instagram Era (2010s)',
  ERA_2000 = 'Y2K Digital (2000s)',
  ERA_1990 = 'Retro Grunge (1990s)',
  ERA_1980 = 'Neon & Grain (1980s)'
}

export interface EraStyle {
  id: Era;
  description: string;
  year: number;
  prompt: string;
  color: string;
  icon: string;
}

export interface TransformationResult {
  era: Era;
  imageUrl: string;
  timestamp: number;
}
