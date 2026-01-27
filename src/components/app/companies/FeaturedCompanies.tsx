'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CompanyCard from '@/components/app/companies/CompanyCard';
import { CompaniesEmptyState } from '@/components/custom/EmptyStates';
import {ArrowRight, Building2
} from 'lucide-react';
import { Company } from '@/types/companies';

export default function FeaturedCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const  companiesRes = await fetch('/api/companies?limit=4&order=rank')
        const companiesData = await companiesRes.json();
        if (companiesData.success) setCompanies(companiesData.data.list);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#E6F4F0] rounded-full"></div>
            <div className="w-16 h-16 border-4 border-transparent border-t-[#04724D] rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-500 text-sm animate-pulse">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 -mx-4 px-4 sm:mx-0 sm:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Top Employers</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Trusted Companies</h2>
          <p className="text-gray-600 mt-2">Join teams at these amazing organizations</p>
        </div>
        <Link
          href="/companies"
          className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors group shadow-sm"
        >
          View All Companies
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {companies && companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {companies.map((company, index) => (
            <div
              key={company.id}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <CompanyCard key={company.id} company={company} />
            </div>
          ))}
        </div>
      ) : (
        <CompaniesEmptyState
          action={
            <Link
              href="/companies"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              Explore Companies
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          }
        />
      )}
    </section>
  );
}
