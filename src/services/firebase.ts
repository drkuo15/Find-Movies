import {
  collection,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
} from 'firebase/firestore';

import { db } from '../utils/firebaseInit';
import type { User } from '../types/user';

export async function fetchWatchList(userId: string) {
  if (!userId) throw new Error('User ID is required');

  const watchListRef = doc(collection(db, 'users'), userId);
  const watchListDoc = await getDoc(watchListRef);

  if (!watchListDoc.exists()) {
    throw new Error('Watch list not found');
  }

  return watchListDoc.data() as User;
}

export async function removeFromWatchList(userId: string, movieId: number) {
  if (!userId) throw new Error('User ID is required');
  if (!movieId) throw new Error('Movie ID is required');

  const userRef = doc(collection(db, 'users'), userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) throw new Error('User not found');

  const userData = userDoc.data();
  const movieToRemove = userData.watchList.find(
    (item: { movieId: number }) => item.movieId === movieId,
  );

  if (!movieToRemove) throw new Error('Movie not found in watchlist');

  await updateDoc(userRef, {
    watchList: arrayRemove(movieToRemove),
  });
}
