import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCompanyById, getJobs } from '@/lib/airtable';
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
    title: `${company.fields.Name} - Company Profile - Jingu`,
    description: company.fields.Description || `Learn more about ${company.fields.Name} and their job opportunities.`,
    keywords: `${company.fields.Name}, company, jobs, careers, ${company.fields.Industry}`,
    openGraph: {
      title: `${company.fields.Name} - Company Profile`,
      description: company.fields.Description || `Learn more about ${company.fields.Name} and their job opportunities.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${company.fields.Name} - Company Profile`,
      description: company.fields.Description || `Learn more about ${company.fields.Name} and their job opportunities.`,
    },
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const airtableCompany = await getCompanyById(params.id);
  
  if (!airtableCompany) {
    notFound();
  }

  // Get jobs for this company
  const allJobs = await getJobs();
  const companyJobs = allJobs.filter(job => 
    job.fields.Company?.includes(airtableCompany.fields.Name)
  );

  // Transform Airtable data to our Company interface
  const company = {
    id: airtableCompany.id,
    name: airtableCompany.fields.Name || '',
    logo: airtableCompany.fields.Logo?.[0]?.url,
    description: airtableCompany.fields.Description || '',
    website: airtableCompany.fields.Website || '',
    address: airtableCompany.fields.Address || '',
    industry: airtableCompany.fields.Industry || '',
    size: airtableCompany.fields.Size || '',
    founded: airtableCompany.fields.Founded || 0,
    openJobs: companyJobs.length,
    socialMedia: {
      linkedin: airtableCompany.fields['LinkedIn URL'],
      twitter: airtableCompany.fields['Twitter URL'],
      facebook: airtableCompany.fields['Facebook URL'],
    },
  };

  // Transform jobs data
  const jobs = companyJobs.map(job => ({
    id: job.id,
    title: job.fields.Title || '',
    company: job.fields.Company?.[0] || '',
    companyId: job.fields.Company?.[0] || '',
    location: job.fields.Location || '',
    type: (job.fields.Type?.toLowerCase() as any) || 'full-time',
    remote: job.fields.Remote || false,
    salary: job.fields['Salary Min'] && job.fields['Salary Max'] ? {
      min: job.fields['Salary Min'],
      max: job.fields['Salary Max'],
      currency: job.fields.Currency || 'USD'
    } : undefined,
    description: job.fields.Description || '',
    requirements: job.fields.Requirements ? job.fields.Requirements.split('\n') : [],
    benefits: job.fields.Benefits ? job.fields.Benefits.split('\n') : [],
    postedAt: job.fields['Posted Date'] || new Date().toISOString(),
    applicationUrl: job.fields['Application URL'] || '',
    tags: job.fields.Tags ? job.fields.Tags.split(',').map(tag => tag.trim()) : [],
  }));

  return <CompanyDetails company={company} jobs={jobs} />;
}

