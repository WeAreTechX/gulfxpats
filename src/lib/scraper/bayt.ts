import { BaseScraper } from './base';
import { Job } from '@/types';

export class BaytScraper extends BaseScraper {
  protected baseUrl = 'https://www.bayt.com';
  protected sourceName = 'Bayt.com';

  async scrape(period: string): Promise<Job[]> {
    const jobs: Job[] = [];

    try {
      // Bayt.com search URL for Gulf region jobs
      const searchUrl = `${this.baseUrl}/en/jobs/?filters[date]=${period}`;
      const $ = await this.fetchPage(searchUrl);

      // Parse job listings (adjust selectors based on actual HTML structure)
      $('.job-card, .t-job-item').each((_, element) => {
        const $el = $(element);

        const job: Job = {
          title: $el.find('.job-title, h2 a').first().text().trim(),
          company: $el.find('.company-name, .t-company').first().text().trim(),
          role: $el.find('.job-title, h2 a').first().text().trim(),
          description: $el.find('.job-description, .t-description').first().text().trim(),
          salary: $el.find('.salary, .t-salary').first().text().trim() || undefined,
          location: $el.find('.location, .t-location').first().text().trim(),
          postedDate: $el.find('.posted-date, .t-posted').first().text().trim(),
          source: this.sourceName,
          directLink: this.baseUrl + $el.find('a').first().attr('href'),
        };

        if (job.title && job.company) {
          jobs.push(job);
        }
      });
    } catch (error) {
      console.error(`Error scraping ${this.sourceName}:`, error);
    }

    return jobs;
  }
}