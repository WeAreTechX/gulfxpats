import { promises as fs } from 'fs';
import path from 'path';
import { ScrapedJob } from './job-scraper';
import { Job } from '@/types';

export interface JobStorageConfig {
  dataDir: string;
  maxJobsPerFile: number;
  backupEnabled: boolean;
  compressionEnabled: boolean;
}

export class JobStorage {
  private config: JobStorageConfig;
  private dataDir: string;

  constructor(config?: Partial<JobStorageConfig>) {
    this.config = {
      dataDir: path.join(process.cwd(), 'data', 'jobs'),
      maxJobsPerFile: 1000,
      backupEnabled: true,
      compressionEnabled: false,
      ...config
    };
    this.dataDir = this.config.dataDir;
    this.ensureDataDirectory().catch(console.error);
  }

  // Ensure data directory exists
  private async ensureDataDirectory(): Promise<void> {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  // Save jobs to JSON file
  async saveJobs(jobs: ScrapedJob[], filename?: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultFilename = `jobs-${timestamp}.json`;
    const filepath = path.join(this.dataDir, filename || defaultFilename);

    try {
      // Ensure directory exists
      await this.ensureDataDirectory();

      // Create backup if enabled
      if (this.config.backupEnabled) {
        await this.createBackup();
      }

      // Prepare data for storage
      const storageData = {
        metadata: {
          totalJobs: jobs.length,
          scrapedAt: new Date().toISOString(),
          sources: [...new Set(jobs.map(job => job.source))],
          countries: [...new Set(jobs.map(job => this.extractCountryFromLocation(job.location)))],
          categories: [...new Set(jobs.map(job => job.companyIndustry))],
          version: '1.0.0'
        },
        jobs: jobs
      };

      // Write to file
      await fs.writeFile(filepath, JSON.stringify(storageData, null, 2));
      
      console.log(`Successfully saved ${jobs.length} jobs to ${filepath}`);
      return filepath;
    } catch (error) {
      console.error('Error saving jobs to file:', error);
      throw error;
    }
  }

  // Load jobs from JSON file
  async loadJobs(filename: string): Promise<ScrapedJob[]> {
    const filepath = path.join(this.dataDir, filename);
    
    try {
      const fileContent = await fs.readFile(filepath, 'utf-8');
      const storageData = JSON.parse(fileContent);
      
      console.log(`Successfully loaded ${storageData.jobs.length} jobs from ${filepath}`);
      return storageData.jobs;
    } catch (error) {
      console.error('Error loading jobs from file:', error);
      throw error;
    }
  }

  // Load latest jobs file
  async loadLatestJobs(): Promise<ScrapedJob[]> {
    try {
      const files = (await fs.readdir(this.dataDir))
        .filter(file => file.startsWith('gulf-jobs-') && file.endsWith('.json') && !file.includes('initial'))
        .sort()
        .reverse();

      if (files.length === 0) {
        console.log('No job files found');
        return [];
      }

      const latestFile = files[0];
      console.log(`Loading latest jobs from: ${latestFile}`);
      return await this.loadJobs(latestFile);
    } catch (error) {
      console.error('Error loading latest jobs:', error);
      return [];
    }
  }

  // Get all available job files
  async getAvailableFiles(): Promise<string[]> {
    try {
      return (await fs.readdir(this.dataDir))
        .filter(file => file.startsWith('gulf-jobs-') && file.endsWith('.json') && !file.includes('initial'))
        .sort()
        .reverse();
    } catch (error) {
      console.error('Error getting available files:', error);
      return [];
    }
  }

  // Merge jobs from multiple files
  async mergeJobs(filenames: string[]): Promise<ScrapedJob[]> {
    const allJobs: ScrapedJob[] = [];
    
    for (const filename of filenames) {
      try {
        const jobs = await this.loadJobs(filename);
        allJobs.push(...jobs);
      } catch (error) {
        console.error(`Error loading jobs from ${filename}:`, error);
      }
    }

    // Remove duplicates
    const uniqueJobs = this.removeDuplicates(allJobs);
    console.log(`Merged ${allJobs.length} jobs, ${uniqueJobs.length} unique jobs`);
    
    return uniqueJobs;
  }

  // Remove duplicate jobs
  private removeDuplicates(jobs: ScrapedJob[]): ScrapedJob[] {
    const seen = new Set<string>();
    return jobs.filter(job => {
      const key = `${job.title.toLowerCase()}_${job.companyName.toLowerCase()}_${job.location.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Create backup of existing files
  private async createBackup(): Promise<void> {
    try {
      const backupDir = path.join(this.dataDir, 'backups');
      try {
        await fs.access(backupDir);
      } catch {
        await fs.mkdir(backupDir, { recursive: true });
      }

      const files = (await fs.readdir(this.dataDir))
        .filter(file => file.startsWith('gulf-jobs-') && file.endsWith('.json'));

      for (const file of files) {
        const sourcePath = path.join(this.dataDir, file);
        const backupPath = path.join(backupDir, file);
        await fs.copyFile(sourcePath, backupPath);
      }

      console.log(`Created backup of ${files.length} files`);
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  }

  // Extract country from location string
  private extractCountryFromLocation(location: string): string {
    const gulfCountries = [
      'United Arab Emirates', 'UAE', 'Dubai', 'Abu Dhabi',
      'Saudi Arabia', 'Riyadh', 'Jeddah',
      'Qatar', 'Doha',
      'Kuwait', 'Kuwait City',
      'Bahrain', 'Manama',
      'Oman', 'Muscat'
    ];

    for (const country of gulfCountries) {
      if (location.toLowerCase().includes(country.toLowerCase())) {
        return country;
      }
    }

    return 'Unknown';
  }

  // Get job statistics
  async getJobStatistics(): Promise<{
    totalJobs: number;
    byCountry: Record<string, number>;
    bySource: Record<string, number>;
    byCategory: Record<string, number>;
    byType: Record<string, number>;
    recentJobs: number;
  }> {
    try {
      const jobs = await this.loadLatestJobs();
      
      const stats = {
        totalJobs: jobs.length,
        byCountry: {} as Record<string, number>,
        bySource: {} as Record<string, number>,
        byCategory: {} as Record<string, number>,
        byType: {} as Record<string, number>,
        recentJobs: 0
      };

      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      for (const job of jobs) {
        // Count by country
        const country = this.extractCountryFromLocation(job.location);
        stats.byCountry[country] = (stats.byCountry[country] || 0) + 1;

        // Count by source
        stats.bySource[job.source] = (stats.bySource[job.source] || 0) + 1;

        // Count by category
        stats.byCategory[job.companyIndustry] = (stats.byCategory[job.companyIndustry] || 0) + 1;

        // Count by type
        stats.byType[job.type] = (stats.byType[job.type] || 0) + 1;

        // Count recent jobs
        if (new Date(job.postedDate) > oneWeekAgo) {
          stats.recentJobs++;
        }
      }

      return stats;
    } catch (error) {
      console.error('Error getting job statistics:', error);
      return {
        totalJobs: 0,
        byCountry: {},
        bySource: {},
        byCategory: {},
        byType: {},
        recentJobs: 0
      };
    }
  }

  // Clean old files (keep only last N files)
  async cleanOldFiles(keepLast: number = 5): Promise<void> {
    try {
      const files = await this.getAvailableFiles();
      
      if (files.length <= keepLast) {
        console.log('No files to clean');
        return;
      }

      const filesToDelete = files.slice(keepLast);
      
      for (const file of filesToDelete) {
        const filepath = path.join(this.dataDir, file);
        await fs.unlink(filepath);
        console.log(`Deleted old file: ${file}`);
      }

      console.log(`Cleaned ${filesToDelete.length} old files`);
    } catch (error) {
      console.error('Error cleaning old files:', error);
    }
  }

  // Transform scraped jobs to Job interface
  transformToJobs(scrapedJobs: ScrapedJob[]): Job[] {
    return scrapedJobs.map(scrapedJob => ({
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
    }));
  }
}

// Export singleton instance
export const jobStorage = new JobStorage();
