import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

/**
 * Security utilities for input validation and sanitization
 * Critical for preventing XSS, injection, and other attacks
 */

// Sanitize HTML input to prevent XSS
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
}

// Sanitize plain text (remove all HTML)
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

// URL validation schema
export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    },
    { message: 'URL must use HTTP or HTTPS protocol' }
  )
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        // Block localhost and private IPs (SSRF protection)
        const hostname = parsed.hostname.toLowerCase();
        const blockedPatterns = [
          'localhost',
          '127.0.0.1',
          '0.0.0.0',
          '::1',
          '10.',
          '172.16.',
          '172.17.',
          '172.18.',
          '172.19.',
          '172.20.',
          '172.21.',
          '172.22.',
          '172.23.',
          '172.24.',
          '172.25.',
          '172.26.',
          '172.27.',
          '172.28.',
          '172.29.',
          '172.30.',
          '172.31.',
          '192.168.',
          '169.254.',
          'metadata.google',
          '169.254.169.254', // AWS metadata
        ];
        return !blockedPatterns.some(
          (pattern) => hostname === pattern || hostname.startsWith(pattern)
        );
      } catch {
        return false;
      }
    },
    { message: 'Cannot scan localhost or private IP addresses' }
  );

// Email validation schema
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(254, 'Email is too long')
  .transform((email) => email.toLowerCase().trim());

// Password validation schema (strong password requirements)
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .refine(
    (password) => /[A-Z]/.test(password),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (password) => /[a-z]/.test(password),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (password) => /[0-9]/.test(password),
    'Password must contain at least one number'
  )
  .refine(
    (password) => /[^A-Za-z0-9]/.test(password),
    'Password must contain at least one special character'
  );

// Code input validation (limit size, sanitize)
export const codeSchema = z
  .string()
  .min(1, 'Code cannot be empty')
  .max(500000, 'Code is too large (max 500KB)')
  .transform((code) => {
    // Remove null bytes and other potentially dangerous characters
    return code.replace(/\0/g, '');
  });

// File name validation
export const fileNameSchema = z
  .string()
  .min(1, 'File name is required')
  .max(255, 'File name is too long')
  .refine(
    (name) => !name.includes('..'),
    'Invalid file name (path traversal detected)'
  )
  .refine(
    (name) => /^[\w\-. ]+$/.test(name),
    'File name contains invalid characters'
  );

// Rate limiting key generator
export function generateRateLimitKey(identifier: string, action: string): string {
  return `ratelimit:${action}:${identifier}`;
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (byte) => chars[byte % chars.length]).join('');
}

// Validate and sanitize scan input
export interface ValidatedScanInput {
  type: 'url' | 'code' | 'file';
  url?: string;
  code?: string;
  fileName?: string;
  language?: string;
}

export function validateScanInput(input: unknown): ValidatedScanInput {
  const scanInputSchema = z.discriminatedUnion('type', [
    z.object({
      type: z.literal('url'),
      url: urlSchema,
    }),
    z.object({
      type: z.literal('code'),
      code: codeSchema,
      language: z.string().max(50).optional(),
    }),
    z.object({
      type: z.literal('file'),
      fileName: fileNameSchema,
      code: codeSchema,
      language: z.string().max(50).optional(),
    }),
  ]);

  return scanInputSchema.parse(input);
}

// Escape special characters for safe logging
export function escapeForLogging(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .slice(0, 1000); // Limit log length
}

// Check if string contains potential SQL injection patterns
export function containsSqlInjectionPatterns(input: string): boolean {
  const patterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/i,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
    /(--|#|\/\*|\*\/)/,
    /(\bEXEC\b|\bXP_)/i,
  ];
  return patterns.some((pattern) => pattern.test(input));
}

// Validate content type
export function isAllowedContentType(contentType: string, allowedTypes: string[]): boolean {
  const normalized = contentType.toLowerCase().split(';')[0].trim();
  return allowedTypes.some((allowed) => normalized === allowed.toLowerCase());
}
