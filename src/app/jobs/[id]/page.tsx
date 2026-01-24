import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import JobDetails from '@/components/jobs/JobDetails';

interface JobPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getJob(id: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data: job, error } = await supabase
    .from('jobs')
    .select(`
      *,
      company:companies(*),
      job_type:job_types(*),
      currency:currencies(*),
      status:statuses(*)
    `)
    .eq('id', id)
    .single();

  if (error || !job) {
    return null;
  }

  return job;
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);
  
  if (!job) {
    return {
      title: 'Job Not Found',
    };
  }

  const companyName = job.company?.name || 'Company';

  return {
    title: `${job.title} at ${companyName} - Jingu`,
    description: job.description || `Apply for ${job.title} position.`,
    keywords: `${job.title}, ${companyName}, jobs, careers, employment`,
    openGraph: {
      title: `${job.title} at ${companyName}`,
      description: job.description || `Apply for ${job.title} position.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${job.title} at ${companyName}`,
      description: job.description || `Apply for ${job.title} position.`,
    },
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;
  const job = await getJob(id);
  
  if (!job) {
    notFound();
  }

  // Transform to match expected format
  const transformedJob = {
    id: job.id,
    uid: job.id,
    title: job.title,
    description: job.description,
    location: job.location,
    type: job.job_type?.code || 'full-time',
    remote: job.location?.toLowerCase().includes('remote') || false,
    salaryMin: job.salary_min,
    salaryMax: job.salary_max,
    currency: job.currency?.code || 'USD',
    currencySymbol: job.currency?.symbol || '$',
    applyUrl: job.apply_url,
    companyId: job.company_id,
    companyName: job.company?.name,
    companyLogo: job.company?.logo_url,
    companyWebsite: job.company?.website,
    companyDescription: job.company?.description,
    postedDate: job.created_at,
    status: job.status?.code || 'active',
    metadata: job.metadata,
  };

  return <JobDetails job={transformedJob} />;
}
