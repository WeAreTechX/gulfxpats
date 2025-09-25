import 'dotenv/config';
import { Job } from '@/types';

// Gulf countries configuration
export const GULF_COUNTRIES = {
  UAE: { name: 'United Arab Emirates', code: 'AE', cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'] },
  SAUDI: { name: 'Saudi Arabia', code: 'SA', cities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Dhahran'] },
  QATAR: { name: 'Qatar', code: 'QA', cities: ['Doha', 'Al Rayyan', 'Al Wakrah', 'Al Khor'] },
  KUWAIT: { name: 'Kuwait', code: 'KW', cities: ['Kuwait City', 'Al Ahmadi', 'Hawalli', 'Farwaniya'] },
  BAHRAIN: { name: 'Bahrain', code: 'BH', cities: ['Manama', 'Riffa', 'Muharraq', 'Hamad Town'] },
  OMAN: { name: 'Oman', code: 'OM', cities: ['Muscat', 'Salalah', 'Sohar', 'Nizwa'] }
};

// Job site configurations
export const JOB_SITES = {
  BAYT: {
    name: 'Bayt.com',
    baseUrl: 'https://www.bayt.com',
    searchUrl: 'https://www.bayt.com/en/jobs/',
    selectors: {
      jobCard: '.job-card',
      title: '.job-title a',
      company: '.company-name',
      location: '.job-location',
      description: '.job-description',
      salary: '.salary',
      postedDate: '.posted-date',
      jobType: '.job-type'
    }
  },
  GULFTALENT: {
    name: 'GulfTalent',
    baseUrl: 'https://www.gulftalent.com',
    searchUrl: 'https://www.gulftalent.com/jobs/',
    selectors: {
      jobCard: '.job-item',
      title: '.job-title a',
      company: '.company-name',
      location: '.job-location',
      description: '.job-description',
      salary: '.salary',
      postedDate: '.posted-date',
      jobType: '.job-type'
    }
  },
  NAUKRIGULF: {
    name: 'Naukrigulf',
    baseUrl: 'https://www.naukrigulf.com',
    searchUrl: 'https://www.naukrigulf.com/jobs/',
    selectors: {
      jobCard: '.job-item',
      title: '.job-title a',
      company: '.company-name',
      location: '.job-location',
      description: '.job-description',
      salary: '.salary',
      postedDate: '.posted-date',
      jobType: '.job-type'
    }
  }
};

// Job categories for Gulf countries
export const JOB_CATEGORIES = [
  'Engineering',
  'IT & Software',
  'Finance & Banking',
  'Healthcare',
  'Education',
  'Sales & Marketing',
  'Human Resources',
  'Administration',
  'Customer Service',
  'Hospitality',
  'Construction',
  'Oil & Gas',
  'Aviation',
  'Real Estate',
  'Retail',
  'Logistics',
  'Government',
  'Consulting'
];

export interface ScrapedJob {
  uid: string;
  title: string;
  description: string;
  basicRequirements: string;
  preferredRequirements: string;
  status: 'open' | 'closed' | 'paused';
  postedDate: string;
  location: string;
  type: 'full-time' | 'contract' | 'part-time' | 'internship';
  remote: boolean;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  companyId: string;
  companyName: string;
  companyIndustry: string;
  companySize: string;
  hiringManager: string;
  hiringManagerContact: string;
  source: string;
  sourceUrl: string;
  scrapedAt: string;
}

export class GulfJobScraper {
  private jobs: ScrapedJob[] = [];
  private readonly maxJobsPerSite = 100;
  private readonly delayBetweenRequests = 2000; // 2 seconds

  constructor() {
    this.jobs = [];
  }

  // Main method to scrape jobs from all Gulf countries
  async scrapeAllGulfJobs(): Promise<ScrapedJob[]> {
    console.log('Starting Gulf job scraping...');
    this.jobs = [];

    try {
      // Scrape from each job site
      await this.scrapeFromBayt();
      await this.delay(this.delayBetweenRequests);
      
      await this.scrapeFromGulfTalent();
      await this.delay(this.delayBetweenRequests);
      
      await this.scrapeFromNaukriGulf();
      await this.delay(this.delayBetweenRequests);

      // Remove duplicates based on title and company
      this.jobs = this.removeDuplicates(this.jobs);
      
      console.log(`Successfully scraped ${this.jobs.length} jobs from Gulf countries`);
      return this.jobs;
    } catch (error) {
      console.error('Error scraping Gulf jobs:', error);
      throw error;
    }
  }

  // Scrape jobs from Bayt.com
  private async scrapeFromBayt(): Promise<void> {
    console.log('Scraping from Bayt.com...');
    
    for (const [countryKey, country] of Object.entries(GULF_COUNTRIES)) {
      for (const city of country.cities) {
        try {
          const jobs = await this.scrapeBaytJobs(country.name, city);
          this.jobs.push(...jobs);
          console.log(`Found ${jobs.length} jobs in ${city}, ${country.name}`);
          await this.delay(1000); // Delay between city requests
        } catch (error) {
          console.error(`Error scraping Bayt jobs for ${city}, ${country.name}:`, error);
        }
      }
    }
  }

  // Scrape jobs from GulfTalent
  private async scrapeFromGulfTalent(): Promise<void> {
    console.log('Scraping from GulfTalent...');
    
    for (const [countryKey, country] of Object.entries(GULF_COUNTRIES)) {
      for (const city of country.cities) {
        try {
          const jobs = await this.scrapeGulfTalentJobs(country.name, city);
          this.jobs.push(...jobs);
          console.log(`Found ${jobs.length} jobs in ${city}, ${country.name}`);
          await this.delay(1000);
        } catch (error) {
          console.error(`Error scraping GulfTalent jobs for ${city}, ${country.name}:`, error);
        }
      }
    }
  }

  // Scrape jobs from NaukriGulf
  private async scrapeFromNaukriGulf(): Promise<void> {
    console.log('Scraping from NaukriGulf...');
    
    for (const [countryKey, country] of Object.entries(GULF_COUNTRIES)) {
      for (const city of country.cities) {
        try {
          const jobs = await this.scrapeNaukriGulfJobs(country.name, city);
          this.jobs.push(...jobs);
          console.log(`Found ${jobs.length} jobs in ${city}, ${country.name}`);
          await this.delay(1000);
        } catch (error) {
          console.error(`Error scraping NaukriGulf jobs for ${city}, ${country.name}:`, error);
        }
      }
    }
  }

  // Individual site scraping methods (simplified for demonstration)
  private async scrapeBaytJobs(country: string, city: string): Promise<ScrapedJob[]> {
    // This is a simplified implementation
    // In a real implementation, you would use libraries like Puppeteer or Playwright
    // to handle JavaScript-rendered content and complex scraping scenarios
    
    const mockJobs: ScrapedJob[] = [];
    
    // Generate mock data for demonstration
    const jobTitles = [
      'Software Engineer', 'Data Analyst', 'Marketing Manager', 'Sales Executive',
      'HR Manager', 'Accountant', 'Project Manager', 'Business Analyst',
      'Customer Service Representative', 'Operations Manager'
    ];

    const companies = [
      'Emirates Airlines', 'ADNOC', 'Saudi Aramco', 'Qatar Airways',
      'Dubai Islamic Bank', 'Emaar Properties', 'Al Futtaim Group',
      'Majid Al Futtaim', 'Aldar Properties', 'Mubadala Investment Company'
    ];

    // Generate 5-10 mock jobs per city
    const jobCount = Math.floor(Math.random() * 6) + 5;
    
    for (let i = 0; i < jobCount; i++) {
      const job: ScrapedJob = {
        uid: `bayt_${country.toLowerCase().replace(/\s+/g, '_')}_${city.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}_${i}`,
        title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
        description: `Exciting opportunity for a ${jobTitles[Math.floor(Math.random() * jobTitles.length)]} position in ${city}, ${country}. Join our dynamic team and contribute to innovative projects.`,
        basicRequirements: 'Bachelor\'s degree in relevant field, 2+ years experience',
        preferredRequirements: 'Master\'s degree, industry certifications, leadership experience',
        status: 'open',
        postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        location: `${city}, ${country}`,
        type: ['full-time', 'contract', 'part-time', 'internship'][Math.floor(Math.random() * 4)] as any,
        remote: Math.random() > 0.7,
        salaryMin: Math.floor(Math.random() * 5000) + 3000,
        salaryMax: Math.floor(Math.random() * 10000) + 8000,
        currency: 'AED',
        companyId: `company_${Math.floor(Math.random() * 1000)}`,
        companyName: companies[Math.floor(Math.random() * companies.length)],
        companyIndustry: JOB_CATEGORIES[Math.floor(Math.random() * JOB_CATEGORIES.length)],
        companySize: ['1-50', '51-200', '201-500', '501-1000', '1000+'][Math.floor(Math.random() * 5)],
        hiringManager: 'HR Department',
        hiringManagerContact: 'hr@company.com',
        source: 'Bayt.com',
        sourceUrl: `https://www.bayt.com/en/jobs/${city.toLowerCase().replace(/\s+/g, '-')}-${country.toLowerCase().replace(/\s+/g, '-')}/`,
        scrapedAt: new Date().toISOString()
      };
      
      mockJobs.push(job);
    }
    
    return mockJobs;
  }

  private async scrapeGulfTalentJobs(country: string, city: string): Promise<ScrapedJob[]> {
    // Similar implementation for GulfTalent
    const mockJobs: ScrapedJob[] = [];
    
    const jobTitles = [
      'Senior Developer', 'Financial Analyst', 'Operations Director', 'Marketing Specialist',
      'HR Business Partner', 'Senior Accountant', 'Product Manager', 'UX Designer',
      'Customer Success Manager', 'Supply Chain Manager'
    ];

    const companies = [
      'Qatar Foundation', 'Kuwait Investment Authority', 'Bahrain Economic Development Board',
      'Oman Investment Authority', 'Abu Dhabi Investment Authority', 'Saudi Public Investment Fund',
      'Dubai International Financial Centre', 'Qatar Financial Centre'
    ];

    const jobCount = Math.floor(Math.random() * 6) + 5;
    
    for (let i = 0; i < jobCount; i++) {
      const job: ScrapedJob = {
        uid: `gulftalent_${country.toLowerCase().replace(/\s+/g, '_')}_${city.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}_${i}`,
        title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
        description: `Join our team as a ${jobTitles[Math.floor(Math.random() * jobTitles.length)]} in ${city}, ${country}. We offer competitive packages and growth opportunities.`,
        basicRequirements: 'Relevant degree, 3+ years experience, strong communication skills',
        preferredRequirements: 'Industry experience, leadership skills, multilingual abilities',
        status: 'open',
        postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        location: `${city}, ${country}`,
        type: ['full-time', 'contract', 'part-time', 'internship'][Math.floor(Math.random() * 4)] as any,
        remote: Math.random() > 0.8,
        salaryMin: Math.floor(Math.random() * 6000) + 4000,
        salaryMax: Math.floor(Math.random() * 12000) + 10000,
        currency: 'USD',
        companyId: `company_${Math.floor(Math.random() * 1000)}`,
        companyName: companies[Math.floor(Math.random() * companies.length)],
        companyIndustry: JOB_CATEGORIES[Math.floor(Math.random() * JOB_CATEGORIES.length)],
        companySize: ['1-50', '51-200', '201-500', '501-1000', '1000+'][Math.floor(Math.random() * 5)],
        hiringManager: 'Talent Acquisition',
        hiringManagerContact: 'talent@company.com',
        source: 'GulfTalent',
        sourceUrl: `https://www.gulftalent.com/jobs/${city.toLowerCase().replace(/\s+/g, '-')}-${country.toLowerCase().replace(/\s+/g, '-')}/`,
        scrapedAt: new Date().toISOString()
      };
      
      mockJobs.push(job);
    }
    
    return mockJobs;
  }

  private async scrapeNaukriGulfJobs(country: string, city: string): Promise<ScrapedJob[]> {
    // Similar implementation for NaukriGulf
    const mockJobs: ScrapedJob[] = [];
    
    const jobTitles = [
      'DevOps Engineer', 'Business Development Manager', 'Financial Controller', 'IT Manager',
      'Digital Marketing Specialist', 'Senior Consultant', 'Quality Assurance Engineer',
      'Business Intelligence Analyst', 'Technical Writer', 'Compliance Officer'
    ];

    const companies = [
      'Dubai Silicon Oasis', 'Abu Dhabi Global Market', 'DIFC', 'QFC',
      'Kuwait Financial Centre', 'Bahrain Financial Harbour', 'Oman Economic Zone',
      'Saudi Vision 2030 Companies', 'UAE Vision 2071 Companies'
    ];

    const jobCount = Math.floor(Math.random() * 6) + 5;
    
    for (let i = 0; i < jobCount; i++) {
      const job: ScrapedJob = {
        uid: `naukrigulf_${country.toLowerCase().replace(/\s+/g, '_')}_${city.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}_${i}`,
        title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
        description: `We are looking for a talented ${jobTitles[Math.floor(Math.random() * jobTitles.length)]} to join our growing team in ${city}, ${country}.`,
        basicRequirements: 'Bachelor\'s degree, relevant experience, problem-solving skills',
        preferredRequirements: 'Advanced degree, industry knowledge, team leadership experience',
        status: 'open',
        postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        location: `${city}, ${country}`,
        type: ['full-time', 'contract', 'part-time', 'internship'][Math.floor(Math.random() * 4)] as any,
        remote: Math.random() > 0.6,
        salaryMin: Math.floor(Math.random() * 4000) + 2500,
        salaryMax: Math.floor(Math.random() * 8000) + 6000,
        currency: 'USD',
        companyId: `company_${Math.floor(Math.random() * 1000)}`,
        companyName: companies[Math.floor(Math.random() * companies.length)],
        companyIndustry: JOB_CATEGORIES[Math.floor(Math.random() * JOB_CATEGORIES.length)],
        companySize: ['1-50', '51-200', '201-500', '501-1000', '1000+'][Math.floor(Math.random() * 5)],
        hiringManager: 'Recruitment Team',
        hiringManagerContact: 'recruitment@company.com',
        source: 'NaukriGulf',
        sourceUrl: `https://www.naukrigulf.com/jobs/${city.toLowerCase().replace(/\s+/g, '-')}-${country.toLowerCase().replace(/\s+/g, '-')}/`,
        scrapedAt: new Date().toISOString()
      };
      
      mockJobs.push(job);
    }
    
    return mockJobs;
  }

  // Remove duplicate jobs based on title and company
  private removeDuplicates(jobs: ScrapedJob[]): ScrapedJob[] {
    const seen = new Set<string>();
    return jobs.filter(job => {
      const key = `${job.title.toLowerCase()}_${job.companyName.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Utility method to add delay between requests
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Transform scraped job to match the Job interface
  transformToJob(scrapedJob: ScrapedJob): Job {
    return {
      uid: scrapedJob.uid,
      title: scrapedJob.title,
      description: scrapedJob.description,
      basicRequirements: scrapedJob.basicRequirements,
      preferredRequirements: scrapedJob.preferredRequirements,
      status: scrapedJob.status,
      postedDate: scrapedJob.postedDate,
      location: scrapedJob.location,
      type: scrapedJob.type,
      remote: scrapedJob.remote,
      salaryMin: scrapedJob.salaryMin,
      salaryMax: scrapedJob.salaryMax,
      currency: scrapedJob.currency,
      companyId: scrapedJob.companyId,
      companyName: scrapedJob.companyName,
      companyIndustry: scrapedJob.companyIndustry,
      companySize: scrapedJob.companySize,
      hiringManager: scrapedJob.hiringManager,
      hiringManagerContact: scrapedJob.hiringManagerContact
    };
  }

  // Get jobs by country
  async getJobsByCountry(countryCode: string): Promise<ScrapedJob[]> {
    const country = Object.values(GULF_COUNTRIES).find(c => c.code === countryCode);
    if (!country) {
      throw new Error(`Country with code ${countryCode} not found`);
    }
    
    return this.jobs.filter(job => 
      job.location.toLowerCase().includes(country.name.toLowerCase())
    );
  }

  // Get jobs by city
  async getJobsByCity(city: string, country?: string): Promise<ScrapedJob[]> {
    return this.jobs.filter(job => {
      const locationMatch = job.location.toLowerCase().includes(city.toLowerCase());
      if (country) {
        return locationMatch && job.location.toLowerCase().includes(country.toLowerCase());
      }
      return locationMatch;
    });
  }

  // Get jobs by category
  async getJobsByCategory(category: string): Promise<ScrapedJob[]> {
    return this.jobs.filter(job => 
      job.companyIndustry.toLowerCase().includes(category.toLowerCase()) ||
      job.title.toLowerCase().includes(category.toLowerCase())
    );
  }
}

// Export singleton instance
export const gulfJobScraper = new GulfJobScraper();
