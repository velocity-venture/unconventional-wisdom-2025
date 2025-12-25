import type { Config } from 'tailwindcss';

// =============================================================================
// Z2Q INITIATIVE - TAILWIND THEME CONFIGURATION
// Brand: Unconventional Wisdom | Aesthetic: Quiet Luxury
// =============================================================================

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // =========================================================================
      // COLOR PALETTE - "Quiet Luxury" Brand System
      // =========================================================================
      colors: {
        // Primary: Obsidian Slate - The foundation of sophistication
        obsidian: {
          DEFAULT: '#1A1A1B',
          light: '#222223',
          dark: '#0F0F10',
        },
        
        // Secondary: Deep Charcoal - Subtle depth and hierarchy
        charcoal: {
          DEFAULT: '#2D2D2E',
          light: '#3A3A3B',
          dark: '#232324',
        },
        
        // Accent: Metallic Gold - Prestige without ostentation
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E5C45C',
          dark: '#B8962F',
          muted: '#A08030',
        },
        
        // Neutral: Ivory - Clean, readable text
        ivory: {
          DEFAULT: '#F5F5F0',
          warm: '#FAF8F2',
          cool: '#EEEEE8',
        },
        
        // Semantic: Status colors (used sparingly)
        status: {
          success: '#4A7C59',    // Muted forest green
          warning: '#C9A227',    // Amber gold
          error: '#8B3A3A',      // Deep burgundy
          info: '#4A6B8A',       // Steel blue
        },
      },
      
      // =========================================================================
      // TYPOGRAPHY - Academic Serif + Clean Sans
      // =========================================================================
      fontFamily: {
        // Display: Playfair Display - Elegant serif for headlines
        display: [
          'Playfair Display',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif',
        ],
        
        // Body: DM Sans - Modern, readable sans-serif (avoiding Inter)
        body: [
          'DM Sans',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        
        // Mono: JetBrains Mono - Technical/code contexts
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'Monaco',
          'monospace',
        ],
      },
      
      // =========================================================================
      // SPACING & SIZING - Generous, luxurious whitespace
      // =========================================================================
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // =========================================================================
      // BORDER RADIUS - Subtle, refined curves
      // =========================================================================
      borderRadius: {
        'subtle': '0.25rem',
        'card': '0.5rem',
        'panel': '0.75rem',
      },
      
      // =========================================================================
      // BOX SHADOW - Subtle depth, gold accents
      // =========================================================================
      boxShadow: {
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.15)',
        'glow-gold-lg': '0 0 40px rgba(212, 175, 55, 0.2)',
        'inner-gold': 'inset 0 0 20px rgba(212, 175, 55, 0.05)',
        'elevated': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.2)',
      },
      
      // =========================================================================
      // BACKGROUND IMAGES - Subtle textures and gradients
      // =========================================================================
      backgroundImage: {
        // Gradient: Hero section atmospheric effect
        'hero-gradient': 'linear-gradient(135deg, #1A1A1B 0%, #2D2D2E 50%, #1A1A1B 100%)',
        
        // Gradient: Gold accent fade
        'gold-fade': 'linear-gradient(90deg, rgba(212, 175, 55, 0.1) 0%, transparent 100%)',
        
        // Gradient: Card hover state
        'card-hover': 'linear-gradient(180deg, rgba(212, 175, 55, 0.05) 0%, transparent 100%)',
        
        // Pattern: Subtle grid (for hero backgrounds)
        'grid-pattern': `linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px)`,
      },
      
      // =========================================================================
      // ANIMATION - Refined, purposeful motion
      // =========================================================================
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.15)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 175, 55, 0.25)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      
      // =========================================================================
      // TYPOGRAPHY SCALE - Academic hierarchy
      // =========================================================================
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'headline': ['1.75rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'subhead': ['1.25rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'caption': ['0.875rem', { lineHeight: '1.5' }],
        'overline': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.15em' }],
      },
    },
  },
  plugins: [],
};

export default config;
