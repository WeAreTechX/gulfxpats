'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Briefcase, 
  Building2, 
  LogOut, 
  User,
  Menu,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Check if we're on the login page
  const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/admin/login';

  useEffect(() => {
    // If we're on the login page, don't check auth
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    // Check if admin is logged in using sessionStorage
    const checkAuth = () => {
      try {
        const adminData = sessionStorage.getItem('admin_session');
        
        if (adminData) {
          const admin = JSON.parse(adminData);
          
          // Check if session is expired (24 hours)
          const loginTime = new Date(admin.loginTime);
          const now = new Date();
          const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
          
          if (hoursDiff > 24) {
            // Session expired
            sessionStorage.removeItem('admin_session');
            router.push('/admin/login');
          } else {
            setIsLoggedIn(true);
            setAdminName(admin.name || 'Admin');
          }
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        sessionStorage.removeItem('admin_session');
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    try {
      // Clear sessionStorage
      sessionStorage.removeItem('admin_session');
      setIsLoggedIn(false);
      setAdminName('');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // If we're on the login page, just render children without auth check
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101418]"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/admin" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#101418] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">J</span>
                </div>
                <span className="text-xl font-bold text-[#101418]">
                  Jingu
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/admin/overview"
                className="flex items-center space-x-2 text-gray-700 hover:text-[#101418] transition-colors"
              >
                <Home className="h-5 w-5" />
                <span>Overview</span>
              </Link>
              <Link
                href="/admin/jobs"
                className="flex items-center space-x-2 text-gray-700 hover:text-[#101418] transition-colors"
              >
                <Briefcase className="h-5 w-5" />
                <span>Jobs</span>
              </Link>
              <Link
                href="/admin/companies"
                className="flex items-center space-x-2 text-gray-700 hover:text-[#101418] transition-colors"
              >
                <Building2 className="h-5 w-5" />
                <span>Companies</span>
              </Link>
            </div>

            {/* Admin Info & Logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="font-medium">{adminName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#101418] hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-4">
              <Link
                href="/admin/overview"
                className="flex items-center space-x-2 text-gray-700 hover:text-[#101418] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Overview</span>
              </Link>
              <Link
                href="/admin/jobs"
                className="flex items-center space-x-2 text-gray-700 hover:text-[#101418] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Briefcase className="h-5 w-5" />
                <span>Jobs</span>
              </Link>
              <Link
                href="/admin/companies"
                className="flex items-center space-x-2 text-gray-700 hover:text-[#101418] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Building2 className="h-5 w-5" />
                <span>Companies</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
