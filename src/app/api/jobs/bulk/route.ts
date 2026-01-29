import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../../server/supabase/server';
import { JobsService } from '../../../../../server/supabase/services/jobs';
import {Json} from "@/types";

interface BulkJobInput {
  title: string;
  description: string;
  company_name?: string | null;
  type_code?: string;
  industry_code?: string;
  jobs_scrapings_id?: number;
  location?: string | null;
  country: string;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_frequency?: 'monthly' | 'annually' | null;
  currency_code?: string;
  apply_url: string;
  is_premium: boolean;
  tags?: string[];
  metadata?: { [key: string]: Json }
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
    const created_by_id = session?.user.id || undefined;

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
        let company_id: string | undefined;
        if (job.company_id) {
          company_id = companyMap.get(job.company_id);
          if (!company_id) {
            results.errors.push({
              row: i + 1,
              title: job.title,
              error: `Company "${job.company_name}" not found. Please add the company first.`,
            });
            continue;
          }
        }

        // Lookup job type ID
        let type_id: number | undefined;
        if (job.type_code) {
          type_id = jobTypeMap.get(job.type_code.toLowerCase());
          if (!type_id) {
            results.errors.push({
              row: i + 1,
              title: job.title,
              error: `Job type "${job.type_id}" not found. Valid values: full-time, part-time, contract, internship, freelance`,
            });
            continue;
          }
        }

        // Lookup industry ID
        let industry_id: number | undefined;
        if (job.industry_code) {
          industry_id = industryMap.get(job.industry_code.toLowerCase());
          if (!industry_id) {
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
          company_id: company_id || null,
          company_name: job.company_name || null,
          type_id: type_id,
          jobs_scrapings_id: null,
          industry_id: industry_id,
          location: job.location || '',
          country: job.country || '',
          salary_min: job.salary_min || undefined,
          salary_max: job.salary_max || undefined,
          salary_frequency: job.salary_frequency || undefined,
          currency_id: currencyId,
          apply_url: job.apply_url || '',
          created_by_id: created_by_id,
          is_premium: job.is_premium || false,
          tags: job.tags,
          metadata: job.metadata
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
