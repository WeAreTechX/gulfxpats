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
      const { getJobsFromGoogleSheets } = await import('./google-sheets');
      const gsJobs = await getJobsFromGoogleSheets();
      return gsJobs.slice(1);
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

  // Generic method to get a specific job by ID
  async getJobById(id: string): Promise<Job | null> {
    try {
      const { getJobByIdFromGoogleSheets } = await import('./google-sheets');
      const gsJob = await getJobByIdFromGoogleSheets(id);
      return gsJob ? this.transformGoogleSheetsJobToJob(gsJob) : null;
    } catch (error) {
      console.error(`Error fetching job by ID from ${this.config.source}:`, error);
      return null;
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
}

// Create and export default instance
const dataService = new DataService();

// Export the class and instance
export { DataService, dataService };

// Export convenience functions that use the default instance
export const getJobs = () => dataService.getJobs();
export const getCompanies = () => dataService.getCompanies();
export const getResources = () => dataService.getResources();
export const getJobById = (id: string) => dataService.getJobById(id);
export const getCompanyById = (id: string) => dataService.getCompanyById(id);
export const getResourceById = (id: string) => dataService.getResourceById(id);
