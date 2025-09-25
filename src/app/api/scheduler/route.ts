import { NextRequest, NextResponse } from 'next/server';
import { jobScheduler } from '@/lib/job-scheduler';

// GET /api/scheduler - Get scheduler status
export async function GET() {
  try {
    const status = jobScheduler.getStatus();
    return NextResponse.json({
      success: true,
      status
    });
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/scheduler - Control scheduler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, config } = body;

    switch (action) {
      case 'start':
        jobScheduler.start();
        return NextResponse.json({
          success: true,
          message: 'Scheduler started'
        });

      case 'stop':
        jobScheduler.stop();
        return NextResponse.json({
          success: true,
          message: 'Scheduler stopped'
        });

      case 'trigger':
        const result = await jobScheduler.triggerManualScraping();
        return NextResponse.json({
          success: result.success,
          message: result.message,
          totalJobs: result.totalJobs
        });

      case 'config':
        if (config) {
          jobScheduler.updateConfig(config);
          return NextResponse.json({
            success: true,
            message: 'Scheduler configuration updated'
          });
        } else {
          return NextResponse.json({
            success: false,
            error: 'Configuration not provided'
          }, { status: 400 });
        }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in scheduler API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
