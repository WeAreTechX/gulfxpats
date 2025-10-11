import * as cheerio from 'cheerio';
import {Job} from "@/types";

export abstract class BaseScraper {
  protected abstract baseUrl: string;
  protected abstract sourceName: string;

  protected async fetchPage(url: string): Promise<cheerio.CheerioAPI> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      return cheerio.load(html);
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  abstract scrape(period: string): Promise<Job[]>;
}