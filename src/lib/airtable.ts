import 'dotenv/config';

import Airtable from 'airtable';
import { 
  getJobsFromGoogleSheets, 
  getCompaniesFromGoogleSheets, 
  getResourcesFromGoogleSheets,
  transformGoogleSheetsJob,
  transformGoogleSheetsCompany,
  transformGoogleSheetsResource
} from './google-sheets';

// Initialize Airtable only if API key is available
const base = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY && process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID
  ? new Airtable({
      apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
    }).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID)
  : null;

export interface AirtableJob {
  id: string;
  fields: {
    Title: string;
    Company: string[];
    Location: string;
    Type: string;
    Remote: boolean;
    'Salary Min': number;
    'Salary Max': number;
    Currency: string;
    Description: string;
    Requirements: string;
    Benefits: string;
    'Posted Date': string;
    'Application URL': string;
    Tags: string;
  };
}

export interface AirtableCompany {
  id: string;
  fields: {
    Name: string;
    Logo: Array<{ url: string }>;
    Description: string;
    Website: string;
    Address: string;
    Industry: string;
    Size: string;
    Founded: number;
    OpenRoles: number;
    'LinkedIn URL': string;
    'Twitter URL': string;
    'Facebook URL': string;
  };
}

export interface AirtableResource {
  id: string;
  fields: {
    Title: string;
    Type: string;
    URL: string;
    Description: string;
    Duration: string;
    Author: string;
    'Published Date': string;
    Tags: string;
  };
}

export async function getJobs(): Promise<AirtableJob[]> {
  // Check if we should use Google Sheets instead
  if (process.env.NEXT_PUBLIC_USE_GOOGLE_SHEETS === 'true') {
    try {
      const gsJobs = await getJobsFromGoogleSheets();
      return gsJobs.map(job => ({
        id: job.id,
        fields: {
          Title: job.title,
          Company: [job.company],
          Location: job.location,
          Type: job.type,
          Remote: job.remote,
          'Salary Min': job.salaryMin,
          'Salary Max': job.salaryMax,
          Currency: job.currency,
          Description: job.description,
          Requirements: job.requirements,
          Benefits: job.benefits,
          'Posted Date': job.postedDate,
          'Application URL': job.applicationUrl,
          Tags: job.tags,
        }
      }));
    } catch (error) {
      console.error('Error fetching jobs from Google Sheets:', error);
      return [];
    }
  }

  if (!base) {
    console.log('Airtable not configured, returning empty array');
    return [];
  }

  try {
    const records = await base('Jobs').select({
      view: 'Grid view'
    }).all();
    
    return records.map(record => ({
      id: record.id,
      fields: record.fields as any
    }));
  } catch (error) {
    console.error('Error fetching jobs from Airtable:', error);
    return [];
  }
}

export async function getCompanies(): Promise<AirtableCompany[]> {
  // Check if we should use Google Sheets instead
  if (process.env.NEXT_PUBLIC_USE_GOOGLE_SHEETS === 'true') {
    try {
      const gsCompanies = await getCompaniesFromGoogleSheets();
      return gsCompanies.map(company => ({
        id: company.id,
        fields: {
          Name: company.name,
          Logo: company.logo ? [{ url: company.logo }] : [],
          Description: company.description,
          Website: company.website,
          Address: company.address,
          Industry: company.industry,
          Size: company.size,
          Founded: company.founded,
          OpenRoles: company.openRoles,
          'LinkedIn URL': company.linkedinUrl,
          'Twitter URL': company.twitterUrl,
          'Facebook URL': company.facebookUrl,
        }
      }));
    } catch (error) {
      console.error('Error fetching companies from Google Sheets:', error);
      return [];
    }
  }

  if (!base) {
    console.log('Airtable not configured, returning empty array');
    return [];
  }

  try {
    const records = await base('Companies').select({
      view: 'Grid view'
    }).all();
    
    return records.map(record => ({
      id: record.id,
      fields: record.fields as any
    }));
  } catch (error) {
    console.error('Error fetching companies from Airtable:', error);
    return [];
  }
}

export async function getResources(): Promise<AirtableResource[]> {
  // Check if we should use Google Sheets instead
  if (process.env.NEXT_PUBLIC_USE_GOOGLE_SHEETS === 'true') {
    try {
      const gsResources = await getResourcesFromGoogleSheets();
      return gsResources.map(resource => ({
        id: resource.id,
        fields: {
          Title: resource.title,
          Type: resource.type,
          URL: resource.url,
          Description: resource.description,
          Duration: resource.duration,
          Author: resource.author,
          'Published Date': resource.publishedDate,
          Tags: resource.tags,
        }
      }));
    } catch (error) {
      console.error('Error fetching resources from Google Sheets:', error);
      return [];
    }
  }

  if (!base) {
    console.log('Airtable not configured, returning empty array');
    return [];
  }

  try {
    const records = await base('Resources').select({
      view: 'Grid view'
    }).all();
    
    return records.map(record => ({
      id: record.id,
      fields: record.fields as any
    }));
  } catch (error) {
    console.error('Error fetching resources from Airtable:', error);
    return [];
  }
}

export async function getJobById(id: string): Promise<AirtableJob | null> {
  if (!base) {
    console.log('Airtable not configured, returning null');
    return null;
  }

  try {
    const record = await base('Jobs').find(id);
    return {
      id: record.id,
      fields: record.fields as any
    };
  } catch (error) {
    console.error('Error fetching job from Airtable:', error);
    return null;
  }
}

export async function getCompanyById(id: string): Promise<AirtableCompany | null> {
  if (!base) {
    console.log('Airtable not configured, returning null');
    return null;
  }

  try {
    const record = await base('Companies').find(id);
    return {
      id: record.id,
      fields: record.fields as any
    };
  } catch (error) {
    console.error('Error fetching company from Airtable:', error);
    return null;
  }
}
