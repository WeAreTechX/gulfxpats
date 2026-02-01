'use client';

import {createContext, useContext, useEffect, useState, ReactNode, useMemo} from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/server/supabase/client';
import {User, UserCreate} from "@/types";
import {useRouter} from "next/navigation";

interface AuthContextType {
  user: SupabaseUser | null;
  profile: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (payload: UserCreate) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  openAuthModal: (mode: 'login' | 'signup' | 'forgot-password') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'signup' | 'forgot-password' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot-password' | null>(null);

  // const supabase = getSupabaseClient();
  const supabase = useMemo(() => getSupabaseClient(), []);

  const fetchProfile = async (email: string) => {
    try {
      const response = await fetch(`/api/users/${email}`);
      const { data } = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user?.user_metadata?.role && session.user.user_metadata.role === 'user') {
          await fetchProfile(session.user.email!);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user?.user_metadata?.role && session.user.user_metadata.role === 'user') {
        await fetchProfile(session.user.email!);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signUp = async (payload: UserCreate): Promise<{ error: Error | null }> => {
    try {
      // Sign up with Supabase Auth
      // The database trigger 'on_auth_user_created' automatically creates
      // the user profile in public.users using the metadata below
      const { error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            email: payload.first_name,
            first_name: payload.first_name,
            last_name: payload.last_name,
            country: payload.country,
            role: 'user'
          }
        }
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    router.push('/');
  };

  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const openAuthModal = (mode: 'login' | 'signup' | 'forgot-password') => {
    setAuthModalMode(mode);
  };

  const closeAuthModal = () => {
    setAuthModalMode(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        openAuthModal,
        closeAuthModal,
        authModalMode,
      }}
    >
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
