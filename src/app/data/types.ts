export interface Game {
  id: string;
  name: string;
  year: number;
  genre: string;
  rating: number;
  platform: string;
  developer: string;
  description: string;
  cover: string;
  similar: string[];
}
