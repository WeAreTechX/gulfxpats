import { NextRequest, NextResponse } from 'next/server';
import { gulfJobScraper } from '@/lib/gulf-job-scraper';

// GET /api/gulf-jobs - Get Gulf jobs
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
        console.log('Starting Gulf job scraping...');
        const scrapedJobs = await gulfJobScraper.scrapeAllGulfJobs();
        
        // Save to storage
        const { gulfJobStorage } = await import('@/lib/gulf-job-storage');
        const filename = await gulfJobStorage.saveJobs(scrapedJobs);
        
        return NextResponse.json({
          success: true,
          message: `Successfully scraped and saved ${scrapedJobs.length} jobs`,
          filename,
          totalJobs: scrapedJobs.length,
          jobs: scrapedJobs.slice(0, limit)
        });

      case 'load':
        // Load existing jobs
        const { gulfJobStorage: gs1 } = await import('@/lib/gulf-job-storage');
        jobs = await gs1.loadLatestJobs();
        
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
          jobs: gs1.transformToJobs(jobs)
        });

      case 'stats':
        // Get job statistics
        const { gulfJobStorage: gs2 } = await import('@/lib/gulf-job-storage');
        const stats = await gs2.getJobStatistics();
        return NextResponse.json({
          success: true,
          statistics: stats
        });

      case 'files':
        // Get available files
        const { gulfJobStorage: gs3 } = await import('@/lib/gulf-job-storage');
        const files = await gs3.getAvailableFiles();
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
    console.error('Error in Gulf jobs API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/gulf-jobs - Trigger job scraping
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { forceScrape = false, countries = [], categories = [] } = body;

    console.log('Triggering Gulf job scraping...');
    
    // Scrape jobs
    const scrapedJobs = await gulfJobScraper.scrapeAllGulfJobs();
    
    // Save to storage
    const { gulfJobStorage } = await import('@/lib/gulf-job-storage');
    const filename = await gulfJobStorage.saveJobs(scrapedJobs);
    
    // Clean old files
    await gulfJobStorage.cleanOldFiles(5);

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
    console.error('Error in Gulf jobs POST API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
