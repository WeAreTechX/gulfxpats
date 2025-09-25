import 'dotenv/config';
import Airtable from 'airtable';

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

// Airtable-specific functions (no Google Sheets dependencies)
export async function getJobsFromAirtable(): Promise<AirtableJob[]> {
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

export async function getCompaniesFromAirtable(): Promise<AirtableCompany[]> {
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

export async function getResourcesFromAirtable(): Promise<AirtableResource[]> {
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

export async function getJobByIdFromAirtable(id: string): Promise<AirtableJob | null> {
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

export async function getCompanyByIdFromAirtable(id: string): Promise<AirtableCompany | null> {
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

export async function getResourceByIdFromAirtable(id: string): Promise<AirtableResource | null> {
  if (!base) {
    console.log('Airtable not configured, returning null');
    return null;
  }

  try {
    const record = await base('Resources').find(id);
    return {
      id: record.id,
      fields: record.fields as any
    };
  } catch (error) {
    console.error('Error fetching resource from Airtable:', error);
    return null;
  }
}

// Legacy functions for backward compatibility (deprecated - use data-service.ts instead)
export async function getJobs(): Promise<AirtableJob[]> {
  console.warn('getJobs() is deprecated. Use getJobsFromAirtable() or data-service.ts instead.');
  return getJobsFromAirtable();
}

export async function getCompanies(): Promise<AirtableCompany[]> {
  console.warn('getCompanies() is deprecated. Use getCompaniesFromAirtable() or data-service.ts instead.');
  return getCompaniesFromAirtable();
}

export async function getResources(): Promise<AirtableResource[]> {
  console.warn('getResources() is deprecated. Use getResourcesFromAirtable() or data-service.ts instead.');
  return getResourcesFromAirtable();
}

export async function getJobById(id: string): Promise<AirtableJob | null> {
  console.warn('getJobById() is deprecated. Use getJobByIdFromAirtable() or data-service.ts instead.');
  return getJobByIdFromAirtable(id);
}

export async function getCompanyById(id: string): Promise<AirtableCompany | null> {
  console.warn('getCompanyById() is deprecated. Use getCompanyByIdFromAirtable() or data-service.ts instead.');
  return getCompanyByIdFromAirtable(id);
}

export async function getResourceById(id: string): Promise<AirtableResource | null> {
  console.warn('getResourceById() is deprecated. Use getResourceByIdFromAirtable() or data-service.ts instead.');
  return getResourceByIdFromAirtable(id);
}