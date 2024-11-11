import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../../utils/firebaseInit';
import { createUser } from './firestore';

export async function signIn() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const { user } = result;
  await createUser(user.uid);
  return user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}
