'use client';

import { Resource } from '@/types';
import { ExternalLink, BookOpen, Video, Headphones, FileText, Wrench } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  blog: FileText,
  article: FileText,
  video: Video,
  course: BookOpen,
  podcast: Headphones,
  tool: Wrench,
  ebook: BookOpen,
};

const typeColors: Record<string, string> = {
  blog: 'bg-blue-100 text-blue-700',
  article: 'bg-blue-100 text-blue-700',
  video: 'bg-red-100 text-red-700',
  course: 'bg-green-100 text-green-700',
  podcast: 'bg-purple-100 text-purple-700',
  tool: 'bg-orange-100 text-orange-700',
  ebook: 'bg-teal-100 text-teal-700',
};

export default function ResourceCard({ resource }: ResourceCardProps) {
  const IconComponent = typeIcons[resource.type.name] || BookOpen;
  const colorClass = typeColors[resource.type.name] || 'bg-gray-100 text-gray-700';

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
          <IconComponent className="h-3 w-3 mr-1" />
          {resource.type.name.charAt(0).toUpperCase() + resource.type.name.slice(1)}
        </div>
        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-[#101418] transition-colors" />
      </div>

      <h3 className="font-semibold text-[#101418] mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
        {resource.title}
      </h3>

      {resource.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {resource.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          {resource.created_by && (
            <span>By {resource.created_by.first_name}</span>
          )}
        </div>
        {resource.created_at && (
          <span>{formatDate(resource.created_at as string)}</span>
        )}
      </div>

      {resource.tags && resource.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="text-xs text-gray-400">
              +{resource.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </a>
  );
}
