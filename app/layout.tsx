import type { Metadata, Viewport } from 'next';
import './globals.css';

// =============================================================================
// Z2Q INITIATIVE - ROOT LAYOUT
// Parent Brand: Sayada.ai
// Academic Brand: Unconventional Wisdom Academy (UW)
// Flagship Product: Z2Q (Zero2Quantum)
// URL: https://uw.sayada.ai/z2q
// =============================================================================

const BASE_URL = 'https://uw.sayada.ai';
const APP_PATH = '/z2q';
const FULL_URL = `${BASE_URL}${APP_PATH}`;

// Brand Colors (Gold/Slate from UW Logo)
const BRAND_COLORS = {
  obsidianSlate: '#1A1A1B',
  deepCharcoal: '#2D2D2E',
  metallicGold: '#D4AF37',
  goldLight: '#E5C45C',
  ivory: '#F5F5F0',
};

export const metadata: Metadata = {
  // ==========================================================================
  // TITLE TEMPLATE
  // Pages use: { title: 'Dashboard' } → "Dashboard | Unconventional Wisdom Academy"
  // ==========================================================================
  title: {
    default: 'Z2Q Initiative | Unconventional Wisdom Academy',
    template: '%s | Unconventional Wisdom Academy',
  },
  
  description: 'Zero to Quantum in 12 Months. A Sayada.ai powered academy. Master quantum computing from Level 0 to Level 2 with legal, finance, cybersecurity, pharma, ML, and logistics specializations.',
  
  // ==========================================================================
  // META TAGS
  // ==========================================================================
  keywords: [
    'quantum computing',
    'quantum education',
    'quantum literacy',
    'post-quantum cryptography',
    'PQC',
    'NIST quantum standards',
    'quantum machine learning',
    'QML',
    'IBM Qiskit',
    'quantum legal',
    'quantum finance',
    'quantum cybersecurity',
    'quantum pharma',
    'Z2Q',
    'Zero2Quantum',
    'Unconventional Wisdom',
    'Unconventional Wisdom Academy',
    'Sayada.ai',
    'quantum career',
    'Q-Day',
  ],
  
  authors: [
    { name: 'Unconventional Wisdom Academy', url: BASE_URL },
    { name: 'Sayada.ai', url: 'https://sayada.ai' },
  ],
  creator: 'Unconventional Wisdom Academy',
  publisher: 'Sayada.ai',
  
  // ==========================================================================
  // CANONICAL & BASE URLs
  // ==========================================================================
  metadataBase: new URL(FULL_URL),
  alternates: {
    canonical: FULL_URL,
  },
  
  // ==========================================================================
  // OPEN GRAPH (Facebook, LinkedIn)
  // ==========================================================================
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: FULL_URL,
    siteName: 'Unconventional Wisdom Academy',
    title: 'Z2Q Initiative | From Zero to Level 2 Quantum Proficiency',
    description: 'The quantum revolution is not a prediction. It is a deadline. Master quantum computing in 12 months with the Z2Q Initiative by Unconventional Wisdom Academy.',
    images: [
      {
        url: `${FULL_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Z2Q Initiative - Unconventional Wisdom Academy - Powered by Sayada.ai',
        type: 'image/png',
      },
      {
        url: `${FULL_URL}/og-image-square.png`,
        width: 600,
        height: 600,
        alt: 'Z2Q Initiative Logo',
        type: 'image/png',
      },
    ],
  },
  
  // ==========================================================================
  // TWITTER CARD
  // ==========================================================================
  twitter: {
    card: 'summary_large_image',
    site: '@SayadaAI',
    creator: '@SayadaAI',
    title: 'Z2Q Initiative | Zero to Quantum in 12 Months',
    description: 'Master quantum computing from Level 0 to Level 2. The quantum age is here. A Sayada.ai powered academy.',
    images: [`${FULL_URL}/og-image.png`],
  },
  
  // ==========================================================================
  // ROBOTS
  // ==========================================================================
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // ==========================================================================
  // ICONS (Using Gold/Slate brand colors)
  // ==========================================================================
  icons: {
    icon: [
      { url: `${APP_PATH}/favicon.ico`, sizes: 'any' },
      { url: `${APP_PATH}/favicon-16x16.png`, sizes: '16x16', type: 'image/png' },
      { url: `${APP_PATH}/favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
    ],
    shortcut: `${APP_PATH}/favicon-16x16.png`,
    apple: [
      { url: `${APP_PATH}/apple-touch-icon.png`, sizes: '180x180', type: 'image/png' },
    ],
  },
  
  manifest: `${APP_PATH}/site.webmanifest`,
  
  // ==========================================================================
  // VERIFICATION (add your IDs)
  // ==========================================================================
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  
  // ==========================================================================
  // APP-SPECIFIC
  // ==========================================================================
  applicationName: 'Z2Q Initiative',
  category: 'education',
  classification: 'Quantum Computing Education',
};

// ==========================================================================
// VIEWPORT CONFIGURATION (separate export in Next.js 14)
// Using Obsidian Slate (#1A1A1B) as theme color
// ==========================================================================
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: BRAND_COLORS.obsidianSlate },
    { media: '(prefers-color-scheme: dark)', color: BRAND_COLORS.obsidianSlate },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'dark',
};

// ==========================================================================
// ROOT LAYOUT COMPONENT
// ==========================================================================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to Google Fonts for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for external services */}
        <link rel="dns-prefetch" href="https://uw.sayada.ai" />
        <link rel="dns-prefetch" href="https://api.stripe.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        
        {/* Theme Color Meta (fallback for older browsers) */}
        <meta name="theme-color" content={BRAND_COLORS.obsidianSlate} />
        <meta name="msapplication-TileColor" content={BRAND_COLORS.metallicGold} />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Unconventional Wisdom Academy',
              alternateName: 'UW Academy',
              url: BASE_URL,
              logo: `${FULL_URL}/logo.png`,
              description: 'A Sayada.ai powered academy for quantum computing education.',
              parentOrganization: {
                '@type': 'Organization',
                name: 'Sayada.ai',
                url: 'https://sayada.ai',
              },
              offers: {
                '@type': 'Offer',
                name: 'Z2Q Initiative',
                description: 'Zero to Quantum in 12 Months',
                url: FULL_URL,
                price: '997',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
        
        {/* Structured Data - Course */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Course',
              name: 'Z2Q Initiative - Zero to Quantum',
              description: 'Master quantum computing from Level 0 to Level 2 in 12 months with specializations in Legal, Finance, Cybersecurity, Pharma, ML, and Logistics.',
              provider: {
                '@type': 'Organization',
                name: 'Unconventional Wisdom Academy',
                sameAs: BASE_URL,
              },
              educationalLevel: 'Professional',
              hasCourseInstance: {
                '@type': 'CourseInstance',
                courseMode: 'online',
                duration: 'P12M',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-obsidian text-ivory antialiased">
        {children}
      </body>
    </html>
  );
}
