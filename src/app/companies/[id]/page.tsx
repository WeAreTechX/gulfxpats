import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCompanyById, getJobs } from '@/lib/data-service';
import CompanyDetails from '@/components/companies/CompanyDetails';

interface CompanyPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const company = await getCompanyById(params.id);
  
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
  const company = await getCompanyById(params.id);
  
  if (!company) {
    notFound();
  }

  // Get jobs for this company
  const allJobs = await getJobs();
  const companyJobs = allJobs.filter(job => 
    job.companyName === company.name || job.companyId === company.uid
  );

  return <CompanyDetails company={company} jobs={companyJobs} />;
}

