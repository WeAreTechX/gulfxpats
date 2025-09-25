#!/usr/bin/env node

/**
 * Debug Gulf Jobs Data
 * This script checks the latest Gulf jobs data
 */

const fs = require('fs');
const path = require('path');

function debugGulfJobs() {
  console.log('🔍 Debugging Gulf Jobs Data...\n');

  try {
    const dataDir = path.join(process.cwd(), 'data', 'gulf-jobs');
    
    // Check if data directory exists
    if (!fs.existsSync(dataDir)) {
      console.log('❌ Data directory not found:', dataDir);
      return;
    }

    // Get all job files (exclude initial file)
    const files = fs.readdirSync(dataDir)
      .filter(file => file.startsWith('gulf-jobs-') && file.endsWith('.json') && !file.includes('initial'))
      .sort()
      .reverse();

    if (files.length === 0) {
      console.log('❌ No job files found');
      return;
    }

    console.log(`📁 Found ${files.length} job files:`);
    files.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });

    // Read the latest file
    const latestFile = files[0];
    const filePath = path.join(dataDir, latestFile);
    console.log(`\n📄 Reading latest file: ${latestFile}`);

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    console.log('\n📊 File Statistics:');
    console.log(`   - Total jobs: ${data.metadata.totalJobs}`);
    console.log(`   - Scraped at: ${data.metadata.scrapedAt}`);
    console.log(`   - Sources: ${data.metadata.sources.join(', ')}`);
    console.log(`   - Countries: ${data.metadata.countries.join(', ')}`);
    console.log(`   - Categories: ${data.metadata.categories.length} categories`);

    // Show sample jobs
    if (data.jobs && data.jobs.length > 0) {
      console.log('\n💼 Sample Jobs:');
      data.jobs.slice(0, 5).forEach((job, index) => {
        console.log(`   ${index + 1}. ${job.title} at ${job.companyName} (${job.location})`);
        console.log(`      - Type: ${job.type}, Remote: ${job.remote}`);
        console.log(`      - Salary: ${job.salaryMin}-${job.salaryMax} ${job.currency}`);
        console.log(`      - Source: ${job.source}`);
        console.log('');
      });
    }

    console.log('✅ Gulf jobs data is available and ready to use!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the debug
debugGulfJobs();
