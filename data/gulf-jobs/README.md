# Gulf Jobs Data

This directory contains scraped job data from Gulf countries.

## Files

- `gulf-jobs-*.json` - Job data files with timestamps
- `backups/` - Backup directory for old files

## Data Structure

Each job file contains:
- `metadata` - Information about the scraping session
- `jobs` - Array of job objects

## Job Object Structure

```json
{
  "uid": "unique_identifier",
  "title": "Job Title",
  "description": "Job Description",
  "location": "City, Country",
  "companyName": "Company Name",
  "salaryMin": 3000,
  "salaryMax": 8000,
  "currency": "AED",
  "type": "full-time",
  "remote": false,
  "source": "Bayt.com",
  "sourceUrl": "https://...",
  "scrapedAt": "2024-01-01T00:00:00.000Z"
}
```

## API Endpoints

- `GET /api/gulf-jobs` - Get Gulf jobs
- `POST /api/gulf-jobs` - Trigger job scraping
- `GET /api/scheduler` - Get scheduler status
- `POST /api/scheduler` - Control scheduler

## Usage

1. Start the development server: `npm run dev`
2. Trigger initial scraping: `POST /api/gulf-jobs`
3. View jobs: `GET /api/gulf-jobs`
4. Check scheduler status: `GET /api/scheduler`
