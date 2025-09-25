#!/usr/bin/env node

/**
 * Initialize Gulf Jobs System
 * This script sets up the Gulf job scraping system and runs an initial scrape
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Initializing Gulf Jobs System...');

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data', 'gulf-jobs');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Created data directory:', dataDir);
}

// Create initial job data file
const initialJobsFile = path.join(dataDir, 'gulf-jobs-initial.json');
const initialData = {
  metadata: {
    totalJobs: 0,
    scrapedAt: new Date().toISOString(),
    sources: [],
    countries: [],
    categories: [],
    version: '1.0.0',
    initialized: true
  },
  jobs: []
};

fs.writeFileSync(initialJobsFile, JSON.stringify(initialData, null, 2));
console.log('✅ Created initial jobs file:', initialJobsFile);

// Create README for the data directory
const readmeContent = `# Gulf Jobs Data

This directory contains scraped job data from Gulf countries.

## Files

- \`gulf-jobs-*.json\` - Job data files with timestamps
- \`backups/\` - Backup directory for old files

## Data Structure

Each job file contains:
- \`metadata\` - Information about the scraping session
- \`jobs\` - Array of job objects

## Job Object Structure

\`\`\`json
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
\`\`\`

## API Endpoints

- \`GET /api/gulf-jobs\` - Get Gulf jobs
- \`POST /api/gulf-jobs\` - Trigger job scraping
- \`GET /api/scheduler\` - Get scheduler status
- \`POST /api/scheduler\` - Control scheduler

## Usage

1. Start the development server: \`npm run dev\`
2. Trigger initial scraping: \`POST /api/gulf-jobs\`
3. View jobs: \`GET /api/gulf-jobs\`
4. Check scheduler status: \`GET /api/scheduler\`
`;

fs.writeFileSync(path.join(dataDir, 'README.md'), readmeContent);
console.log('✅ Created README file');

console.log('\n🎉 Gulf Jobs System initialized successfully!');
console.log('\nNext steps:');
console.log('1. Start your development server: npm run dev');
console.log('2. Trigger initial job scraping: POST /api/gulf-jobs');
console.log('3. View jobs in your application');
console.log('4. Set up automated scheduling: POST /api/scheduler with action="start"');
console.log('\n📁 Data directory:', dataDir);
console.log('📊 Initial jobs file:', initialJobsFile);
