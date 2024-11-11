import { ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebaseInit';
import { AuthContext } from './AuthContext';
import type { GoogleUserInfo } from '../types/user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GoogleUserInfo | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (googleUser) => {
      const limitedUserInfo = {
        uid: googleUser?.uid ?? '',
        photoURL: googleUser?.photoURL ?? '',
        displayName: googleUser?.displayName ?? '',
        email: googleUser?.email ?? '',
      };
      const user = googleUser ? limitedUserInfo : null;
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
