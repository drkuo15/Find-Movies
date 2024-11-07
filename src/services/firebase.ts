import { collection, doc, getDoc } from 'firebase/firestore';

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
