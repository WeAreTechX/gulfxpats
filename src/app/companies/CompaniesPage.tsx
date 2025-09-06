'use client';

import { useState, useEffect, useMemo } from 'react';
import { Company } from '@/types';
import CompanyCard from '@/components/companies/CompanyCard';
import { getCompanies } from '@/lib/airtable';
import { Search, Building2 } from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const airtableCompanies = await getCompanies();
        // Transform Airtable data to our Company interface
        const transformedCompanies: Company[] = airtableCompanies.map(company => ({
          id: company.id,
          name: company.fields.Name || '',
          logo: company.fields.Logo?.[0]?.url,
          description: company.fields.Description || '',
          website: company.fields.Website || '',
          address: company.fields.Address || '',
          industry: company.fields.Industry || '',
          size: company.fields.Size || '',
          founded: company.fields.Founded || 0,
          openJobs: company.fields.OpenRoles || Math.floor(Math.random() * 20) + 1, // Mock data for now
          socialMedia: {
            linkedin: company.fields['LinkedIn URL'],
            twitter: company.fields['Twitter URL'],
            facebook: company.fields['Facebook URL'],
          },
        }));
        console.log(transformedCompanies)
        setCompanies(transformedCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
        // Fallback to mock data if Airtable fails
        setCompanies(getMockCompanies());
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    if (!searchQuery) return companies;
    
    return companies.filter(company =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [companies, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">
          Companies
        </h1>
        <p className="text-gray-600">
          Discover amazing companies and their opportunities. {filteredCompanies.length} companies available.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No companies found.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
}

// Mock data fallback
function getMockCompanies(): Company[] {
  return [
    {
      id: 'techcorp',
      name: 'TechCorp',
      description: 'Leading technology company focused on innovation and cutting-edge solutions for modern businesses.',
      website: 'https://techcorp.com',
      address: 'San Francisco, CA',
      industry: 'Technology',
      size: '500-1000',
      founded: 2015,
      openJobs: 12,
      socialMedia: {
        linkedin: 'https://linkedin.com/company/techcorp',
        twitter: 'https://twitter.com/techcorp',
      },
    },
    {
      id: 'dataflow',
      name: 'DataFlow',
      description: 'Data analytics and processing company helping businesses make data-driven decisions.',
      website: 'https://dataflow.com',
      address: 'New York, NY',
      industry: 'Data & Analytics',
      size: '100-500',
      founded: 2018,
      openJobs: 8,
      socialMedia: {
        linkedin: 'https://linkedin.com/company/dataflow',
      },
    },
    {
      id: 'designstudio',
      name: 'DesignStudio',
      description: 'Creative design agency specializing in user experience and brand identity.',
      website: 'https://designstudio.com',
      address: 'Austin, TX',
      industry: 'Design',
      size: '50-100',
      founded: 2020,
      openJobs: 5,
      socialMedia: {
        linkedin: 'https://linkedin.com/company/designstudio',
        twitter: 'https://twitter.com/designstudio',
        facebook: 'https://facebook.com/designstudio',
      },
    },
  ];
}

