// =============================================================================
// Z2Q URL CONFIGURATION
// Centralized URL construction for the Unconventional Wisdom Academy
// =============================================================================

// =============================================================================
// BRAND HIERARCHY
// Parent Brand: Sayada.ai
// Academic Brand: Unconventional Wisdom Academy (UW)
// Flagship Product: Z2Q (Zero2Quantum)
// =============================================================================

/**
 * Base URL for the Unconventional Wisdom domain
 * This is the subdomain under Sayada.ai
 */
export const UW_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://uw.sayada.ai';

/**
 * Application path for Z2Q
 * All Z2Q routes are under this path
 * Matches the basePath in next.config.js
 */
export const Z2Q_PATH = '/z2q';

/**
 * Full URL to the Z2Q application root
 * Use this for external links, emails, and Stripe redirects
 */
export const Z2Q_FULL_URL = `${UW_BASE_URL}${Z2Q_PATH}`;

// =============================================================================
// URL CONSTRUCTION HELPERS
// =============================================================================

/**
 * Construct a full external URL for a Z2Q page
 * Use this for Stripe redirects, emails, and external links
 * 
 * @param path - The path relative to /z2q (e.g., '/dashboard', '/enrollment/success')
 * @returns Full URL (e.g., 'https://uw.sayada.ai/z2q/dashboard')
 */
export function getZ2QUrl(path: string = ''): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${Z2Q_FULL_URL}${normalizedPath}`;
}

/**
 * Construct an internal Next.js Link href
 * Use this for <Link> components (basePath is automatically prepended)
 * 
 * @param path - The path relative to /z2q (e.g., '/dashboard')
 * @returns Internal path (e.g., '/dashboard')
 */
export function getInternalPath(path: string = ''): string {
  // For internal Next.js links, don't include basePath
  // Next.js automatically prepends it
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Construct an API route URL
 * API routes are also under the basePath
 * 
 * @param endpoint - The API endpoint (e.g., '/checkout', '/webhooks/stripe')
 * @returns Full API URL (e.g., 'https://uw.sayada.ai/z2q/api/checkout')
 */
export function getApiUrl(endpoint: string): string {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${Z2Q_FULL_URL}/api${normalizedEndpoint}`;
}

// =============================================================================
// PREDEFINED URLS
// Common URLs used throughout the application
// =============================================================================

export const Z2Q_URLS = {
  // Landing & Marketing
  home: Z2Q_FULL_URL,
  whitepaper: `${Z2Q_FULL_URL}/whitepaper`,
  
  // Dashboard & Learning
  dashboard: `${Z2Q_FULL_URL}/dashboard`,
  onboarding: `${Z2Q_FULL_URL}/onboarding`,
  lessons: `${Z2Q_FULL_URL}/dashboard/lessons`,
  
  // Enrollment & Payments
  enrollmentSuccess: `${Z2Q_FULL_URL}/enrollment/success`,
  
  // Support
  support: `${Z2Q_FULL_URL}/support`,
  community: `${Z2Q_FULL_URL}/community`,
  
  // Legal
  privacy: `${Z2Q_FULL_URL}/privacy`,
  terms: `${Z2Q_FULL_URL}/terms`,
  unsubscribe: `${Z2Q_FULL_URL}/unsubscribe`,
  
  // API Webhooks (for Stripe configuration)
  stripeWebhook: `${Z2Q_FULL_URL}/api/webhooks/stripe`,
} as const;

// =============================================================================
// STRIPE-SPECIFIC URLs
// URLs with query parameters for Stripe Checkout
// =============================================================================

export const STRIPE_URLS = {
  success: `${Z2Q_FULL_URL}/enrollment/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel: `${Z2Q_FULL_URL}?canceled=true`,
} as const;

// =============================================================================
// EXTERNAL URLS
// Links to external services
// =============================================================================

export const EXTERNAL_URLS = {
  // Parent brands
  sayadaAi: 'https://sayada.ai',
  unconventionalWisdom: UW_BASE_URL,
  
  // Learning Resources
  ibmQuantum: 'https://quantum.ibm.com',
  ibmQuantumLearning: 'https://learning.quantum.ibm.com',
  qiskitTextbook: 'https://qiskit.org/textbook',
  khanAcademy: 'https://www.khanacademy.org/math/linear-algebra',
  
  // Social
  twitter: 'https://twitter.com/SayadaAI',
  linkedin: 'https://linkedin.com/company/sayada-ai',
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type Z2QUrlKey = keyof typeof Z2Q_URLS;
export type ExternalUrlKey = keyof typeof EXTERNAL_URLS;
