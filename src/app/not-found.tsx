import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 Illustration */}
        <div className="mb-8">
          <span className="text-9xl font-bold bg-gradient-to-r from-[#04724D] to-teal-600 bg-clip-text text-transparent">
            404
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page not found
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. 
          It might have been moved or doesn&apos;t exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#04724D] text-white rounded-xl font-medium hover:bg-[#035E3F] transition-colors shadow-lg shadow-[#04724D]/25"
          >
            <Home className="h-5 w-5 mr-2" />
            Go home
          </Link>
          
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            <Search className="h-5 w-5 mr-2" />
            Browse Jobs
          </Link>
        </div>
        
        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/jobs" className="text-[#04724D] hover:text-[#035E3F] font-medium">
              Jobs
            </Link>
            <Link href="/companies" className="text-[#04724D] hover:text-[#035E3F] font-medium">
              Companies
            </Link>
            <Link href="/resources" className="text-[#04724D] hover:text-[#035E3F] font-medium">
              Resources
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
