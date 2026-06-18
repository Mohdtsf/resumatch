// ============================================================
// ResuMatch — Resume Parser (PDF + DOCX text extraction)
// ============================================================

import type { FileType } from "@/lib/utils/types";

/**
 * Extract plain text from a resume file buffer.
 * Runs in-memory — never writes to disk.
 */
export async function parseResume(
  buffer: Buffer,
  fileType: FileType
): Promise<string> {
  switch (fileType) {
    case "pdf":
      return parsePDF(buffer);
    case "docx":
      return parseDOCX(buffer);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

/**
 * Extract text from PDF using pdf-parse.
 */
async function parsePDF(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParseModule = require("pdf-parse");
  // Handle CommonJS / ESM interop correctly
  const parse = pdfParseModule.default || pdfParseModule;

  const data = await parse(buffer, {
    // Limit pages to prevent abuse (100 pages is way more than any resume)
    max: 100,
  });

  if (!data.text || data.text.trim().length === 0) {
    throw new Error(
      "Could not extract text from the PDF. The file may be image-based (scanned). " +
      "Please use a text-based PDF or convert your resume to DOCX format."
    );
  }

  return data.text;
}

/**
 * Extract text from DOCX using mammoth.
 */
async function parseDOCX(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");

  const result = await mammoth.extractRawText({ buffer });

  if (!result.value || result.value.trim().length === 0) {
    throw new Error(
      "Could not extract text from the DOCX file. The file may be corrupted or empty."
    );
  }

  return result.value;
}
