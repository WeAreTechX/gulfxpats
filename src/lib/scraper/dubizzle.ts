import { BaseScraper } from './base';
import { Job } from '@/types';

export class DubizzleScraper extends BaseScraper {
  protected baseUrl = 'https://dubai.dubizzle.com';
  protected sourceName = 'Dubizzle';

  async scrape(period: string): Promise<Job[]> {
    const jobs: Job[] = [];

    try {
      const searchUrl = `${this.baseUrl}/jobs/`;
      const $ = await this.fetchPage(searchUrl);

      $('[data-testid="listing-card"], .listing-card').each((_, element) => {
        const $el = $(element);

        const job: Job = {
          title: $el.find('[data-testid="listing-title"], .listing-title').first().text().trim(),
          company: $el.find('.company-name').first().text().trim() || 'Not specified',
          role: $el.find('[data-testid="listing-title"], .listing-title').first().text().trim(),
          description: $el.find('[data-testid="listing-description"], .description').first().text().trim(),
          salary: $el.find('.price, [data-testid="listing-price"]').first().text().trim() || undefined,
          location: $el.find('[data-testid="listing-location"], .location').first().text().trim(),
          postedDate: $el.find('.date, [data-testid="listing-date"]').first().text().trim(),
          source: this.sourceName,
          directLink: this.baseUrl + $el.find('a').first().attr('href'),
        };

        if (job.title) {
          jobs.push(job);
        }
      });
    } catch (error) {
      console.error(`Error scraping ${this.sourceName}:`, error);
    }

    return jobs;
  }
}