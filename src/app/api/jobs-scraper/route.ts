import { NextRequest, NextResponse } from 'next/server';
import { jobScraper } from '@/lib/job-scraper';

// GET /api/jobs-scraper - Get jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'load';
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '100');

    let jobs;

    switch (action) {
      case 'scrape':
        // Scrape new jobs
        console.log('Starting job scraping...');
        const scrapedJobs = await jobScraper.scrapeAllJobs();
        
        // Save to storage
        const { jobStorage } = await import('@/lib/job-storage');
        const filename = await jobStorage.saveJobs(scrapedJobs);
        
        return NextResponse.json({
          success: true,
          message: `Successfully scraped and saved ${scrapedJobs.length} jobs`,
          filename,
          totalJobs: scrapedJobs.length,
          jobs: scrapedJobs.slice(0, limit)
        });

      case 'load':
        // Load existing jobs
        const { jobStorage: js1 } = await import('@/lib/job-storage');
        jobs = await js1.loadLatestJobs();
        
        // Apply filters
        if (country) {
          jobs = jobs.filter(job => 
            job.location.toLowerCase().includes(country.toLowerCase())
          );
        }
        
        if (city) {
          jobs = jobs.filter(job => 
            job.location.toLowerCase().includes(city.toLowerCase())
          );
        }
        
        if (category) {
          jobs = jobs.filter(job => 
            job.companyIndustry.toLowerCase().includes(category.toLowerCase()) ||
            job.title.toLowerCase().includes(category.toLowerCase())
          );
        }

        // Limit results
        jobs = jobs.slice(0, limit);

        return NextResponse.json({
          success: true,
          totalJobs: jobs.length,
          jobs: js1.transformToJobs(jobs)
        });

      case 'stats':
        // Get job statistics
        const { jobStorage: js2 } = await import('@/lib/job-storage');
        const stats = await js2.getJobStatistics();
        return NextResponse.json({
          success: true,
          statistics: stats
        });

      case 'files':
        // Get available files
        const { jobStorage: js3 } = await import('@/lib/job-storage');
        const files = await js3.getAvailableFiles();
        return NextResponse.json({
          success: true,
          files
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in jobs API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/jobs-scraper - Trigger job scraping
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { forceScrape = false, countries = [], categories = [] } = body;

    console.log('Triggering job scraping...');
    
    // Scrape jobs
    const scrapedJobs = await jobScraper.scrapeAllJobs();
    
    // Save to storage
    const { jobStorage } = await import('@/lib/job-storage');
    const filename = await jobStorage.saveJobs(scrapedJobs);
    
    // Clean old files
    await jobStorage.cleanOldFiles(5);

    return NextResponse.json({
      success: true,
      message: `Successfully scraped and saved ${scrapedJobs.length} jobs`,
      filename,
      totalJobs: scrapedJobs.length,
      metadata: {
        scrapedAt: new Date().toISOString(),
        sources: [...new Set(scrapedJobs.map(job => job.source))],
        countries: [...new Set(scrapedJobs.map(job => job.location.split(',')[1]?.trim()))]
      }
    });
  } catch (error) {
    console.error('Error in jobs POST API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
