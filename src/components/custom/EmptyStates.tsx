'use client';

import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

// Job Search Empty State Illustration
export function JobsEmptyIllustration({ className = "w-64 h-64" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background elements */}
      <circle cx="200" cy="200" r="150" fill="#F5F3FF" />
      <circle cx="200" cy="200" r="120" fill="#EDE9FE" />
      
      {/* Floating documents */}
      <g className="animate-float" style={{ animationDelay: '0s' }}>
        <rect x="80" y="120" width="80" height="100" rx="8" fill="white" stroke="#C4B5FD" strokeWidth="2"/>
        <rect x="92" y="140" width="56" height="4" rx="2" fill="#DDD6FE"/>
        <rect x="92" y="152" width="40" height="4" rx="2" fill="#DDD6FE"/>
        <rect x="92" y="164" width="48" height="4" rx="2" fill="#DDD6FE"/>
        <rect x="92" y="190" width="20" height="16" rx="4" fill="#A78BFA"/>
      </g>
      
      {/* Main briefcase */}
      <g transform="translate(140, 130)">
        <rect x="20" y="40" width="80" height="60" rx="8" fill="#8B5CF6"/>
        <rect x="20" y="40" width="80" height="20" rx="8" fill="#7C3AED"/>
        <rect x="40" y="30" width="40" height="20" rx="4" fill="#6D28D9"/>
        <rect x="50" y="25" width="20" height="10" rx="2" fill="#5B21B6"/>
        <circle cx="60" cy="75" r="8" fill="#DDD6FE"/>
        <rect x="56" y="71" width="8" height="8" rx="2" fill="#7C3AED"/>
      </g>
      
      {/* Floating elements */}
      <g className="animate-float" style={{ animationDelay: '0.5s' }}>
        <rect x="260" y="140" width="60" height="70" rx="6" fill="white" stroke="#C4B5FD" strokeWidth="2"/>
        <rect x="272" y="155" width="36" height="3" rx="1.5" fill="#DDD6FE"/>
        <rect x="272" y="165" width="28" height="3" rx="1.5" fill="#DDD6FE"/>
        <rect x="272" y="175" width="32" height="3" rx="1.5" fill="#DDD6FE"/>
        <circle cx="282" cy="195" r="8" fill="#10B981"/>
        <path d="M278 195L281 198L287 192" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      
      {/* Magnifying glass */}
      <g transform="translate(230, 220)">
        <circle cx="35" cy="35" r="28" stroke="#A78BFA" strokeWidth="6" fill="white"/>
        <line x1="55" y1="55" x2="80" y2="80" stroke="#A78BFA" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="35" cy="35" r="15" fill="#F5F3FF"/>
      </g>
      
      {/* Stars */}
      <path d="M320 100L323 108L331 108L325 113L327 121L320 117L313 121L315 113L309 108L317 108L320 100Z" fill="#FBBF24"/>
      <path d="M90 260L92 266L98 266L93 270L95 276L90 272L85 276L87 270L82 266L88 266L90 260Z" fill="#FBBF24"/>
      <path d="M340 200L341 204L345 204L342 207L343 211L340 208L337 211L338 207L335 204L339 204L340 200Z" fill="#A78BFA"/>
      
      {/* Dots pattern */}
      <circle cx="70" cy="180" r="3" fill="#DDD6FE"/>
      <circle cx="330" cy="160" r="3" fill="#DDD6FE"/>
      <circle cx="120" cy="280" r="4" fill="#C4B5FD"/>
      <circle cx="290" cy="280" r="3" fill="#DDD6FE"/>
    </svg>
  );
}

// Companies Empty State Illustration
export function CompaniesEmptyIllustration({ className = "w-64 h-64" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <circle cx="200" cy="200" r="150" fill="#ECFDF5"/>
      <circle cx="200" cy="200" r="120" fill="#D1FAE5"/>
      
      {/* Main building */}
      <g transform="translate(130, 100)">
        <rect x="20" y="60" width="100" height="130" rx="4" fill="#10B981"/>
        <rect x="20" y="60" width="100" height="20" fill="#059669"/>
        
        {/* Windows */}
        <rect x="35" y="95" width="18" height="22" rx="2" fill="#D1FAE5"/>
        <rect x="61" y="95" width="18" height="22" rx="2" fill="#D1FAE5"/>
        <rect x="87" y="95" width="18" height="22" rx="2" fill="#D1FAE5"/>
        
        <rect x="35" y="130" width="18" height="22" rx="2" fill="#D1FAE5"/>
        <rect x="61" y="130" width="18" height="22" rx="2" fill="#D1FAE5"/>
        <rect x="87" y="130" width="18" height="22" rx="2" fill="#D1FAE5"/>
        
        {/* Door */}
        <rect x="55" y="165" width="30" height="45" rx="2" fill="#065F46"/>
        <circle cx="80" cy="188" r="2" fill="#D1FAE5"/>
      </g>
      
      {/* Small building left */}
      <g className="animate-float" style={{ animationDelay: '0.3s' }}>
        <rect x="60" y="180" width="50" height="70" rx="4" fill="white" stroke="#A7F3D0" strokeWidth="2"/>
        <rect x="70" y="195" width="12" height="15" rx="2" fill="#D1FAE5"/>
        <rect x="88" y="195" width="12" height="15" rx="2" fill="#D1FAE5"/>
        <rect x="70" y="220" width="12" height="15" rx="2" fill="#D1FAE5"/>
        <rect x="88" y="220" width="12" height="15" rx="2" fill="#D1FAE5"/>
      </g>
      
      {/* Small building right */}
      <g className="animate-float" style={{ animationDelay: '0.6s' }}>
        <rect x="290" y="170" width="50" height="80" rx="4" fill="white" stroke="#A7F3D0" strokeWidth="2"/>
        <rect x="300" y="185" width="12" height="15" rx="2" fill="#D1FAE5"/>
        <rect x="318" y="185" width="12" height="15" rx="2" fill="#D1FAE5"/>
        <rect x="300" y="210" width="12" height="15" rx="2" fill="#D1FAE5"/>
        <rect x="318" y="210" width="12" height="15" rx="2" fill="#D1FAE5"/>
        <rect x="309" y="235" width="12" height="15" rx="2" fill="#10B981"/>
      </g>
      
      {/* Clouds */}
      <g opacity="0.6">
        <ellipse cx="100" cy="100" rx="25" ry="15" fill="white"/>
        <ellipse cx="120" cy="95" rx="20" ry="12" fill="white"/>
        <ellipse cx="85" cy="95" rx="15" ry="10" fill="white"/>
      </g>
      <g opacity="0.6">
        <ellipse cx="320" cy="120" rx="20" ry="12" fill="white"/>
        <ellipse cx="335" cy="116" rx="15" ry="9" fill="white"/>
      </g>
      
      {/* Stars/sparkles */}
      <path d="M80 140L82 146L88 146L83 150L85 156L80 152L75 156L77 150L72 146L78 146L80 140Z" fill="#FBBF24"/>
      <path d="M330 180L331 184L335 184L332 187L333 191L330 188L327 191L328 187L325 184L329 184L330 180Z" fill="#10B981"/>
      
      {/* Ground line */}
      <path d="M50 290Q200 280 350 290" stroke="#A7F3D0" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

// Resources Empty State Illustration  
export function ResourcesEmptyIllustration({ className = "w-64 h-64" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <circle cx="200" cy="200" r="150" fill="#FEF3C7"/>
      <circle cx="200" cy="200" r="120" fill="#FDE68A"/>
      
      {/* Main book */}
      <g transform="translate(120, 120)">
        <path d="M80 20V140C80 145.523 75.5228 150 70 150H20C14.4772 150 10 145.523 10 140V20C10 14.4772 14.4772 10 20 10H70C75.5228 10 80 14.4772 80 20Z" fill="#F59E0B"/>
        <path d="M80 20V140C80 145.523 84.4772 150 90 150H140C145.523 150 150 145.523 150 140V20C150 14.4772 145.523 10 140 10H90C84.4772 10 80 14.4772 80 20Z" fill="#FBBF24"/>
        <rect x="80" y="10" width="6" height="140" fill="#D97706"/>
        <rect x="25" y="35" width="40" height="4" rx="2" fill="#FDE68A"/>
        <rect x="25" y="50" width="30" height="4" rx="2" fill="#FDE68A"/>
        <rect x="25" y="65" width="35" height="4" rx="2" fill="#FDE68A"/>
        <rect x="95" y="35" width="40" height="4" rx="2" fill="white" opacity="0.6"/>
        <rect x="95" y="50" width="35" height="4" rx="2" fill="white" opacity="0.6"/>
        <rect x="95" y="65" width="30" height="4" rx="2" fill="white" opacity="0.6"/>
        {/* Bookmark */}
        <path d="M55 10V45L62 38L69 45V10H55Z" fill="#EF4444"/>
      </g>
      
      {/* Floating notebook */}
      <g className="animate-float" style={{ animationDelay: '0.2s' }}>
        <rect x="60" y="160" width="50" height="60" rx="4" fill="white" stroke="#FCD34D" strokeWidth="2"/>
        <rect x="70" y="175" width="30" height="3" rx="1.5" fill="#FDE68A"/>
        <rect x="70" y="185" width="25" height="3" rx="1.5" fill="#FDE68A"/>
        <rect x="70" y="195" width="28" height="3" rx="1.5" fill="#FDE68A"/>
        <rect x="60" y="160" width="8" height="60" fill="#F59E0B" rx="4"/>
      </g>
      
      {/* Floating pencil */}
      <g className="animate-float" style={{ animationDelay: '0.5s' }} transform="translate(290, 140) rotate(25)">
        <rect x="0" y="0" width="60" height="10" rx="2" fill="#F59E0B"/>
        <polygon points="60,0 75,5 60,10" fill="#FDE68A"/>
        <rect x="0" y="0" width="8" height="10" rx="2" fill="#FCD34D"/>
        <rect x="70" y="3" width="8" height="4" fill="#374151"/>
      </g>
      
      {/* Light bulb (ideas) */}
      <g transform="translate(300, 220)">
        <circle cx="25" cy="25" r="20" fill="#FBBF24"/>
        <circle cx="25" cy="25" r="14" fill="#FEF3C7"/>
        <rect x="20" y="45" width="10" height="8" fill="#F59E0B"/>
        <rect x="18" y="53" width="14" height="4" rx="2" fill="#D97706"/>
        <path d="M21 25V35M29 25V35M25 28V35" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
      </g>
      
      {/* Stars */}
      <path d="M320 100L323 108L331 108L325 113L327 121L320 117L313 121L315 113L309 108L317 108L320 100Z" fill="#F59E0B"/>
      <path d="M80 120L82 126L88 126L83 130L85 136L80 132L75 136L77 130L72 126L78 126L80 120Z" fill="#FBBF24"/>
      
      {/* Dots */}
      <circle cx="100" cy="280" r="4" fill="#FCD34D"/>
      <circle cx="310" cy="280" r="3" fill="#FDE68A"/>
      <circle cx="340" cy="170" r="3" fill="#FCD34D"/>
    </svg>
  );
}

// Generic Empty State Component
export function EmptyState({ title, description, action, children }: EmptyStateProps & { children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {children}
      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2 text-center">{title}</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}

// Jobs Empty State
export function JobsEmptyState({ action }: { action?: ReactNode }) {
  return (
    <EmptyState
      title="No jobs found"
      description="We're working on adding new opportunities. Check back soon or try adjusting your search filters."
      action={action}
    >
      <JobsEmptyIllustration />
    </EmptyState>
  );
}

// Companies Empty State
export function CompaniesEmptyState({ action }: { action?: ReactNode }) {
  return (
    <EmptyState
      title="No companies yet"
      description="We're building our company directory. Check back soon to discover amazing employers."
      action={action}
    >
      <CompaniesEmptyIllustration />
    </EmptyState>
  );
}

// Resources Empty State
export function ResourcesEmptyState({ action }: { action?: ReactNode }) {
  return (
    <EmptyState
      title="No resources available"
      description="Career resources are coming soon. We're curating the best content to help you succeed."
      action={action}
    >
      <ResourcesEmptyIllustration />
    </EmptyState>
  );
}

// Search No Results
export function SearchEmptyIllustration({ className = "w-48 h-48" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="150" cy="150" r="100" fill="#F3F4F6"/>
      
      {/* Magnifying glass */}
      <circle cx="130" cy="130" r="50" stroke="#9CA3AF" strokeWidth="8" fill="white"/>
      <line x1="165" y1="165" x2="210" y2="210" stroke="#9CA3AF" strokeWidth="12" strokeLinecap="round"/>
      
      {/* Question mark */}
      <path d="M120 115C120 105 128 100 138 100C148 100 156 108 156 118C156 128 148 132 138 138V145" stroke="#D1D5DB" strokeWidth="6" strokeLinecap="round"/>
      <circle cx="138" cy="158" r="4" fill="#D1D5DB"/>
      
      {/* Floating elements */}
      <circle cx="80" cy="80" r="6" fill="#E5E7EB"/>
      <circle cx="220" cy="100" r="4" fill="#E5E7EB"/>
      <circle cx="230" cy="180" r="5" fill="#E5E7EB"/>
      <circle cx="70" cy="190" r="4" fill="#E5E7EB"/>
    </svg>
  );
}

export function SearchEmptyState({ query, action }: { query?: string; action?: ReactNode }) {
  return (
    <EmptyState
      title={query ? `No results for "${query}"` : "No results found"}
      description="Try adjusting your search terms or filters to find what you're looking for."
      action={action}
    >
      <SearchEmptyIllustration />
    </EmptyState>
  );
}
