import fs from 'fs/promises';
import path from 'path';
import { ScrapedData, ScraperConfig } from '@/types';
import { BaytScraper } from './bayt';
import { GulfTalentScraper } from './gulf-talent';
import { NaukriGulfScraper } from './naukri-gulf';
import { DubizzleScraper } from './dubizzle';


export class JobScraper {
  private scrapers: ScraperConfig[];
  private outputPath: string;

  constructor(outputPath: string = '../../../data/jobs.json') {
    this.outputPath = outputPath;

    // Initialize scrapers - you can easily add more here
    this.scrapers = [
      {
        name: 'Bayt.com',
        baseUrl: 'https://www.bayt.com',
        enabled: true,
        scraper: async (period: string) => new BaytScraper().scrape(period),
      },
      {
        name: 'GulfTalent',
        baseUrl: 'https://www.gulftalent.com',
        enabled: true,
        scraper: async (period: string) => new GulfTalentScraper().scrape(period),
      },
      {
        name: 'Naukri Gulf',
        baseUrl: 'https://www.naukrigulf.com',
        enabled: true,
        scraper: async (period: string) => new NaukriGulfScraper().scrape(period),
      },
      {
        name: 'Dubizzle',
        baseUrl: 'https://dubai.dubizzle.com',
        enabled: true,
        scraper: async (period: string) => new DubizzleScraper().scrape(period),
      },
    ];
  }

  /**
   * Add a custom scraper to the list
   */
  addScraper(config: ScraperConfig): void {
    this.scrapers.push(config);
  }

  /**
   * Enable or disable a scraper by name
   */
  toggleScraper(name: string, enabled: boolean): void {
    const scraper = this.scrapers.find(s => s.name === name);
    if (scraper) {
      scraper.enabled = enabled;
    }
  }

  /**
   * Main function to trigger scraping
   * @param period - Time period filter (e.g., '24h', '7d', '30d', 'all')
   */
  async scrapeJobs(period: string = '7d'): Promise<ScrapedData> {
    console.log(`Starting job scraping for period: ${period}`);

    const allJobs: ScrapedData = {
      datePulled: new Date().toISOString(),
      period: period,
      totalJobs: 0,
      jobs: [],
    };

    // Run all enabled scrapers in parallel
    const enabledScrapers = this.scrapers.filter(s => s.enabled);
    const scrapingPromises = enabledScrapers.map(async (scraperConfig) => {
      try {
        console.log(`Scraping ${scraperConfig.name}...`);
        const jobs = await scraperConfig.scraper(period);
        console.log(`Found ${jobs.length} jobs from ${scraperConfig.name}`);
        return jobs;
      } catch (error) {
        console.error(`Failed to scrape ${scraperConfig.name}:`, error);
        return [];
      }
    });

    const results = await Promise.all(scrapingPromises);

    // Flatten results
    results.forEach(jobs => {
      allJobs.jobs.push(...jobs);
    });

    allJobs.totalJobs = allJobs.jobs.length;

    // Save to JSON file
    await this.saveToFile(allJobs);

    console.log(`Scraping completed. Total jobs found: ${allJobs.totalJobs}`);
    return allJobs;
  }

  /**
   * Save scraped data to JSON file
   */
  private async saveToFile(data: ScrapedData): Promise<void> {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.outputPath);
      await fs.mkdir(dir, { recursive: true });

      // Write JSON file
      await fs.writeFile(
        this.outputPath,
        JSON.stringify(data, null, 2),
        'utf-8'
      );

      console.log(`Data saved to ${this.outputPath}`);
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }

  /**
   * Read existing scraped data from file
   */
  async readScrapedData(): Promise<ScrapedData | null> {
    try {
      const data = await fs.readFile(this.outputPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.log('No existing data found');
      return null;
    }
  }
}