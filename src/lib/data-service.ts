import 'dotenv/config';
import { Job, Company, Resource } from '@/types';

// Data source types
export type DataSource = 'airtable' | 'google-sheets';

// Configuration interface
interface DataServiceConfig {
  source: DataSource;
}

// Default configuration based on environment variables
const getDefaultConfig = (): DataServiceConfig => {
  const useGoogleSheets = process.env.NEXT_PUBLIC_USE_GOOGLE_SHEETS === 'true';
  return {
    source: useGoogleSheets ? 'google-sheets' : 'airtable'
  };
};

// Data service class
class DataService {
  private config: DataServiceConfig;

  constructor(config?: Partial<DataServiceConfig>) {
    this.config = { ...getDefaultConfig(), ...config };
  }

  // Generic method to get jobs from any source
  async getJobs(): Promise<Job[]> {
    try {
      // First try to get Gulf jobs from storage (server-side only)
      if (typeof window === 'undefined') {
        try {
          const { gulfJobStorage } = await import('./gulf-job-storage');
          const gulfJobs = await gulfJobStorage.loadLatestJobs();
          if (gulfJobs.length > 0) {
            console.log(`Loaded ${gulfJobs.length} Gulf jobs from storage`);
            return gulfJobStorage.transformToJobs(gulfJobs);
          }
        } catch (gulfError) {
          console.log(gulfError);
          console.log('Gulf jobs not available, falling back to Google Sheets');
        }
      }

      return []
    } catch (error) {
      console.error(`Error fetching jobs from ${this.config.source}:`, error);
      return [];
    }
  }

  // Generic method to get companies from any source
  async getCompanies(): Promise<Company[]> {
    try {
      const { getCompaniesFromGoogleSheets } = await import('./google-sheets');
      const gsCompanies = await getCompaniesFromGoogleSheets();
      console.log(gsCompanies);
      return gsCompanies.slice(1);
    } catch (error) {
      console.error(`Error fetching companies from ${this.config.source}:`, error);
      return [];
    }
  }

  // Generic method to get a specific company by ID
  async getCompanyById(id: string): Promise<Company | null> {
    try {
      const { getCompanyByIdFromGoogleSheets } = await import('./google-sheets');
      const gsCompany = await getCompanyByIdFromGoogleSheets(id);
      return gsCompany ? this.transformGoogleSheetsCompanyToCompany(gsCompany) : null;
    } catch (error) {
      console.error(`Error fetching company by ID from ${this.config.source}:`, error);
      return null;
    }
  }

  // Generic method to get resources from any source
  async getResources(): Promise<Resource[]> {
    try {
      const { getResourcesFromGoogleSheets } = await import('./google-sheets');
      const gsResources = await getResourcesFromGoogleSheets();
      return gsResources.map(resource => this.transformGoogleSheetsResourceToResource(resource));
    } catch (error) {
      console.error(`Error fetching resources from ${this.config.source}:`, error);
      return [];
    }
  }

  // Generic method to get a specific resource by ID
  async getResourceById(id: string): Promise<Resource | null> {
    try {
      const { getResourceByIdFromGoogleSheets } = await import('./google-sheets');
      const gsResource = await getResourceByIdFromGoogleSheets(id);
      return gsResource ? this.transformGoogleSheetsResourceToResource(gsResource) : null;
    } catch (error) {
      console.error(`Error fetching resource by ID from ${this.config.source}:`, error);
      return null;
    }
  }

  // Transformation methods for Google Sheets data
  private transformGoogleSheetsJobToJob(gsJob: any): Job {
    return gsJob;
  }

  private transformGoogleSheetsCompanyToCompany(gsCompany: any): Company {
    return gsCompany;
  }

  private transformGoogleSheetsResourceToResource(gsResource: any): Resource {
    return {
      id: gsResource.id,
      title: gsResource.title,
      type: gsResource.type as any,
      url: gsResource.url,
      description: gsResource.description,
      duration: gsResource.duration,
      author: gsResource.author,
      publishedAt: gsResource.publishedDate,
      tags: gsResource.tags ? gsResource.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [],
    };
  }

  // Method to get Gulf jobs specifically
  async getGulfJobs(): Promise<Job[]> {
    try {
      if (typeof window === 'undefined') {
        const { gulfJobStorage } = await import('./gulf-job-storage');
        const gulfJobs = await gulfJobStorage.loadLatestJobs();
        return gulfJobStorage.transformToJobs(gulfJobs);
      }
      return [];
    } catch (error) {
      console.error('Error fetching Gulf jobs:', error);
      return [];
    }
  }

  // Method to get jobs by country
  async getJobsByCountry(country: string): Promise<Job[]> {
    try {
      if (typeof window === 'undefined') {
        const { gulfJobStorage } = await import('./gulf-job-storage');
        const gulfJobs = await gulfJobStorage.loadLatestJobs();
        const filteredJobs = gulfJobs.filter(job => 
          job.location.toLowerCase().includes(country.toLowerCase())
        );
        return gulfJobStorage.transformToJobs(filteredJobs);
      }
      return [];
    } catch (error) {
      console.error(`Error fetching jobs for ${country}:`, error);
      return [];
    }
  }

  // Method to get jobs by city
  async getJobsByCity(city: string, country?: string): Promise<Job[]> {
    try {
      if (typeof window === 'undefined') {
        const { gulfJobStorage } = await import('./gulf-job-storage');
        const gulfJobs = await gulfJobStorage.loadLatestJobs();
        let filteredJobs = gulfJobs.filter(job => 
          job.location.toLowerCase().includes(city.toLowerCase())
        );
        
        if (country) {
          filteredJobs = filteredJobs.filter(job => 
            job.location.toLowerCase().includes(country.toLowerCase())
          );
        }
        
        return gulfJobStorage.transformToJobs(filteredJobs);
      }
      return [];
    } catch (error) {
      console.error(`Error fetching jobs for ${city}:`, error);
      return [];
    }
  }

  // Method to get job statistics
  async getJobStatistics(): Promise<any> {
    try {
      if (typeof window === 'undefined') {
        const { gulfJobStorage } = await import('./gulf-job-storage');
        return await gulfJobStorage.getJobStatistics();
      }
      return null;
    } catch (error) {
      console.error('Error getting job statistics:', error);
      return null;
    }
  }
}

// Create and export default instance
const dataService = new DataService();

// Export the class and instance
export { DataService, dataService };

// Export convenience functions that use the default instance
export const getJobs = () => dataService.getJobs();
export const getCompanies = () => dataService.getCompanies();
export const getCompanyById = (id: string) => dataService.getCompanyById(id);
export const getResources = () => dataService.getResources();
export const getResourceById = (id: string) => dataService.getResourceById(id);

// Export Gulf job functions
export const getGulfJobs = () => dataService.getGulfJobs();
export const getJobsByCountry = (country: string) => dataService.getJobsByCountry(country);
export const getJobsByCity = (city: string, country?: string) => dataService.getJobsByCity(city, country);
export const getJobStatistics = () => dataService.getJobStatistics();
