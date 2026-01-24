'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase/client';

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
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = getSupabaseClient();

  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchAdminProfile(session.user.id);
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
      
      if (session?.user) {
        await fetchAdminProfile(session.user.id);
      } else {
        setAdmin(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAdminProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // User is not an admin
        console.log('User is not an admin:', error.message);
        setAdmin(null);
        return;
      }
      
      // Check if admin is active (status_id = 1)
      if (data.status_id !== 1) {
        console.log('Admin account is not active');
        setAdmin(null);
        return;
      }
      
      setAdmin(data);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      setAdmin(null);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
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

      setAdmin(adminData);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAdmin(null);
    setSession(null);
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
