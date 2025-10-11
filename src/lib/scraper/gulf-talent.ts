import { BaseScraper } from './base';
import { Job } from '@/types';

export class GulfTalentScraper extends BaseScraper {
  protected baseUrl = 'https://www.gulftalent.com';
  protected sourceName = 'GulfTalent';

  async scrape(period: string): Promise<Job[]> {
    const jobs: Job[] = [];

    try {
      const searchUrl = `${this.baseUrl}/jobs`;
      const $ = await this.fetchPage(searchUrl);

      $('.job-list-item, .job-result').each((_, element) => {
        const $el = $(element);

        const job: Job = {
          title: $el.find('.job-title, h3').first().text().trim(),
          company: $el.find('.company, .employer').first().text().trim(),
          role: $el.find('.job-title, h3').first().text().trim(),
          description: $el.find('.description, .snippet').first().text().trim(),
          salary: $el.find('.salary').first().text().trim() || undefined,
          location: $el.find('.location').first().text().trim(),
          postedDate: $el.find('.date').first().text().trim(),
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