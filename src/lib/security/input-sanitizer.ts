// ============================================================
// ResuMatch — Input Sanitizer
// ============================================================

import { MAX_JD_LENGTH } from "@/lib/utils/constants";

/**
 * Sanitize text input — remove control characters, normalize whitespace,
 * and enforce length limits.
 */
export function sanitizeText(input: string, maxLength: number = MAX_JD_LENGTH): string {
  if (!input || typeof input !== "string") return "";

  return input
    // Remove null bytes and other control characters (except newlines/tabs)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Normalize line endings
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Collapse excessive newlines (more than 3 consecutive)
    .replace(/\n{4,}/g, "\n\n\n")
    // Collapse excessive spaces (more than 2 consecutive)
    .replace(/ {3,}/g, "  ")
    // Trim
    .trim()
    // Enforce length limit
    .slice(0, maxLength);
}

/**
 * Sanitize filename — remove path traversal attempts and special characters.
 */
export function sanitizeFileName(name: string): string {
  return name
    .replace(/[\/\\:*?"<>|]/g, "_")
    .replace(/\.\./g, "_")
    .trim();
}
