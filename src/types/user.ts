import { Timestamp } from 'firebase/firestore';

export interface MovieToWatch {
  movieId: number;
  addedAt: Timestamp;
}

export interface User {
  userId: string;
  watchList: MovieToWatch[];
}
