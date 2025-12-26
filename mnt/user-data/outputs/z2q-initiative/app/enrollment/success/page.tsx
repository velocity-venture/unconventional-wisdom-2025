'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

// =============================================================================
// ENROLLMENT SUCCESS PAGE
// Displayed after successful Stripe checkout
// =============================================================================

export default function EnrollmentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [countdown, setCountdown] = useState(10);

  // Auto-redirect to dashboard after countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      window.location.href = '/dashboard';
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-obsidian text-ivory font-body flex items-center justify-center">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
        {/* Success Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="w-32 h-32 mx-auto mb-8"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-green-600/30 to-green-800/10 border border-green-600/50 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-6xl"
            >
              ✓
            </motion.span>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-green-400 tracking-[0.3em] text-xs mb-4 font-medium">
            ENROLLMENT CONFIRMED
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-ivory mb-4">
            Welcome to Z2Q
          </h1>
          <p className="text-xl text-ivory/70 mb-8">
            Your quantum journey begins now.
          </p>
        </motion.div>

        {/* What Happens Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-charcoal/30 rounded-lg border border-charcoal p-6 mb-8 text-left"
        >
          <h2 className="font-display text-lg text-gold mb-4">What Happens Next</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-800/30 rounded-full flex items-center justify-center shrink-0">
                <span className="text-green-400 text-sm">1</span>
              </div>
              <div>
                <p className="text-ivory font-semibold">Check Your Email</p>
                <p className="text-ivory/60 text-sm">
                  A welcome email with your login details is on its way.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-800/30 rounded-full flex items-center justify-center shrink-0">
                <span className="text-green-400 text-sm">2</span>
              </div>
              <div>
                <p className="text-ivory font-semibold">Complete the Orientation</p>
                <p className="text-ivory/60 text-sm">
                  Your dashboard will guide you through a 3-minute mission briefing.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-800/30 rounded-full flex items-center justify-center shrink-0">
                <span className="text-green-400 text-sm">3</span>
              </div>
              <div>
                <p className="text-ivory font-semibold">Start Month 1</p>
                <p className="text-ivory/60 text-sm">
                  Begin with Python fundamentals and prepare for quantum circuits.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <a
            href="/dashboard"
            className="inline-block px-8 py-4 bg-gold text-obsidian font-semibold text-lg rounded hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/20"
          >
            Enter Your Dashboard
          </a>
          <p className="text-ivory/40 text-sm mt-4">
            Auto-redirecting in {countdown} seconds...
          </p>
        </motion.div>

        {/* Session ID (for debugging) */}
        {sessionId && (
          <p className="text-ivory/20 text-xs mt-8 font-mono">
            Session: {sessionId.slice(0, 20)}...
          </p>
        )}
      </div>
    </div>
  );
}
