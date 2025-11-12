import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

const ADMIN_EMAIL = 'bilqismustapha2@gmail.com';
const ADMIN_PASSWORD = 'mustabil001';

interface AuthContextType {
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const adminStatus = localStorage.getItem('mustabil_admin');
    if (adminStatus === 'true') {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        localStorage.removeItem('mustabil_admin');
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      try {
        let { data, error } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        });

        if (error && error.message.includes('Invalid login credentials')) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            options: {
              data: {
                full_name: 'Admin',
                role: 'admin',
              },
            },
          });

          if (signUpError) throw signUpError;

          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
          });

          if (signInError) throw signInError;
        } else if (error) {
          throw error;
        }

        setIsAdmin(true);
        localStorage.setItem('mustabil_admin', 'true');
        return true;
      } catch (error) {
        console.error('Admin login error:', error);
        return false;
      }
    }
    return false;
  };

  const logout = async () => {
    setIsAdmin(false);
    localStorage.removeItem('mustabil_admin');
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
