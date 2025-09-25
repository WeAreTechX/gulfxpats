# Gulf Jobs Scraping System

This system automatically scrapes job listings from popular job sites in Gulf countries and stores them as JSON resources for the jobs page.

## 🌟 Features

- **Multi-Site Scraping**: Scrapes from Bayt.com, GulfTalent, and NaukriGulf
- **Gulf Countries Coverage**: UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman
- **JSON Storage**: Stores scraped data in organized JSON files
- **Automated Scheduling**: Runs scraping jobs automatically every 6 hours
- **API Integration**: RESTful API for job data access
- **Data Management**: Automatic cleanup and backup of old files
- **Statistics**: Detailed analytics on scraped job data

## 🏗️ Architecture

```
src/
├── lib/
│   ├── gulf-job-scraper.ts      # Main scraping logic
│   ├── gulf-job-storage.ts      # JSON storage management
│   ├── job-scheduler.ts         # Automated scheduling
│   └── data-service.ts          # Updated data service
├── app/api/
│   ├── gulf-jobs/route.ts       # Job data API
│   └── scheduler/route.ts       # Scheduler control API
└── scripts/
    └── init-gulf-jobs.js        # Initialization script
```

## 🚀 Quick Start

### 1. Initialize the System

```bash
npm run init-gulf-jobs
```

This creates the data directory and initial files.

### 2. Start Development Server

```bash
npm run dev
```

### 3. Trigger Initial Scraping

```bash
# Using curl
curl -X POST http://localhost:3000/api/gulf-jobs

# Or using npm script
npm run scrape-gulf-jobs
```

### 4. Start Automated Scheduling

```bash
# Using curl
curl -X POST http://localhost:3000/api/scheduler \
  -H 'Content-Type: application/json' \
  -d '{"action":"start"}'

# Or using npm script
npm run start-scheduler
```

## 📊 API Endpoints

### Gulf Jobs API (`/api/gulf-jobs`)

#### GET - Retrieve Jobs
```bash
# Get all jobs
GET /api/gulf-jobs

# Get jobs with filters
GET /api/gulf-jobs?country=UAE&city=Dubai&limit=50

# Get job statistics
GET /api/gulf-jobs?action=stats

# Get available files
GET /api/gulf-jobs?action=files
```

#### POST - Trigger Scraping
```bash
POST /api/gulf-jobs
Content-Type: application/json

{
  "forceScrape": true,
  "countries": ["UAE", "Saudi Arabia"],
  "categories": ["Engineering", "IT"]
}
```

### Scheduler API (`/api/scheduler`)

#### GET - Scheduler Status
```bash
GET /api/scheduler
```

#### POST - Control Scheduler
```bash
# Start scheduler
POST /api/scheduler
{
  "action": "start"
}

# Stop scheduler
POST /api/scheduler
{
  "action": "stop"
}

# Trigger manual scraping
POST /api/scheduler
{
  "action": "trigger"
}

# Update configuration
POST /api/scheduler
{
  "action": "config",
  "config": {
    "intervalHours": 4,
    "enabled": true
  }
}
```

## 🗂️ Data Structure

### Job Object
```typescript
interface ScrapedJob {
  uid: string;
  title: string;
  description: string;
  basicRequirements: string;
  preferredRequirements: string;
  status: 'open' | 'closed' | 'paused';
  postedDate: string;
  location: string;
  type: 'full-time' | 'contract' | 'part-time' | 'internship';
  remote: boolean;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  companyId: string;
  companyName: string;
  companyIndustry: string;
  companySize: string;
  hiringManager: string;
  hiringManagerContact: string;
  source: string;
  sourceUrl: string;
  scrapedAt: string;
}
```

### Storage File Structure
```json
{
  "metadata": {
    "totalJobs": 150,
    "scrapedAt": "2024-01-01T00:00:00.000Z",
    "sources": ["Bayt.com", "GulfTalent", "NaukriGulf"],
    "countries": ["UAE", "Saudi Arabia", "Qatar"],
    "categories": ["Engineering", "IT", "Finance"],
    "version": "1.0.0"
  },
  "jobs": [...]
}
```

## 🔧 Configuration

### Scheduler Configuration
```typescript
interface SchedulerConfig {
  enabled: boolean;           // Enable/disable scheduler
  intervalHours: number;     // Hours between runs (default: 6)
  maxRetries: number;        // Max retry attempts (default: 3)
  retryDelayMinutes: number; // Delay between retries (default: 30)
  cleanupOldFiles: boolean;  // Auto-cleanup old files (default: true)
  keepLastFiles: number;     // Files to keep (default: 5)
}
```

### Storage Configuration
```typescript
interface GulfJobStorageConfig {
  dataDir: string;           // Data directory path
  maxJobsPerFile: number;    // Max jobs per file (default: 1000)
  backupEnabled: boolean;    // Enable backups (default: true)
  compressionEnabled: boolean; // Enable compression (default: false)
}
```

## 🌍 Supported Countries & Cities

### UAE
- Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain

### Saudi Arabia
- Riyadh, Jeddah, Mecca, Medina, Dammam, Khobar, Dhahran

### Qatar
- Doha, Al Rayyan, Al Wakrah, Al Khor

### Kuwait
- Kuwait City, Al Ahmadi, Hawalli, Farwaniya

### Bahrain
- Manama, Riffa, Muharraq, Hamad Town

### Oman
- Muscat, Salalah, Sohar, Nizwa

## 📈 Job Categories

- Engineering
- IT & Software
- Finance & Banking
- Healthcare
- Education
- Sales & Marketing
- Human Resources
- Administration
- Customer Service
- Hospitality
- Construction
- Oil & Gas
- Aviation
- Real Estate
- Retail
- Logistics
- Government
- Consulting

## 🔄 Integration with Jobs Page

The system automatically integrates with your existing jobs page:

1. **Data Service Integration**: The `data-service.ts` now prioritizes Gulf jobs from storage
2. **Fallback Support**: Falls back to Google Sheets if no Gulf jobs are available
3. **Seamless Experience**: No changes needed to your existing jobs page UI

## 📊 Statistics & Analytics

The system provides detailed statistics:

```typescript
{
  totalJobs: number;
  byCountry: Record<string, number>;
  bySource: Record<string, number>;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  recentJobs: number; // Jobs posted in last 7 days
}
```

## 🛠️ Development

### Adding New Job Sites

1. Add site configuration to `JOB_SITES` in `gulf-job-scraper.ts`
2. Implement scraping method for the new site
3. Add the method to the main scraping flow

### Adding New Countries

1. Add country configuration to `GULF_COUNTRIES`
2. Include cities for the new country
3. Update the scraping logic to include the new country

### Customizing Job Categories

1. Update `JOB_CATEGORIES` array in `gulf-job-scraper.ts`
2. Modify job generation logic to use new categories

## 🚨 Important Notes

### Legal Compliance
- Always respect website terms of service
- Implement appropriate delays between requests
- Consider using official APIs when available

### Performance
- The system includes built-in delays to avoid overwhelming target sites
- Files are automatically cleaned up to prevent storage bloat
- Backup system preserves data integrity

### Error Handling
- Comprehensive error handling and logging
- Automatic retry mechanism for failed requests
- Graceful degradation when sites are unavailable

## 🔍 Monitoring

### Logs
The system provides detailed logging for:
- Scraping progress
- Error conditions
- Performance metrics
- Data quality issues

### Health Checks
- Scheduler status monitoring
- Data freshness tracking
- Storage health verification

## 🚀 Production Deployment

### Environment Variables
```bash
NODE_ENV=production
NEXT_PUBLIC_USE_GOOGLE_SHEETS=true
```

### Scheduler Auto-Start
The scheduler automatically starts in production mode.

### Data Persistence
Ensure the `data/gulf-jobs` directory is persistent across deployments.

## 📞 Support

For issues or questions:
1. Check the logs for error messages
2. Verify API endpoints are accessible
3. Ensure data directory permissions are correct
4. Check scheduler status via API

## 🔄 Updates & Maintenance

### Regular Tasks
- Monitor scraping success rates
- Review and update job site configurations
- Clean up old data files
- Update job categories as needed

### Scaling Considerations
- Consider using a job queue for large-scale scraping
- Implement rate limiting for production use
- Add monitoring and alerting for scraping failures
- Consider using a database for better performance with large datasets
