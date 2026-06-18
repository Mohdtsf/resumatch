// ============================================================
// ResuMatch — GET /api/report/[id]
// Fetch a saved analysis report by UUID
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getReport } from "@/lib/db/queries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Basic UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ID",
            message: "Invalid report ID format.",
          },
        },
        { status: 400 }
      );
    }

    const report = await getReport(id);

    if (!report) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Report not found. It may have expired or the link is invalid.",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("[Report API] Error:", error instanceof Error ? error.message : "Unknown");

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch report. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
