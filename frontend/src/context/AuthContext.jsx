import { createContext, useCallback, useMemo, useState } from 'react';
import * as authService from '@/services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authService.getStoredSession());

  const signIn = useCallback(async (credentials) => {
    const nextSession = await authService.login(credentials);
    setSession(nextSession);
    return nextSession.user;
  }, []);

  const signUp = useCallback(async (values) => {
    const nextSession = await authService.register(values);
    setSession(nextSession);
    return nextSession.user;
  }, []);

  const signOut = useCallback(() => {
    authService.logout();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ user: session?.user ?? null, session, signIn, signUp, signOut }),
    [session, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
