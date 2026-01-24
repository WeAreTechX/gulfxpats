'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Briefcase, 
  Building2, 
  BookOpen,
  Users,
  Shield,
  LogOut, 
  User,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Overview', href: '/admin/overview', icon: Home },
  { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { name: 'Companies', href: '/admin/companies', icon: Building2 },
  { name: 'Resources', href: '/admin/resources', icon: BookOpen },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Admins', href: '/admin/admins', icon: Shield },
];

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  const { admin, loading, signOut, isAdmin, isSuperAdmin } = useAdminAuth();

  // Check if we're on the login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // If not on login page and not loading and not admin, redirect to login
    if (!isLoginPage && !loading && !admin) {
      router.push('/admin/login');
    }
  }, [admin, loading, isLoginPage, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  // If we're on the login page, just render children without auth check
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null; // Will redirect to login
  }

  const adminName = `${admin.first_name} ${admin.last_name}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/admin/overview" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">J</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Jingu Admin
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                // Only show Admins link to super admins
                if (item.href === '/admin/admins' && !isSuperAdmin) {
                  return null;
                }
                
                const isActive = pathname === item.href || (pathname === '/admin' && item.href === '/admin/overview');
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Admin Info & Logout */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{adminName}</p>
                  <p className="text-xs text-gray-500 capitalize">{admin.role.replace('_', ' ')}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                // Only show Admins link to super admins
                if (item.href === '/admin/admins' && !isSuperAdmin) {
                  return null;
                }
                
                const isActive = pathname === item.href || (pathname === '/admin' && item.href === '/admin/overview');
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <hr className="my-2 border-gray-200" />
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{adminName}</p>
                    <p className="text-xs text-gray-500 capitalize">{admin.role.replace('_', ' ')}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
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

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
