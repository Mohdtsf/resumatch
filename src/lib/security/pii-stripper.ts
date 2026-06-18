// ============================================================
// ResuMatch — PII Stripper
// De-identifies resume text before sending to Gemini API
// ============================================================

/**
 * Strip personally identifiable information from resume text
 * before sending to external AI services.
 * 
 * On Gemini's free tier, Google may use prompts for model improvement,
 * so we strip PII to protect user privacy.
 */
export function stripPII(text: string): string {
  let cleaned = text;

  // Strip email addresses
  cleaned = cleaned.replace(
    /[\w.+-]+@[\w-]+\.[\w.-]+/g,
    "[EMAIL]"
  );

  // Strip phone numbers (various formats)
  cleaned = cleaned.replace(
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    "[PHONE]"
  );

  // Strip URLs (LinkedIn, GitHub, personal websites)
  cleaned = cleaned.replace(
    /https?:\/\/[^\s]+/g,
    "[URL]"
  );

  // Strip street addresses (basic pattern)
  cleaned = cleaned.replace(
    /\d{1,5}\s+[\w\s]+(?:street|st|avenue|ave|boulevard|blvd|road|rd|drive|dr|lane|ln|way|court|ct|circle|cir|place|pl)\.?(?:\s*#?\s*\d+)?/gi,
    "[ADDRESS]"
  );

  // Strip zip/postal codes
  cleaned = cleaned.replace(
    /\b\d{5}(-\d{4})?\b/g,
    "[ZIP]"
  );

  // Strip SSN-like patterns (just in case)
  cleaned = cleaned.replace(
    /\b\d{3}-\d{2}-\d{4}\b/g,
    "[REDACTED]"
  );

  return cleaned;
}
