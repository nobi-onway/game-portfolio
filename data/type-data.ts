type GenreType = 'Hyper Casual' | 'Strategy War' | 'Action' | 'Puzzle';

export type ProjectGameType = {
  slug: string;
  name: string;
  genres: GenreType[];
  images: string[];
  type: '2D' | '3D';
  mode: 'landscape' | 'portrait';
};
