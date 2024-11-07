import { Timestamp } from 'firebase/firestore';

export interface MovieToWatch {
  movieId: string;
  addedAt: Timestamp;
}

export interface User {
  userId: string;
  watchList: MovieToWatch[];
}
