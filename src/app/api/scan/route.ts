import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { validateScanInput, sanitizeText } from '@/utils/security';
import { analyzeCode, analyzeUrl } from '@/lib/ai-analyzer';
import { ScanReport } from '@/types';

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

// In-memory scan storage (in production, use Firebase)
const scanStorage = new Map<string, { scan: unknown; report: ScanReport }>();

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again later.',
          },
        },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();

    let validatedInput;
    try {
      validatedInput = validateScanInput(body);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid input';
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: sanitizeText(message),
          },
        },
        { status: 400 }
      );
    }

    // Generate scan ID
    const scanId = uuidv4();

    // Perform scan based on type
    let report: ScanReport;

    if (validatedInput.type === 'url' && validatedInput.url) {
      report = await analyzeUrl(validatedInput.url, scanId);
    } else if (validatedInput.type === 'code' && validatedInput.code) {
      report = await analyzeCode(validatedInput.code, {
        scanId,
        language: validatedInput.language,
      });
    } else if (validatedInput.type === 'file' && validatedInput.code) {
      report = await analyzeCode(validatedInput.code, {
        scanId,
        fileName: validatedInput.fileName,
        language: validatedInput.language,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_SCAN_TYPE',
            message: 'Invalid scan type or missing required data',
          },
        },
        { status: 400 }
      );
    }

    // Store scan result
    const scan = {
      id: scanId,
      type: validatedInput.type,
      status: 'completed',
      createdAt: new Date(),
      completedAt: new Date(),
    };

    scanStorage.set(scanId, { scan, report });

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        scanId,
        status: 'completed',
        summary: report.summary,
        score: report.score,
      },
    });
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while processing your scan',
        },
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scanId = searchParams.get('id');

  if (!scanId) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'MISSING_SCAN_ID',
          message: 'Scan ID is required',
        },
      },
      { status: 400 }
    );
  }

  const result = scanStorage.get(scanId);

  if (!result) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SCAN_NOT_FOUND',
          message: 'Scan not found',
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      scan: result.scan,
      report: result.report,
    },
  });
}
