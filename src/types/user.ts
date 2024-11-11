import { Timestamp } from 'firebase/firestore';

interface MovieTimestamp {
  addedAt: Timestamp;
}

export interface MovieToWatchMap {
  [movieId: number]: MovieTimestamp;
}

export interface User {
  userId: string;
  watchList: MovieToWatchMap;
}

export interface GoogleUserInfo {
  uid: string;
  photoURL: string;
  displayName: string;
  email: string;
}
