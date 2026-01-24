import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '../../../../server/supabase/server';
import CompanyDetails from '@/components/companies/CompanyDetails';

interface CompanyPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getCompany(id: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data: company, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !company) {
    return null;
  }

  return company;
}

async function getCompanyJobs(companyId: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select(`
      *,
      company:companies(*),
      job_type:job_types(*),
      currency:currencies(*),
      status:statuses(*)
    `)
    .eq('company_id', companyId)
    .eq('status_id', 1) // Only active jobs
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching company jobs:', error);
    return [];
  }

  return jobs || [];
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { id } = await params;
  const company = await getCompany(id);
  
  if (!company) {
    return {
      title: 'Company Not Found',
    };
  }

  return {
    title: `${company.name} - Company Profile - Jingu`,
    description: company.description || `Learn more about ${company.name} and their job opportunities.`,
    keywords: `${company.name}, company, jobs, careers`,
    openGraph: {
      title: `${company.name} - Company Profile`,
      description: company.description || `Learn more about ${company.name} and their job opportunities.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${company.name} - Company Profile`,
      description: company.description || `Learn more about ${company.name} and their job opportunities.`,
    },
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params;
  const company = await getCompany(id);
  
  if (!company) {
    notFound();
  }

  const jobs = await getCompanyJobs(id);

  // Transform to match expected format
  const transformedCompany = {
    id: company.id,
    uid: company.id,
    name: company.name,
    description: company.description,
    website: company.website,
    logo: company.logo_url,
    location: company.location,
    contactPerson: company.contact_person,
  };

  const transformedJobs = jobs.map((job: any) => ({
    id: job.id,
    uid: job.id,
    title: job.title,
    description: job.description,
    location: job.location,
    type: job.job_type?.code || 'full-time',
    salaryMin: job.salary_min,
    salaryMax: job.salary_max,
    currency: job.currency?.code || 'USD',
    applyUrl: job.apply_url,
    companyId: job.company_id,
    companyName: job.company?.name,
    postedDate: job.created_at,
  }));

  return <CompanyDetails company={transformedCompany} jobs={transformedJobs} />;
}
