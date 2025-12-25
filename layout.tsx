import type { Metadata } from 'next';
import './globals.css';

// =============================================================================
// Z2Q INITIATIVE - ROOT LAYOUT
// Brand: Unconventional Wisdom | Powered by Sayada.ai
// =============================================================================

export const metadata: Metadata = {
  title: 'Z2Q Initiative | Zero to Quantum in 12 Months',
  description: 'The Zero2Quantum Initiative by Unconventional Wisdom. Master quantum computing from Level 0 to Level 2 in 12 months. Legal, Finance, Cybersecurity, Pharma, ML, and Logistics specializations. No PhD required.',
  keywords: [
    'quantum computing',
    'quantum education',
    'quantum literacy',
    'post-quantum cryptography',
    'PQC',
    'quantum machine learning',
    'IBM Qiskit',
    'quantum legal',
    'quantum finance',
    'quantum cybersecurity',
    'Z2Q',
    'Unconventional Wisdom',
    'Sayada.ai',
  ],
  authors: [{ name: 'Unconventional Wisdom' }],
  creator: 'Unconventional Wisdom',
  publisher: 'Sayada.ai',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://z2q.academy',
    siteName: 'Z2Q Initiative',
    title: 'Z2Q | From Zero to Level 2 Quantum Proficiency',
    description: 'The quantum revolution is not a prediction. It is a deadline. Master quantum computing in 12 months with the Z2Q Initiative.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Z2Q Initiative - Unconventional Wisdom',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Z2Q Initiative | Zero to Quantum',
    description: 'Master quantum computing from Level 0 to Level 2 in 12 months. The quantum age is here.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  themeColor: '#1A1A1B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-obsidian text-ivory antialiased">
        {children}
      </body>
    </html>
  );
}
