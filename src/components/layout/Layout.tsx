'use client';

import { usePathname } from 'next/navigation';
import TopNav from './TopNav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  // Don't show main layout wrapper if we're on admin routes (they have their own layout)
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    // Admin routes use their own layout, just render children
    return <>{children}</>;
  }

  // For non-admin routes, show TopNav and main layout
  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <TopNav />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

