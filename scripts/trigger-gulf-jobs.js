#!/usr/bin/env node

/**
 * Trigger Gulf Jobs Scraping
 * This script triggers the Gulf job scraping and shows the results
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function triggerGulfJobs() {
  console.log('🚀 Triggering Gulf Jobs Scraping...\n');

  try {
    // Step 1: Trigger job scraping
    console.log('1. Triggering job scraping...');
    const scrapeResponse = await makeRequest('/api/gulf-jobs', 'POST', { 
      forceScrape: true 
    });
    
    if (scrapeResponse.status === 200 && scrapeResponse.data.success) {
      console.log('✅ Job scraping completed successfully!');
      console.log(`   - Jobs scraped: ${scrapeResponse.data.totalJobs}`);
      console.log(`   - File saved: ${scrapeResponse.data.filename}`);
    } else {
      console.log('❌ Job scraping failed:', scrapeResponse.data.error);
      return;
    }

    // Step 2: Get job statistics
    console.log('\n2. Getting job statistics...');
    const statsResponse = await makeRequest('/api/gulf-jobs?action=stats');
    
    if (statsResponse.status === 200 && statsResponse.data.success) {
      const stats = statsResponse.data.statistics;
      console.log('✅ Job statistics retrieved:');
      console.log(`   - Total jobs: ${stats.totalJobs}`);
      console.log(`   - Recent jobs: ${stats.recentJobs}`);
      console.log(`   - Countries: ${Object.keys(stats.byCountry).join(', ')}`);
      console.log(`   - Sources: ${Object.keys(stats.bySource).join(', ')}`);
    }

    // Step 3: Get sample jobs
    console.log('\n3. Getting sample jobs...');
    const jobsResponse = await makeRequest('/api/gulf-jobs?limit=5');
    
    if (jobsResponse.status === 200 && jobsResponse.data.success) {
      console.log('✅ Sample jobs retrieved:');
      jobsResponse.data.jobs.forEach((job, index) => {
        console.log(`   ${index + 1}. ${job.title} at ${job.companyName} (${job.location})`);
      });
    }

    console.log('\n🎉 Gulf Jobs System is ready!');
    console.log('\nNext steps:');
    console.log('1. Visit http://localhost:3000/jobs to see the jobs page');
    console.log('2. Visit http://localhost:3000/admin/gulf-jobs for the admin dashboard');
    console.log('3. The scraped jobs will now appear on your jobs page!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nMake sure your development server is running:');
    console.log('npm run dev');
  }
}

// Run the script
triggerGulfJobs();
