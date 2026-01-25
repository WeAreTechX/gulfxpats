import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSalary(min: number, max: number, currency: string = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return `${formatter.format(min)} - ${formatter.format(max)}`;
}

export const formatAmount = (amount: number, currency: string = '$'): string => {
  if (amount) amount = parseFloat(`${amount}`);
  return `${currency}${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Initials
export const getInitials = (first_name: string, last_name: string) => {
  return `${first_name.charAt(0)}${last_name.charAt(0)}`.toUpperCase();
};

// FullName
export const getFullName = ({ first_name, last_name } : { first_name: string; last_name: string }) => {
  return `${first_name} ${last_name}`;
};
