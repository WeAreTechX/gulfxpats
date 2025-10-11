import { NextResponse } from 'next/server';
import { JobScraper } from '@/lib/scraper/job';

export async function POST(request: Request) {
  try {
    const { period } = await request.json();

    const scraper = new JobScraper();
    const data = await scraper.scrapeJobs(period || '7d');

    console.log(data)
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Scraping failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const scraper = new JobScraper('./data/jobs.json');
    const data = await scraper.readScrapedData();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to read data' },
      { status: 500 }
    );
  }
}