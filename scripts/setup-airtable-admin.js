#!/usr/bin/env node

/**
 * Setup Airtable Admin Table
 * This script provides instructions for setting up the admin table in Airtable
 */

console.log('🔧 Airtable Admin Setup Instructions\n');

console.log('📋 Step 1: Create Admin Table in Airtable');
console.log('1. Go to your Airtable base');
console.log('2. Create a new table called "Admins"');
console.log('3. Add the following fields:');
console.log('   - Name (Single line text)');
console.log('   - Email (Email)');
console.log('   - Token (Single line text)');
console.log('   - Active (Checkbox)');
console.log('   - Created (Date)');
console.log('   - Last Login (Date)\n');

console.log('📝 Step 2: Add Admin Records');
console.log('Add at least one admin record with:');
console.log('   - Name: Your Name');
console.log('   - Email: your-email@example.com');
console.log('   - Token: a-secure-random-token');
console.log('   - Active: ✓ (checked)\n');

console.log('🔑 Step 3: Environment Variables');
console.log('Add these to your .env.local file:');
console.log('   AIRTABLE_BASE_ID=your_base_id');
console.log('   AIRTABLE_API_KEY=your_api_key\n');

console.log('📖 Step 4: Get Airtable Credentials');
console.log('1. Base ID: Found in your Airtable base URL');
console.log('   https://airtable.com/appXXXXXXXXXXXXXX/...');
console.log('   The appXXXXXXXXXXXXXX part is your Base ID');
console.log('');
console.log('2. API Key: Go to https://airtable.com/account');
console.log('   Click "Generate new token"');
console.log('   Give it a name like "Admin Panel"');
console.log('   Copy the generated token\n');

console.log('🧪 Step 5: Test the Setup');
console.log('1. Start your development server: npm run dev');
console.log('2. Go to http://localhost:3000/admin/login');
console.log('3. Use the email and token from your Airtable record');
console.log('4. You should be redirected to the admin dashboard\n');

console.log('🔒 Security Notes:');
console.log('- Keep your API key secure');
console.log('- Use strong, unique tokens for each admin');
console.log('- Regularly rotate admin tokens');
console.log('- Monitor admin access in production\n');

console.log('✅ Setup Complete!');
console.log('Your admin authentication system is ready to use.');
