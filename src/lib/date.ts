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

export const formatAmount = (amount: number, currency: string = '₦'): string => {
  if (amount) amount = parseFloat(`${amount}`);
  return `${currency}${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const calculateProgress = (contributed: number, target: number): number => {
  return Math.min((contributed / target) * 100, 100);
};
