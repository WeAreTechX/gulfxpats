import { Metadata } from 'next';
import CompaniesPage from '@/views/CompaniesPage';

export const metadata: Metadata = {
  title: 'Companies - GulfXpats',
  description: 'Discover amazing companies and their job opportunities. Browse company profiles, learn about their culture, and find your next career move.',
  keywords: 'companies, employers, job opportunities, company profiles, careers, hiring',
  openGraph: {
    title: 'Companies - GulfXpats',
    description: 'Discover amazing companies and their job opportunities.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Companies - GulfXpats',
    description: 'Discover amazing companies and their job opportunities.',
  },
};

export default function Companies() {
  return <CompaniesPage />;
}
