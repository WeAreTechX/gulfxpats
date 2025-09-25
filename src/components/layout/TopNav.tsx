'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Briefcase, 
  Building2, 
  BookOpen, 
  User, 
  Menu, 
  X,
  Search
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'Resources', href: '/resources', icon: BookOpen },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function TopNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#101418] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">J</span>
                </div>
                <span className="text-xl font-bold text-[#101418]">
                  Jingu
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                      isActive
                        ? "bg-gray-200 text-[#101418] shadow-sm"
                        : "text-gray-600 hover:text-white hover:bg-[#101418]"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Search & Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-[#101418] transition-colors rounded-full hover:bg-gray-100">
                <Search className="h-5 w-5" />
              </button>
              <button className="bg-[#101418] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#1a1f26] transition-colors">
                Post Job
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-[#101418] transition-colors rounded-full hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-full transition-colors",
                      isActive
                        ? "bg-gray-200 text-[#101418]"
                        : "text-gray-600 hover:text-white hover:bg-[#101418]"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full bg-[#101418] text-white px-4 py-3 rounded-full text-sm font-medium hover:bg-[#1a1f26] transition-colors">
                  Post Job
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
