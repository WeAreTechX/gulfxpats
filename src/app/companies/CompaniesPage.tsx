'use client';

import { useState, useEffect, useMemo } from 'react';
import { Company } from '@/types';
import CompanyCard from '@/components/companies/CompanyCard';
import CompanyFilters from '@/components/companies/CompanyFilters';
import { getCompanies } from '@/lib/data-service';
import { Building2 } from 'lucide-react';

interface CompanyFilters {
  query: string;
  location: string;
  industry: string;
  openJobs: boolean;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CompanyFilters>({
    query: '',
    location: '',
    industry: '',
    openJobs: false,
  });
  const [sort, setSort] = useState({ field: 'name', direction: 'asc' });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companies = await getCompanies();
        console.log('Fetched companies:', companies);
        setCompanies(companies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = companies.filter(company => {
      const matchesQuery = !filters.query || 
        company.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        company.description.toLowerCase().includes(filters.query.toLowerCase());
      
      const matchesLocation = !filters.location || 
        company.location.toLowerCase().includes(filters.location.toLowerCase()) ||
        company.address.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesIndustry = !filters.industry || 
        company.description.toLowerCase().includes(filters.industry.toLowerCase());
      
      const matchesOpenJobs = !filters.openJobs || 
        (company.openJobs && company.openJobs > 0);

      return matchesQuery && matchesLocation && matchesIndustry && matchesOpenJobs;
    });

    // Sort companies
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sort.field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'location':
          aValue = a.location.toLowerCase();
          bValue = b.location.toLowerCase();
          break;
        case 'industry':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [companies, filters, sort]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101418]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#101418] mb-2">
          Companies
        </h1>
        <p className="text-gray-600">
          Discover amazing companies and their opportunities. {filteredAndSortedCompanies.length} companies available.
        </p>
      </div>

      {/* Filters */}
      <CompanyFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSortChange={setSort}
      />

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedCompanies.map((company) => (
          <CompanyCard key={company.uid} company={company} />
        ))}
      </div>

      {filteredAndSortedCompanies.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No companies found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
}

