type GenreGenre =
  | 'Hyper Casual'
  | 'Strategy War'
  | 'Action'
  | 'Puzzle'
  | 'Tower Defend'
  | 'RPG'
  | 'PvP Action'
  | 'Tile Match';

type Platform = 'android' | 'ios' | 'web' | 'window';
type GameType = '2D' | '3D';
export type GameMode = 'landscape' | 'portrait';

export interface DeepInsight {
  challenge: string;
  solution: string;
  technicalDetails: string[];
}

export interface CareerMilestone {
  year: string;
  company: string;
  role: string;
  achievements: string[];
  description: string;
}

export type ProjectGameType = {
  slug: string;
  name: string;
  genres: GenreGenre[];
  images: string[];
  type: GameType;
  mode: GameMode;
  platforms: Platform[];
  brief: string;
  role?: string;
  deepInsights?: DeepInsight;
  achievements?: string[];
  links?: {
    store?: string;
    demo?: string;
  };
};
