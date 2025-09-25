# Admin System Documentation

## 🎯 Overview

A comprehensive admin panel with Airtable-based authentication for managing the job platform and Gulf jobs system.

## 🏗️ Architecture

```
Admin System
├── Authentication (Airtable-based)
├── Layout (TopNav: Home, Jobs, Companies)
├── Pages
│   ├── /admin (Dashboard)
│   ├── /admin/jobs (Gulf Jobs Management)
│   ├── /admin/companies (Company Management)
│   └── /admin/login (Authentication)
└── API Routes
    ├── /api/admin/auth/login
    ├── /api/admin/auth/check
    ├── /api/admin/auth/logout
    ├── /api/jobs
    └── /api/companies
```

## 🔐 Authentication System

### Airtable Integration
- **Table Name**: `Admins`
- **Required Fields**:
  - `Name` (Single line text)
  - `Email` (Email)
  - `Token` (Single line text)
  - `Active` (Checkbox)

### Session Management
- **Session Storage**: In-memory (development) / Redis (production)
- **Session Duration**: 24 hours
- **Security**: HTTP-only cookies, secure in production

## 📱 Admin Pages

### 1. Admin Home (`/admin`)
**Features:**
- System overview dashboard
- Job statistics (total, Gulf jobs, recent)
- Company count
- System status indicators
- Quick action links

**Stats Displayed:**
- Total jobs across all sources
- Gulf jobs count and breakdown
- Recent jobs (last 7 days)
- Jobs by country and source
- System health status

### 2. Jobs Management (`/admin/jobs`)
**Features:**
- Gulf jobs dashboard (moved from `/admin/gulf-jobs`)
- Real-time job statistics
- Manual scraping controls
- Scheduler management
- Job source monitoring

**Controls:**
- Trigger manual job scraping
- Start/stop automated scheduler
- View job statistics
- Monitor scraping progress

### 3. Companies Management (`/admin/companies`)
**Features:**
- Company listing with search and filters
- Company details (contact info, website, location)
- Open jobs count per company
- Company profile management

**Functionality:**
- Search by company name or location
- Filter by location
- View company details
- Access company websites and LinkedIn

## 🚀 Setup Instructions

### 1. Environment Variables
Add to `.env.local`:
```bash
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_API_KEY=your_api_key
```

### 2. Airtable Setup
```bash
# Get setup instructions
npm run setup-airtable-admin
```

### 3. Create Admin Table
1. Create table named `Admins`
2. Add required fields (Name, Email, Token, Active)
3. Add at least one admin record
4. Get your Base ID and API Key

### 4. Test Authentication
1. Start development server: `npm run dev`
2. Visit: `http://localhost:3000/admin/login`
3. Use credentials from Airtable

## 🔧 API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/check` - Check authentication status
- `POST /api/admin/auth/logout` - Admin logout

### Data
- `GET /api/jobs?includeStats=true` - Get jobs with statistics
- `GET /api/companies` - Get all companies

## 🎨 UI Components

### Admin Layout
- **Top Navigation**: Home, Jobs, Companies
- **User Info**: Admin name and logout
- **Mobile Responsive**: Collapsible menu
- **Protected Routes**: Automatic redirect to login

### Login Page
- **Email/Token Input**: Secure credential entry
- **Error Handling**: Clear error messages
- **Responsive Design**: Mobile-friendly

### Dashboard Cards
- **Statistics Cards**: Key metrics display
- **Quick Actions**: Navigation shortcuts
- **System Status**: Health indicators

## 🔒 Security Features

### Authentication
- **Airtable Validation**: Credentials verified against Airtable
- **Session Management**: Secure session handling
- **Route Protection**: Middleware-based access control
- **Auto-logout**: Session expiration handling

### Data Protection
- **HTTP-only Cookies**: Secure session storage
- **CSRF Protection**: SameSite cookie settings
- **Environment Variables**: Secure configuration

## 📊 Monitoring & Analytics

### Admin Dashboard
- **Real-time Stats**: Live job and company counts
- **Gulf Jobs Overview**: Regional job distribution
- **System Health**: Service status indicators
- **Quick Actions**: Direct access to management tools

### Job Management
- **Scraping Status**: Real-time scraping progress
- **Source Monitoring**: Job site health checks
- **Statistics**: Detailed job analytics
- **Manual Controls**: On-demand operations

## 🚀 Deployment

### Production Considerations
1. **Session Storage**: Use Redis for session management
2. **Environment Variables**: Secure API key storage
3. **HTTPS**: Enable secure connections
4. **Monitoring**: Add logging and error tracking

### Environment Setup
```bash
# Production environment variables
AIRTABLE_BASE_ID=your_production_base_id
AIRTABLE_API_KEY=your_production_api_key
NODE_ENV=production
```

## 🔧 Development

### Available Scripts
```bash
# Setup Airtable admin table
npm run setup-airtable-admin

# Test admin authentication
npm run test-admin-auth

# Debug admin system
npm run debug-admin
```

### Testing
1. **Authentication Flow**: Login/logout functionality
2. **Route Protection**: Unauthorized access prevention
3. **Data Loading**: Admin dashboard data
4. **Session Management**: Session persistence

## 📝 Usage Examples

### Admin Login
1. Visit `/admin/login`
2. Enter email and token from Airtable
3. Access admin dashboard

### Managing Jobs
1. Go to `/admin/jobs`
2. View Gulf jobs statistics
3. Trigger manual scraping
4. Monitor scheduler status

### Managing Companies
1. Go to `/admin/companies`
2. Search and filter companies
3. View company details
4. Access company resources

## 🛠️ Troubleshooting

### Common Issues
1. **Authentication Fails**: Check Airtable credentials
2. **Session Expires**: Re-login required
3. **Data Not Loading**: Check API endpoints
4. **Permission Denied**: Verify admin status in Airtable

### Debug Steps
1. Check browser console for errors
2. Verify environment variables
3. Test Airtable API access
4. Check session cookie settings

## 🔄 Updates & Maintenance

### Regular Tasks
- Monitor admin access logs
- Update admin credentials as needed
- Review session management
- Test authentication flow

### Security Updates
- Rotate API keys regularly
- Update admin tokens
- Monitor for unauthorized access
- Review session security

The admin system provides comprehensive management capabilities for your job platform with secure Airtable-based authentication! 🚀
