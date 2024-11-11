import {
  collection,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  setDoc,
  deleteField,
} from 'firebase/firestore';
import { db } from '../../utils/firebaseInit';
import type { User } from '../../types/user';

export async function fetchWatchList(userId: string) {
  if (!userId) throw new Error('User ID is required');

  const userRef = doc(collection(db, 'users'), userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  const userData = userDoc.data() as User;
  const watchList = userData.watchList;

  return watchList;
}

export async function removeFromWatchList(userId: string, movieId: number) {
  if (!userId) throw new Error('User ID is required');
  if (!movieId) throw new Error('Movie ID is required');

  const userRef = doc(collection(db, 'users'), userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) throw new Error('User not found');

  const userData = userDoc.data() as User;
  const watchList = userData.watchList;

  if (!watchList[movieId]) {
    throw new Error('Movie not found in watchlist');
  }

  await updateDoc(userRef, {
    [`watchList.${movieId}`]: deleteField(),
  });
}

export async function addToWatchList(userId: string, movieId: number) {
  if (!userId) throw new Error('User ID is required');
  if (!movieId) throw new Error('Movie ID is required');

  const userRef = doc(collection(db, 'users'), userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      userId,
      watchList: {
        [movieId]: {
          addedAt: serverTimestamp(),
        },
      },
    });
    return;
  }

  await updateDoc(userRef, {
    [`watchList.${movieId}`]: {
      addedAt: serverTimestamp(),
    },
  });
}

export async function createUser(userId: string): Promise<void> {
  if (!userId) throw new Error('User ID is required');

  const userRef = doc(collection(db, 'users'), userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) return;

  await setDoc(userRef, {
    userId,
    watchList: {},
  });
}
