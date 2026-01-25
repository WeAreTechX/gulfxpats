import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';

dayjs.extend(relativeTime);

export const formatDate = (date: string | Date, style: 'y-m-d' | 'short' | 'medium' | 'long' | 'relative' = 'medium', separator = '|'): string => {
  const dayjsDate = dayjs(date);

  switch (style) {
    case 'y-m-d':
      return dayjsDate.format('YYYY-MM-DD');
    case 'short':
      return dayjsDate.format('MMM D, YYYY');
    case 'medium':
      return dayjsDate.format(`MMM D, YYYY ${separator} h:mm A`);
    case 'long':
      return dayjsDate.format(`dddd, MMMM D, YYYY ${separator} h:mm A`);
    case 'relative':
      return dayjsDate.fromNow();
    default:
      return dayjsDate.format(`MMM D, YYYY ${separator} h:mm A`);
  }
};

export function getRelativeTime(date: string): string {
  const now = new Date();
  const posted = new Date(date);
  const diffInMs = now.getTime() - posted.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}