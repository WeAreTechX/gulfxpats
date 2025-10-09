#!/usr/bin/env node

/**
 * Test Gulf Jobs System
 * This script tests the Gulf job scraping system
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

async function testGulfJobsSystem() {
  console.log('🧪 Testing Gulf Jobs System...\n');

  try {
    // Test 1: Get scheduler status
    console.log('1. Testing scheduler status...');
    const schedulerResponse = await makeRequest('/api/scheduler');
    if (schedulerResponse.status === 200 && schedulerResponse.data.success) {
      console.log('✅ Scheduler status retrieved successfully');
      console.log(`   - Scheduled: ${schedulerResponse.data.status.isScheduled}`);
      console.log(`   - Running: ${schedulerResponse.data.status.isRunning}`);
    } else {
      console.log('❌ Failed to get scheduler status');
    }

    // Test 2: Get job statistics
    console.log('\n2. Testing job statistics...');
    const statsResponse = await makeRequest('/api/jobs-scraper?action=stats');
    if (statsResponse.status === 200 && statsResponse.data.success) {
      console.log('✅ Job statistics retrieved successfully');
      console.log(`   - Total jobs: ${statsResponse.data.statistics.totalJobs}`);
      console.log(`   - Countries: ${Object.keys(statsResponse.data.statistics.byCountry).length}`);
      console.log(`   - Sources: ${Object.keys(statsResponse.data.statistics.bySource).length}`);
    } else {
      console.log('❌ Failed to get job statistics');
    }

    // Test 3: Get available files
    console.log('\n3. Testing available files...');
    const filesResponse = await makeRequest('/api/jobs-scraper?action=files');
    if (filesResponse.status === 200 && filesResponse.data.success) {
      console.log('✅ Available files retrieved successfully');
      console.log(`   - Files: ${filesResponse.data.files.length}`);
      filesResponse.data.files.forEach(file => console.log(`     - ${file}`));
    } else {
      console.log('❌ Failed to get available files');
    }

    // Test 4: Load jobs
    console.log('\n4. Testing job loading...');
    const jobsResponse = await makeRequest('/api/jobs-scraper?limit=5');
    if (jobsResponse.status === 200 && jobsResponse.data.success) {
      console.log('✅ Jobs loaded successfully');
      console.log(`   - Jobs returned: ${jobsResponse.data.jobs.length}`);
      if (jobsResponse.data.jobs.length > 0) {
        const sampleJob = jobsResponse.data.jobs[0];
        console.log(`   - Sample job: ${sampleJob.title} at ${sampleJob.companyName}`);
      }
    } else {
      console.log('❌ Failed to load jobs');
    }

    // Test 5: Trigger manual scraping (optional)
    console.log('\n5. Testing manual scraping trigger...');
    const scrapeResponse = await makeRequest('/api/jobs-scraper', 'POST', { forceScrape: true });
    if (scrapeResponse.status === 200 && scrapeResponse.data.success) {
      console.log('✅ Manual scraping triggered successfully');
      console.log(`   - Jobs scraped: ${scrapeResponse.data.totalJobs}`);
    } else {
      console.log('❌ Failed to trigger manual scraping');
      console.log(`   - Error: ${scrapeResponse.data.error}`);
    }

    console.log('\n🎉 Jobs System test completed!');
    console.log('\nNext steps:');
    console.log('1. Visit http://localhost:3000/admin/jobs to see the dashboard');
    console.log('2. Check the jobs page to see scraped jobs');
    console.log('3. Monitor the system using the API endpoints');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\nMake sure your development server is running:');
    console.log('npm run dev');
  }
}

// Run the test
testGulfJobsSystem();
