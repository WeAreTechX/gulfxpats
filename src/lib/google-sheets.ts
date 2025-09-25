import 'dotenv/config';
import { Job, JobType, JobStatus } from "@/types";

// Google Sheets API types
interface GoogleSheetsJob {
  uid: string;
  title: string;
  description: string;
  basicRequirements: string;
  preferredRequirements: string;
  status: JobStatus,
  postedDate: string;
  location: string;
  type: JobType,
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
}

interface GoogleSheetsCompany {
  uid: string;
  name: string;
  email: string;
  website: string;
  logo: string;
  location: string;
  address: string;
  rawAddress: string;
  phone: string;
  description: string;
  linkedIn?: string
}

interface GoogleSheetsResource {
  id: string;
  title: string;
  type: string;
  url: string;
  description: string;
  duration?: string;
  author: string;
  publishedDate: string;
  tags: string;
}

// Google Sheets API configuration
const GOOGLE_SHEETS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
const GOOGLE_SHEETS_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;
const GOOGLE_SHEETS_JOBS_RANGE = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_JOBS_RANGE || 'Jobs!A2:P';
const GOOGLE_SHEETS_COMPANIES_RANGE = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_COMPANIES_RANGE || 'Companies!A1:N';
const GOOGLE_SHEETS_RESOURCES_RANGE = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_RESOURCES_RANGE || 'Resources!A2:I';

// Helper function to fetch data from Google Sheets
async function fetchGoogleSheetsData(range: string): Promise<string[][]> {
  if (!GOOGLE_SHEETS_API_KEY || !GOOGLE_SHEETS_ID) {
    throw new Error('Google Sheets API key or Sheet ID not configured');
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/${range}?key=${GOOGLE_SHEETS_API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    throw error;
  }
}

// Transform raw Google Sheets data to structured objects
export function transformGoogleSheetsJob(row: string[]): Job {
  return {
    uid: row[0],
    title: row[1],
    description: row[2],
    basicRequirements: row[3],
    preferredRequirements: row[4],
    status: (row[5] as JobStatus) || 'open',
    postedDate: row[6],
    location: row[7],
    type: (row[5] as JobType) || 'full-time',
    remote: !!(row[8] && row[8].toLowerCase() === 'remote'),
    salaryMin: parseFloat(row[9]),
    salaryMax: parseFloat(row[10]),
    currency: row[11],
    companyId: row[12],
    companyName: row[13],
    companyIndustry: row[14],
    companySize: row[15],
    hiringManager: row[16],
    hiringManagerContact: row[17]
  };
}

export function transformGoogleSheetsCompany(row: string[]): GoogleSheetsCompany {
  return {
    uid: row[0],
    name: row[1],
    email: row[2],
    website: row[3],
    logo: row[4],
    location: row[5],
    address: row[6],
    rawAddress: row[7],
    phone: row[8],
    description: row[9],
    linkedIn: row[10]
  };
}

export function transformGoogleSheetsResource(row: string[]): GoogleSheetsResource {
  return {
    id: row[0] || '',
    title: row[1] || '',
    type: row[2] || 'article',
    url: row[3] || '',
    description: row[4] || '',
    duration: row[5] || undefined,
    author: row[6] || '',
    publishedDate: row[7] || '',
    tags: row[8] || '',
  };
}

// Main functions to fetch data from Google Sheets
export async function getJobsFromGoogleSheets(): Promise<GoogleSheetsJob[]> {
  try {
    const data = await fetchGoogleSheetsData(GOOGLE_SHEETS_JOBS_RANGE);
    return data.map(transformGoogleSheetsJob);
  } catch (error) {
    console.error('Error fetching jobs from Google Sheets:', error);
    return [];
  }
}

export async function getCompaniesFromGoogleSheets(): Promise<GoogleSheetsCompany[]> {
  try {
    const data = await fetchGoogleSheetsData(GOOGLE_SHEETS_COMPANIES_RANGE);
    return data.map(transformGoogleSheetsCompany);
  } catch (error) {
    console.error('Error fetching companies from Google Sheets:', error);
    return [];
  }
}

export async function getResourcesFromGoogleSheets(): Promise<GoogleSheetsResource[]> {
  try {
    const data = await fetchGoogleSheetsData(GOOGLE_SHEETS_RESOURCES_RANGE);
    return data.map(transformGoogleSheetsResource);
  } catch (error) {
    console.error('Error fetching resources from Google Sheets:', error);
    return [];
  }
}

// Helper function to get a specific job by ID
export async function getJobByIdFromGoogleSheets(uid: string): Promise<GoogleSheetsJob | null> {
  try {
    const jobs = await getJobsFromGoogleSheets();
    return jobs.find(job => job.uid === uid) || null;
  } catch (error) {
    console.error('Error fetching job by ID from Google Sheets:', error);
    return null;
  }
}

// Helper function to get a specific company by ID
export async function getCompanyByIdFromGoogleSheets(uid: string): Promise<GoogleSheetsCompany | null> {
  try {
    const companies = await getCompaniesFromGoogleSheets();
    return companies.find(company => company.uid === uid) || null;
  } catch (error) {
    console.error('Error fetching company by ID from Google Sheets:', error);
    return null;
  }
}

// Helper function to get a specific resource by ID
export async function getResourceByIdFromGoogleSheets(id: string): Promise<GoogleSheetsResource | null> {
  try {
    const resources = await getResourcesFromGoogleSheets();
    return resources.find(resource => resource.id === id) || null;
  } catch (error) {
    console.error('Error fetching resource by ID from Google Sheets:', error);
    return null;
  }
}
