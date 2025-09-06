import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getJobById } from '@/lib/airtable';
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
    title: `${job.fields.Title} at ${job.fields.Company?.[0] || 'Company'} - Jingu`,
    description: job.fields.Description || `Apply for ${job.fields.Title} position.`,
    keywords: `${job.fields.Title}, ${job.fields.Company?.[0]}, jobs, careers, employment`,
    openGraph: {
      title: `${job.fields.Title} at ${job.fields.Company?.[0] || 'Company'}`,
      description: job.fields.Description || `Apply for ${job.fields.Title} position.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${job.fields.Title} at ${job.fields.Company?.[0] || 'Company'}`,
      description: job.fields.Description || `Apply for ${job.fields.Title} position.`,
    },
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const airtableJob = await getJobById(params.id);
  
  if (!airtableJob) {
    notFound();
  }

  // Transform Airtable data to our Job interface
  const job = {
    id: airtableJob.id,
    title: airtableJob.fields.Title || '',
    company: airtableJob.fields.Company?.[0] || '',
    companyId: airtableJob.fields.Company?.[0] || '',
    location: airtableJob.fields.Location || '',
    type: (airtableJob.fields.Type?.toLowerCase() as any) || 'full-time',
    remote: airtableJob.fields.Remote || false,
    salary: airtableJob.fields['Salary Min'] && airtableJob.fields['Salary Max'] ? {
      min: airtableJob.fields['Salary Min'],
      max: airtableJob.fields['Salary Max'],
      currency: airtableJob.fields.Currency || 'USD'
    } : undefined,
    description: airtableJob.fields.Description || '',
    requirements: airtableJob.fields.Requirements ? airtableJob.fields.Requirements.split('\n') : [],
    benefits: airtableJob.fields.Benefits ? airtableJob.fields.Benefits.split('\n') : [],
    postedAt: airtableJob.fields['Posted Date'] || new Date().toISOString(),
    applicationUrl: airtableJob.fields['Application URL'] || '',
    tags: airtableJob.fields.Tags ? airtableJob.fields.Tags.split(',').map(tag => tag.trim()) : [],
  };

  return <JobDetails job={job} />;
}

