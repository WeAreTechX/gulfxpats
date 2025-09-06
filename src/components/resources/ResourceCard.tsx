import { Resource } from '@/types';
import { formatDate } from '@/lib/utils';
import { 
  Play, 
  Headphones, 
  FileText, 
  ExternalLink, 
  Clock,
  User
} from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
}

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Play className="h-5 w-5" />;
    case 'audio':
      return <Headphones className="h-5 w-5" />;
    case 'article':
      return <FileText className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const getResourceTypeColor = (type: string) => {
  switch (type) {
    case 'video':
      return 'bg-red-100 text-red-800';
    case 'audio':
      return 'bg-blue-100 text-blue-800';
    case 'article':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            {getResourceIcon(resource.type)}
          </div>
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResourceTypeColor(resource.type)}`}>
              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
            </span>
          </div>
        </div>
        {resource.duration && (
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{resource.duration}</span>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
        {resource.title}
      </h3>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {resource.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-gray-500 text-sm">
          <User className="h-4 w-4 mr-1" />
          <span>{resource.author}</span>
        </div>
        <span className="text-gray-400 text-sm">
          {formatDate(resource.publishedAt)}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {resource.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
        {resource.tags.length > 3 && (
          <span className="text-gray-500 text-xs px-2 py-1">
            +{resource.tags.length - 3} more
          </span>
        )}
      </div>

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-black font-medium hover:underline"
      >
        {resource.type === 'video' ? 'Watch' : 
         resource.type === 'audio' ? 'Listen' : 'Read'}
        <ExternalLink className="h-4 w-4 ml-1" />
      </a>
    </div>
  );
}

