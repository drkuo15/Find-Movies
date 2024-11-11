import { createContext } from 'react';
import type { GoogleUserInfo } from '../types/user';

interface AuthContextType {
  user: GoogleUserInfo | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);
