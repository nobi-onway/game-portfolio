type GenreGenre = 'Hyper Casual' | 'Strategy War' | 'Action' | 'Puzzle';
type Platform = 'android' | 'ios' | 'web' | 'window';
type GameType = '2D' | '3D';
export type GameMode = 'landscape' | 'portrait';

export type ProjectGameType = {
  slug: string;
  name: string;
  genres: GenreGenre[];
  images: string[];
  type: GameType;
  mode: GameMode;
  platforms: Platform[];
};
