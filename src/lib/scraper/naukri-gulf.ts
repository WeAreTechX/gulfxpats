import { BaseScraper } from './base';
import { Job } from '@/types';

export class NaukriGulfScraper extends BaseScraper {
  protected baseUrl = 'https://www.naukrigulf.com';
  protected sourceName = 'Naukri Gulf';

  async scrape(period: string): Promise<Job[]> {
    const jobs: Job[] = [];

    try {
      const searchUrl = `${this.baseUrl}/jobs`;
      const $ = await this.fetchPage(searchUrl);

      $('.job-tuple, .jobTuple').each((_, element) => {
        const $el = $(element);

        const job: Job = {
          title: $el.find('.title, .job-title').first().text().trim(),
          company: $el.find('.company, .companyInfo').first().text().trim(),
          role: $el.find('.title, .job-title').first().text().trim(),
          description: $el.find('.job-description, .desc').first().text().trim(),
          salary: $el.find('.salary, .sal').first().text().trim() || undefined,
          location: $el.find('.location, .locWdth').first().text().trim(),
          postedDate: $el.find('.date, .jobTupleFooter').first().text().trim(),
          source: this.sourceName,
          directLink: $el.find('a').first().attr('href') || '',
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