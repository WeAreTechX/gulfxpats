'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CompanyCard from '@/components/app/companies/CompanyCard';
import CompanyPreviewModal from '@/components/app/companies/CompanyPreviewModal';
import { CompaniesEmptyState } from '@/components/custom/EmptyStates';
import { ArrowRight } from 'lucide-react';
import { Company } from '@/types';

export default function FeaturedCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesRes = await fetch('/api/companies?page_size=9');
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

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

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
    <>
      <section className="py-15">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Top Companies</h2>
            <p className="text-gray-600 mt-2">Join teams at these amazing organizations</p>
          </div>
          {companies && companies.length > 0 && (
            <Link
              href="/companies"
              className="flex items-center justify-center px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl font-medium hover:bg-gray-800 transition-colors group"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {companies && companies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {companies.map((company, index) => (
                <div
                  key={company.id}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <CompanyCard
                    company={company}
                    onViewCompany={handleViewCompany}
                  />
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link
                href="/companies"
                className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl font-medium hover:bg-gray-800 transition-colors group"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100">
            <CompaniesEmptyState />
          </div>
        )}
      </section>

      <CompanyPreviewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        company={selectedCompany}
      />
    </>
  );
}
