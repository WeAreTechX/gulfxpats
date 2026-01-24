import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../../server/supabase/server';
import { CompaniesService } from '../../../../../server/supabase/services/companies';
import { CompanyCreate } from "@/types/companies";



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companies } = body as { companies: CompanyCreate[] };

    if (!companies || !Array.isArray(companies) || companies.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No companies provided' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const companiesService = new CompaniesService(supabase);

    const results = {
      created: 0,
      errors: [] as { row: number; name: string; error: string }[],
    };

    // Process companies
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      
      try {
        if (!company.name || company.name.trim() === '') {
          results.errors.push({
            row: i + 1,
            name: company.name || 'Unknown',
            error: 'Company name is required',
          });
          continue;
        }

        // Create company
        await companiesService.create({
          name: company.name.trim(),
          short_description: company.short_description,
          long_description: company.long_description,
          website_url: company.website_url,
          logo_url: company.logo_url,
          location: company.location,
          contact_person: company.contact_person,
          metadata: company.metadata,
          status_id: 8
        });

        results.created++;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        results.errors.push({
          row: i + 1,
          name: company.name || 'Unknown',
          error: errorMessage,
        });
      }
    }

    return NextResponse.json({
      success: true,
      created: results.created,
      failed: results.errors.length,
      errors: results.errors,
    });
  } catch (error) {
    console.error('Error bulk creating companies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process bulk upload' },
      { status: 500 }
    );
  }
}
