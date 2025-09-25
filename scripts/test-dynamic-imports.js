#!/usr/bin/env node

/**
 * Test Dynamic Imports
 * This script tests that the dynamic imports work correctly
 */

console.log('🧪 Testing dynamic imports...\n');

async function testDynamicImports() {
  try {
    // Test 1: Import gulf-job-storage dynamically
    console.log('1. Testing gulf-job-storage dynamic import...');
    const { gulfJobStorage } = await import('../src/lib/gulf-job-storage.js');
    console.log('✅ gulf-job-storage imported successfully');
    
    // Test 2: Test storage methods
    console.log('\n2. Testing storage methods...');
    const files = await gulfJobStorage.getAvailableFiles();
    console.log(`✅ getAvailableFiles() works: ${files.length} files found`);
    
    // Test 3: Test statistics
    console.log('\n3. Testing statistics...');
    const stats = await gulfJobStorage.getJobStatistics();
    console.log(`✅ getJobStatistics() works: ${stats.totalJobs} total jobs`);
    
    console.log('\n🎉 All dynamic imports working correctly!');
    
  } catch (error) {
    console.error('❌ Dynamic import test failed:', error.message);
    console.log('\nThis might be expected if the storage files don\'t exist yet.');
    console.log('Run "npm run init-gulf-jobs" first to create the data directory.');
  }
}

// Run the test
testDynamicImports();
