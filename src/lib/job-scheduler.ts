import { gulfJobScraper } from './gulf-job-scraper';

export interface SchedulerConfig {
  enabled: boolean;
  intervalHours: number;
  maxRetries: number;
  retryDelayMinutes: number;
  cleanupOldFiles: boolean;
  keepLastFiles: number;
}

export class JobScheduler {
  private config: SchedulerConfig;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor(config?: Partial<SchedulerConfig>) {
    this.config = {
      enabled: true,
      intervalHours: 6, // Run every 6 hours
      maxRetries: 3,
      retryDelayMinutes: 30,
      cleanupOldFiles: true,
      keepLastFiles: 5,
      ...config
    };
  }

  // Start the scheduler
  start(): void {
    if (this.intervalId) {
      console.log('Scheduler is already running');
      return;
    }

    if (!this.config.enabled) {
      console.log('Scheduler is disabled');
      return;
    }

    console.log(`Starting job scheduler - running every ${this.config.intervalHours} hours`);
    
    // Run immediately on start
    this.runScheduledJob();
    
    // Set up interval
    const intervalMs = this.config.intervalHours * 60 * 60 * 1000;
    this.intervalId = setInterval(() => {
      this.runScheduledJob();
    }, intervalMs);
  }

  // Stop the scheduler
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Job scheduler stopped');
    }
  }

  // Run the scheduled job
  private async runScheduledJob(): Promise<void> {
    if (this.isRunning) {
      console.log('Job is already running, skipping this execution');
      return;
    }

    this.isRunning = true;
    console.log('Starting scheduled Gulf job scraping...');

    let retryCount = 0;
    let success = false;

    while (retryCount < this.config.maxRetries && !success) {
      try {
        await this.executeJobScraping();
        success = true;
        console.log('Scheduled job completed successfully');
      } catch (error) {
        retryCount++;
        console.error(`Job execution failed (attempt ${retryCount}/${this.config.maxRetries}):`, error);
        
        if (retryCount < this.config.maxRetries) {
          const delayMs = this.config.retryDelayMinutes * 60 * 1000;
          console.log(`Retrying in ${this.config.retryDelayMinutes} minutes...`);
          await this.delay(delayMs);
        }
      }
    }

    if (!success) {
      console.error('Job execution failed after all retries');
    }

    this.isRunning = false;
  }

  // Execute the actual job scraping
  private async executeJobScraping(): Promise<void> {
    try {
      // Scrape jobs from all Gulf countries
      const scrapedJobs = await gulfJobScraper.scrapeAllGulfJobs();
      
      if (scrapedJobs.length === 0) {
        console.log('No jobs scraped, skipping save operation');
        return;
      }

      // Save jobs to storage
      const { gulfJobStorage } = await import('./gulf-job-storage');
      const filename = await gulfJobStorage.saveJobs(scrapedJobs);
      console.log(`Saved ${scrapedJobs.length} jobs to ${filename}`);

      // Clean up old files if enabled
      if (this.config.cleanupOldFiles) {
        await gulfJobStorage.cleanOldFiles(this.config.keepLastFiles);
        console.log(`Cleaned up old files, keeping last ${this.config.keepLastFiles} files`);
      }

      // Log statistics
      const stats = await gulfJobStorage.getJobStatistics();
      console.log('Job scraping statistics:', {
        totalJobs: stats.totalJobs,
        byCountry: stats.byCountry,
        bySource: stats.bySource,
        recentJobs: stats.recentJobs
      });

    } catch (error) {
      console.error('Error in job scraping execution:', error);
      throw error;
    }
  }

  // Manual trigger for job scraping
  async triggerManualScraping(): Promise<{ success: boolean; message: string; totalJobs?: number }> {
    if (this.isRunning) {
      return {
        success: false,
        message: 'Job scraping is already running'
      };
    }

    try {
      console.log('Manual job scraping triggered');
      await this.executeJobScraping();
      
      const stats = await gulfJobStorage.getJobStatistics();
      return {
        success: true,
        message: 'Manual job scraping completed successfully',
        totalJobs: stats.totalJobs
      };
    } catch (error) {
      console.error('Error in manual job scraping:', error);
      return {
        success: false,
        message: `Manual job scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Get scheduler status
  getStatus(): {
    isRunning: boolean;
    isScheduled: boolean;
    config: SchedulerConfig;
    nextRun?: Date;
  } {
    const nextRun = this.intervalId 
      ? new Date(Date.now() + (this.config.intervalHours * 60 * 60 * 1000))
      : undefined;

    return {
      isRunning: this.isRunning,
      isScheduled: this.intervalId !== null,
      config: this.config,
      nextRun
    };
  }

  // Update scheduler configuration
  updateConfig(newConfig: Partial<SchedulerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Scheduler configuration updated:', this.config);
  }

  // Utility method to add delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const jobScheduler = new JobScheduler();

// Auto-start scheduler in production
if (process.env.NODE_ENV === 'production') {
  jobScheduler.start();
}
