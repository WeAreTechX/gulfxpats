'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Briefcase, 
  Building2, 
  BookOpen,
  Users,
  Shield,
  Database,
  LogOut, 
  ChevronLeft,
  ChevronRight,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Overview', href: '/admin/overview', icon: LayoutDashboard },
  { name: 'Sources', href: '/admin/sources', icon: Database },
  { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { name: 'Companies', href: '/admin/companies', icon: Building2 },
  { name: 'Resources', href: '/admin/resources', icon: BookOpen },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Admins', href: '/admin/admins', icon: Shield, superAdminOnly: true },
];

// Content loader component for inner section
function ContentLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  const { admin, loading, signOut, cachedAdmin } = useAdminAuth();

  // Use cached admin data for immediate UI rendering
  const displayAdmin = admin || cachedAdmin;

  // Check if we're on the login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // If not on login page and not loading and no admin (including cache), redirect to login
    if (!isLoginPage && !loading && !admin && !cachedAdmin) {
      router.replace('/admin/login');
    }
  }, [admin, cachedAdmin, loading, isLoginPage, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    router.replace('/admin/login');
  };

  // If we're on the login page, just render children without auth check
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If no admin data at all (not even cached), show nothing while redirecting
  if (!loading && !admin && !cachedAdmin) {
    return null;
  }

  const adminName = displayAdmin ? `${displayAdmin.first_name} ${displayAdmin.last_name}` : '';
  const adminInitials = displayAdmin ? `${displayAdmin.first_name[0]}${displayAdmin.last_name[0]}`.toUpperCase() : 'AD';

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full bg-slate-950 border-r border-slate-800
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className={`h-16 flex items-center border-b border-slate-800 ${sidebarCollapsed ? 'justify-center px-4' : 'px-6'}`}>
          <Link href="/admin/overview" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            {!sidebarCollapsed && (
              <span className="text-lg font-semibold text-white">
                Jingu
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            // Only show Admins link to super admins
            const isSuperAdminUser = displayAdmin?.role === 'super_admin';
            if (item.superAdminOnly && !isSuperAdminUser) {
              return null;
            }
            
            const isActive = pathname === item.href || (pathname === '/admin' && item.href === '/admin/overview');
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                  ${sidebarCollapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }
                `}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-slate-800 p-3">
          <div className={`
            flex items-center gap-3 p-3 rounded-xl bg-slate-900/50
            ${sidebarCollapsed ? 'justify-center' : ''}
          `}>
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {adminInitials}
            </div>
            {!sidebarCollapsed && displayAdmin && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{adminName}</p>
                <p className="text-xs text-slate-500 capitalize">{displayAdmin.role.replace('_', ' ')}</p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className={`
              mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
            title={sidebarCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle - Desktop Only */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>

      {/* Main Content */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}
      `}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              
              {/* Mobile User Avatar */}
              <div className="lg:hidden w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                {adminInitials}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {loading ? <ContentLoader /> : children}
          </div>
        </main>
      </div>
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
