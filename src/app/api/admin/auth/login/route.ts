import { NextRequest, NextResponse } from 'next/server';

// Airtable configuration
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
const AIRTABLE_ADMIN_TABLE = 'Admins'; // Table name for admin users

interface AdminUser {
  id: string;
  email: string;
  name: string;
  token: string;
  isActive: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json({
        success: false,
        error: 'Email and token are required'
      }, { status: 400 });
    }

    // Validate admin credentials against Airtable
    const adminUser = await validateAdminCredentials(email, token);

    if (!adminUser) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    if (!adminUser.isActive) {
      return NextResponse.json({
        success: false,
        error: 'Account is deactivated'
      }, { status: 403 });
    }

    // Return admin data for client-side sessionStorage
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        loginTime: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

async function validateAdminCredentials(email: string, token: string): Promise<AdminUser | null> {
  try {
    if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
      console.error('Airtable configuration missing');
      return null;
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_ADMIN_TABLE}?filterByFormula=AND({Email}='${email}',{Token}='${token}')`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error('Airtable API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (data.records && data.records.length > 0) {
      const record = data.records[0];
      return {
        id: record.id,
        email: record.fields.Email || '',
        name: record.fields.Name || '',
        token: record.fields.Token || '',
        isActive: record.fields.Active !== false // Default to true if not specified
      };
    }

    return null;
  } catch (error) {
    console.error('Error validating admin credentials:', error);
    return null;
  }
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Extend global type for session storage
declare global {
  var adminSessions: Map<string, any>;
}
