#!/usr/bin/env node

/**
 * Test Jobs API
 * This script tests the jobs API endpoint
 */

const http = require('http');

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

async function testJobsAPI() {
  console.log('🧪 Testing Jobs API...\n');

  try {
    // Test 1: Get jobs with statistics
    console.log('1. Testing jobs API with statistics...');
    const response = await makeRequest('/api/jobs?includeStats=true');
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Jobs API working!');
      console.log(`   - Total jobs: ${response.data.totalJobs}`);
      console.log(`   - Statistics available: ${!!response.data.statistics}`);
      
      if (response.data.statistics) {
        console.log(`   - Gulf jobs: ${response.data.statistics.totalJobs}`);
        console.log(`   - Countries: ${Object.keys(response.data.statistics.byCountry).length}`);
        console.log(`   - Sources: ${Object.keys(response.data.statistics.bySource).join(', ')}`);
      }
      
      // Show sample jobs
      if (response.data.jobs && response.data.jobs.length > 0) {
        console.log('\n   Sample jobs:');
        response.data.jobs.slice(0, 3).forEach((job, index) => {
          console.log(`   ${index + 1}. ${job.title} at ${job.companyName} (${job.location})`);
        });
      }
    } else {
      console.log('❌ Jobs API failed:', response.data.error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nMake sure your development server is running:');
    console.log('npm run dev');
  }
}

// Run the test
testJobsAPI();
