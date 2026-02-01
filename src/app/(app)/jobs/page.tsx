import { Metadata } from 'next';
import JobsPage from '@/views/JobsPage';

export const metadata: Metadata = {
  title: 'Jobs - GulfXpats',
  description: 'Discover amazing companies and their job opportunities. Browse company profiles, learn about their culture, and find your next career move.',
  keywords: 'companies, employers, job opportunities, company profiles, careers, hiring',
  openGraph: {
    title: 'Jobs - GulfXpats',
    description: 'Discover amazing jobs opportunities.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jobs - GulfXpats',
    description: 'Discover amazing jobs opportunities.',
  },
};

export default function Jobs() {
  return <JobsPage />;
}
