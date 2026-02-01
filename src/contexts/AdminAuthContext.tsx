'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {User as SupabaseUser, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/server/supabase/client';
import {Admin, Statuses} from "@/types";

interface AdminAuthContextType {
  user: SupabaseUser | null;
  admin: Admin | null;
  cachedAdmin: Admin | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; admin: Admin | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  refreshAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);
const supabase = getSupabaseClient();

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [cachedAdmin, setCachedAdmin] = useState<Admin | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminProfile = async (email: string): Promise<Admin | null> => {
    try {
      const response = await fetch(`/api/admins/${email}`);
      const { data } = await response.json();

      if (data.status_id !== Statuses.Active) {
        console.log("Susi")
        console.log('Admin account is not active');
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      await signOut();
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    let initializedLocal = false;

    // Get initial session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user && session?.user?.user_metadata?.role) {
          const adminData = await fetchAdminProfile(session.user.email!);
          if (mounted) {
            setAdmin(adminData);
            if (adminData) {
              setCachedAdmin(adminData);
            } else {
              setCachedAdmin(null);
            }
          }
        } else {
          setCachedAdmin(null);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          initializedLocal = true;
        }
      }
    };

    initSession().then();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_OUT') {
        setAdmin(null);
        setCachedAdmin(null);
        setLoading(false);
      } else if (event === 'SIGNED_IN' && session?.user && session?.user?.user_metadata?.role) {
        // Only fetch on explicit sign in events after initialization
        if (initializedLocal) {
          const adminData = await fetchAdminProfile(session.user.email!);
          if (mounted) {
            setAdmin(adminData);
            if (adminData) {
              setCachedAdmin(adminData);
            }
            setLoading(false);
          }
        }
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // On token refresh, just ensure loading is false
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      const response = await fetch(`/api/admins/${email}`);
      const { data: adminData } = await response.json();

      if (!adminData) {
        await supabase.auth.signOut();
        throw new Error('You do not have admin access');
      }

      // Check if admin is active
      if (adminData.status_id !== Statuses.Active) {
        await supabase.auth.signOut();
        throw new Error('Your admin account is deactivated');
      }

      // Set state immediately - this ensures the UI updates before redirect
      setUser(data.user);
      setSession(data.session);
      setAdmin(adminData);
      // Save admin data to localStorage for fast initial load
      setCachedAdmin(adminData);
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
    // Clear localStorage on sign out
    setCachedAdmin(null);
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

  const refreshAdmin = async () => {
    if (user) {
      const adminData = await fetchAdminProfile(user.email!);
      setAdmin(adminData);
      if (adminData) {
        setCachedAdmin(adminData);
      } else {
        setCachedAdmin(null);
      }
    }
  };

  const isAdmin = !!admin;
  const isSuperAdmin = admin?.role === 'super_admin';

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        admin,
        cachedAdmin,
        session,
        loading,
        isAdmin,
        isSuperAdmin,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
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
