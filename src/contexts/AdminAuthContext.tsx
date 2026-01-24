'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '../../server/supabase/client';

interface Admin {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'super_admin';
  status_id: number;
  created_at: string;
  modified_at: string;
}

interface AdminAuthContextType {
  user: SupabaseUser | null;
  admin: Admin | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; admin: Admin | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  refreshAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  
  const supabase = getSupabaseClient();

  const fetchAdminProfile = useCallback(async (userId: string): Promise<Admin | null> => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.log('User is not an admin:', error.message);
        return null;
      }
      
      // Check if admin is active (status_id = 1)
      if (data.status_id !== 1) {
        console.log('Admin account is not active');
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      return null;
    }
  }, [supabase]);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const adminData = await fetchAdminProfile(session.user.id);
          if (mounted) {
            setAdmin(adminData);
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_OUT') {
        setAdmin(null);
        setLoading(false);
      } else if (session?.user && initialized) {
        // Only fetch admin profile on auth change if already initialized
        // This prevents double-fetching on initial load
        const adminData = await fetchAdminProfile(session.user.id);
        if (mounted) {
          setAdmin(adminData);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchAdminProfile, initialized, supabase.auth]);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null; admin: Admin | null }> => {
    try {
      setLoading(true);
      
      // First, authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (!data.user) {
        throw new Error('Login failed');
      }

      // Check if the user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (adminError || !adminData) {
        // User is not an admin, sign them out
        await supabase.auth.signOut();
        throw new Error('You do not have admin access');
      }

      // Check if admin is active
      if (adminData.status_id !== 1) {
        await supabase.auth.signOut();
        throw new Error('Your admin account is deactivated');
      }

      // Set state immediately - this ensures the UI updates before redirect
      setUser(data.user);
      setSession(data.session);
      setAdmin(adminData);
      setLoading(false);
      
      return { error: null, admin: adminData };
    } catch (error) {
      setLoading(false);
      return { error: error as Error, admin: null };
    }
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setAdmin(null);
    setSession(null);
    setLoading(false);
  };

  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const refreshAdmin = async () => {
    if (user) {
      const adminData = await fetchAdminProfile(user.id);
      setAdmin(adminData);
    }
  };

  const isAdmin = !!admin;
  const isSuperAdmin = admin?.role === 'super_admin';

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        admin,
        session,
        loading,
        isAdmin,
        isSuperAdmin,
        signIn,
        signOut,
        resetPassword,
        refreshAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
