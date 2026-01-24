import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../../server/supabase/server';
import { CompaniesService } from '../../../../../server/supabase/services/companies';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const companiesService = new CompaniesService(supabase);
    
    const company = await companiesService.getById(params.id);
    
    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      company,
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const supabase = await createServerSupabaseClient();
    const companiesService = new CompaniesService(supabase);
    
    // Check if company exists
    const existingCompany = await companiesService.getById(params.id);
    if (!existingCompany) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.website !== undefined) updateData.website = body.website;
    if (body.logoUrl !== undefined) updateData.logo_url = body.logoUrl;
    if (body.location !== undefined) updateData.location = body.location;
    
    // Handle contact person
    if (body.contactPerson) {
      updateData.contact_person = body.contactPerson;
    }
    
    // Handle metadata/additional data
    if (body.additionalData) {
      updateData.metadata = body.additionalData;
    }

    const company = await companiesService.update(params.id, updateData);

    return NextResponse.json({
      success: true,
      company,
    });
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update company' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const companiesService = new CompaniesService(supabase);
    
    // Check if company exists
    const existingCompany = await companiesService.getById(params.id);
    if (!existingCompany) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    await companiesService.delete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}
