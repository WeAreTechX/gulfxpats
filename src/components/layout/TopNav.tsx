'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Briefcase, 
  Building2, 
  BookOpen, 
  Menu, 
  X,
  LogIn,
  UserPlus,
  LogOut,
  User,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'Resources', href: '/resources', icon: BookOpen },
];

export default function TopNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, profile, signOut, openAuthModal } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  const getUserDisplayName = () => {
    if (profile) {
      return profile.first_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <>
      {/* Auth Modal */}
      <AuthModal />

      {/* Top Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled 
          ? "bg-white/80 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-9 h-9 bg-gradient-to-br from-[#04724D] to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-[#04724D]/20 group-hover:shadow-[#04724D]/40 transition-shadow">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Jingu
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <div className="flex items-center bg-gray-100/80 rounded-full p-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                        isActive
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side - Auth */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#04724D] to-teal-500 rounded-full flex items-center justify-center ring-2 ring-white">
                      <span className="text-white font-medium text-sm">
                        {getUserDisplayName().charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {getUserDisplayName()}
                    </span>
                    <ChevronDown className={cn(
                      "h-4 w-4 text-gray-400 transition-transform",
                      isUserMenuOpen && "rotate-180"
                    )} />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-scale-in">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="h-4 w-4 mr-3 text-gray-400" />
                        Profile
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-700 hover:from-[#035E3F] hover:to-teal-700 rounded-lg transition-all shadow-md shadow-[#04724D]/25 hover:shadow-lg hover:shadow-[#04724D]/30"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 animate-slide-up">
            <div className="px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                      isActive
                        ? "bg-[#E6F4F0] text-[#04724D]"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-gray-100 mt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#04724D] to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {getUserDisplayName().charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl"
                    >
                      <User className="mr-3 h-5 w-5" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        openAuthModal('login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
                    >
                      <LogIn className="mr-2 h-5 w-5" />
                      Login
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal('signup');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#04724D] to-teal-600 rounded-xl"
                    >
                      <UserPlus className="mr-2 h-5 w-5" />
                      Sign up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-16" />
    </>
  );
}
