// ============================================================
// ResuMatch — File Validator (Magic Bytes + Size)
// ============================================================

import { MAX_FILE_SIZE } from "@/lib/utils/constants";
import type { FileType } from "@/lib/utils/types";

/** PDF magic bytes: %PDF */
const PDF_MAGIC = new Uint8Array([0x25, 0x50, 0x44, 0x46]);

/** DOCX magic bytes: PK (ZIP archive) */
const ZIP_MAGIC = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);

interface ValidationResult {
  valid: boolean;
  fileType?: FileType;
  error?: string;
}

/**
 * Validate uploaded file by magic bytes and size.
 * Never trust file extensions alone — they're trivially spoofable.
 */
export function validateFile(buffer: Buffer, fileName: string): ValidationResult {
  // Check size first
  if (buffer.length > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    };
  }

  if (buffer.length === 0) {
    return {
      valid: false,
      error: "File is empty.",
    };
  }

  // Check magic bytes
  const header = new Uint8Array(buffer.subarray(0, 4));

  // Check for PDF
  if (
    header[0] === PDF_MAGIC[0] &&
    header[1] === PDF_MAGIC[1] &&
    header[2] === PDF_MAGIC[2] &&
    header[3] === PDF_MAGIC[3]
  ) {
    return { valid: true, fileType: "pdf" };
  }

  // Check for DOCX (ZIP archive)
  if (
    header[0] === ZIP_MAGIC[0] &&
    header[1] === ZIP_MAGIC[1] &&
    header[2] === ZIP_MAGIC[2] &&
    header[3] === ZIP_MAGIC[3]
  ) {
    // Additional check: verify the filename ends with .docx
    const ext = fileName.toLowerCase().split(".").pop();
    if (ext === "docx") {
      return { valid: true, fileType: "docx" };
    }
    return {
      valid: false,
      error: "Only .docx Word documents are supported (not .doc, .zip, or other archive formats).",
    };
  }

  return {
    valid: false,
    error: "Invalid file format. Only PDF and DOCX files are accepted.",
  };
}
