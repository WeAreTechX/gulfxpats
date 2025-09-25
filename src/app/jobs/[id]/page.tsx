import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getJobById } from '@/lib/data-service';
import JobDetails from '@/components/jobs/JobDetails';

interface JobPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const job = await getJobById(params.id);
  
  if (!job) {
    return {
      title: 'Job Not Found',
    };
  }

  return {
    title: `${job.title} at ${job.companyName || 'Company'} - Jingu`,
    description: job.description || `Apply for ${job.title} position.`,
    keywords: `${job.title}, ${job.companyName}, jobs, careers, employment`,
    openGraph: {
      title: `${job.title} at ${job.companyName || 'Company'}`,
      description: job.description || `Apply for ${job.title} position.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${job.title} at ${job.companyName || 'Company'}`,
      description: job.description || `Apply for ${job.title} position.`,
    },
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const job = await getJobById(params.id);
  
  if (!job) {
    notFound();
  }

  return <JobDetails job={job} />;
}

