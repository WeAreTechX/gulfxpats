import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../../server/supabase/server';
import { JobsService } from '../../../../../server/supabase/services/jobs';

interface BulkJobInput {
  title: string;
  description?: string | null;
  company_name?: string | null;
  job_type_code?: string | null;
  industry_code?: string | null;
  location?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_frequency?: 'monthly' | 'annually' | null;
  currency_code?: string | null;
  apply_url?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobs } = body as { jobs: BulkJobInput[] };

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No jobs provided' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const jobsService = new JobsService(supabase);

    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    const createdById = session?.user.id || undefined;

    // Fetch lookup data for companies, job types, industries, currencies
    const [companiesRes, jobTypesRes, industriesRes, currenciesRes] = await Promise.all([
      supabase.from('companies').select('id, name'),
      supabase.from('job_types').select('id, code, name'),
      supabase.from('industries').select('id, code, name'),
      supabase.from('currencies').select('id, code, name'),
    ]);

    // Create lookup maps (case-insensitive)
    const companyMap = new Map(
      (companiesRes.data || []).map((c: { id: string; name: string }) => [c.name.toLowerCase(), c.id])
    );
    const jobTypeMap = new Map(
      (jobTypesRes.data || []).map((t: { id: number; code: string }) => [t.code.toLowerCase(), t.id])
    );
    const industryMap = new Map(
      (industriesRes.data || []).map((i: { id: number; code: string }) => [i.code.toLowerCase(), i.id])
    );
    const currencyMap = new Map(
      (currenciesRes.data || []).map((c: { id: number; code: string }) => [c.code.toLowerCase(), c.id])
    );

    const results = {
      created: 0,
      errors: [] as { row: number; title: string; error: string }[],
    };

    // Process jobs
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      
      try {
        // Validate required fields
        if (!job.title || job.title.trim() === '') {
          results.errors.push({
            row: i + 1,
            title: job.title || 'Unknown',
            error: 'Job title is required',
          });
          continue;
        }

        // Lookup company ID
        let companyId: string | undefined;
        if (job.company_name) {
          companyId = companyMap.get(job.company_name.toLowerCase());
          if (!companyId) {
            results.errors.push({
              row: i + 1,
              title: job.title,
              error: `Company "${job.company_name}" not found. Please add the company first.`,
            });
            continue;
          }
        }

        // Lookup job type ID
        let jobTypeId: number | undefined;
        if (job.job_type_code) {
          jobTypeId = jobTypeMap.get(job.job_type_code.toLowerCase());
          if (!jobTypeId) {
            results.errors.push({
              row: i + 1,
              title: job.title,
              error: `Job type "${job.job_type_code}" not found. Valid values: full-time, part-time, contract, internship, freelance`,
            });
            continue;
          }
        }

        // Lookup industry ID
        let industryId: number | undefined;
        if (job.industry_code) {
          industryId = industryMap.get(job.industry_code.toLowerCase());
          if (!industryId) {
            results.errors.push({
              row: i + 1,
              title: job.title,
              error: `Industry "${job.industry_code}" not found`,
            });
            continue;
          }
        }

        // Lookup currency ID
        let currencyId: number | undefined;
        if (job.currency_code) {
          currencyId = currencyMap.get(job.currency_code.toLowerCase());
          if (!currencyId) {
            results.errors.push({
              row: i + 1,
              title: job.title,
              error: `Currency "${job.currency_code}" not found`,
            });
            continue;
          }
        }

        // Create job
        await jobsService.store({
          title: job.title.trim(),
          description: job.description || '',
          company_id: companyId ? parseInt(companyId) : undefined,
          job_type_id: jobTypeId || 1, // Default to first job type if not specified
          industry_id: industryId || 1, // Default to first industry if not specified
          location: job.location || '',
          salary_min: job.salary_min || undefined,
          salary_max: job.salary_max || undefined,
          salary_frequency: job.salary_frequency || undefined,
          currency_id: currencyId || 1, // Default to first currency if not specified
          apply_url: job.apply_url || '',
          created_by_id: createdById,
        });

        results.created++;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        results.errors.push({
          row: i + 1,
          title: job.title || 'Unknown',
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
    console.error('Error bulk creating jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process bulk upload' },
      { status: 500 }
    );
  }
}
