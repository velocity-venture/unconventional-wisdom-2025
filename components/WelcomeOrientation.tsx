'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =============================================================================
// WELCOME ORIENTATION OVERLAY
// The "First 5 Minutes" experience for new Level 0 students
// Aesthetic: Quiet Luxury / Mission Briefing
// =============================================================================

interface WelcomeOrientationProps {
  isOpen: boolean;
  studentName: string;
  onComplete: () => void;
}

export default function WelcomeOrientation({
  isOpen,
  studentName,
  onComplete,
}: WelcomeOrientationProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian"
      >
        {/* Atmospheric Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
            }}
          />
          {/* Gold Atmospheric Glow */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[100px]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-3xl mx-4">
          {/* Progress Indicator */}
          <div className="flex justify-center gap-3 mb-8">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`h-1 w-16 rounded-full transition-all duration-500 ${
                  step === currentStep
                    ? 'bg-gold'
                    : step < currentStep
                    ? 'bg-gold/50'
                    : 'bg-charcoal'
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {/* ===== STEP 1: YOUR MISSION ===== */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                {/* Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-8"
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center">
                    <span className="font-display text-4xl text-gold">0</span>
                  </div>
                </motion.div>

                <p className="text-gold tracking-[0.3em] text-xs mb-4 font-medium">
                  MISSION BRIEFING
                </p>
                <h1 className="font-display text-4xl md:text-5xl text-ivory mb-4">
                  Welcome, {studentName || 'Scholar'}
                </h1>
                <p className="text-ivory/70 text-lg mb-8 max-w-xl mx-auto">
                  You are now <span className="text-gold font-semibold">Level 0</span> — 
                  Quantum Awareness. Over the next 12 months, you will transform into one of 
                  the rare professionals who bridges quantum computing and real-world application.
                </p>

                {/* Timeline Visual */}
                <div className="bg-charcoal/30 rounded-lg border border-charcoal p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-left">
                      <p className="text-gold font-display text-lg">Foundation</p>
                      <p className="text-ivory/50 text-xs">Months 1-6</p>
                    </div>
                    <div className="flex-1 mx-4 relative">
                      <div className="h-0.5 bg-charcoal w-full" />
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-gold rounded-full" />
                      <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-charcoal border border-gold/50 rounded-full" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-charcoal border border-gold/30 rounded-full" />
                    </div>
                    <div className="text-right">
                      <p className="text-ivory/50 font-display text-lg">Specialization</p>
                      <p className="text-ivory/30 text-xs">Months 7-12</p>
                    </div>
                  </div>
                  <p className="text-ivory/60 text-sm text-center">
                    You are here → <span className="text-gold">Month 1: Foundation Building</span>
                  </p>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-obsidian/50 p-4 rounded border border-charcoal">
                    <p className="font-display text-2xl text-gold">18</p>
                    <p className="text-ivory/50 text-xs">Foundation Lessons</p>
                  </div>
                  <div className="bg-obsidian/50 p-4 rounded border border-charcoal">
                    <p className="font-display text-2xl text-ivory">6</p>
                    <p className="text-ivory/50 text-xs">Specialization Tracks</p>
                  </div>
                  <div className="bg-obsidian/50 p-4 rounded border border-charcoal">
                    <p className="font-display text-2xl text-green-400">$300</p>
                    <p className="text-ivory/50 text-xs">Completion Reward</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===== STEP 2: YOUR AI TUTOR ===== */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                {/* AI Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-8"
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center">
                    <span className="text-5xl">🎓</span>
                  </div>
                </motion.div>

                <p className="text-gold tracking-[0.3em] text-xs mb-4 font-medium">
                  YOUR GUIDE
                </p>
                <h2 className="font-display text-4xl text-ivory mb-4">
                  The Socratic AI Tutor
                </h2>
                <p className="text-ivory/70 text-lg mb-8 max-w-xl mx-auto">
                  You are never alone on this journey. Our AI Academic Proctor is available 24/7 
                  to guide you through concepts, answer questions, and keep you on track.
                </p>

                {/* How It Works */}
                <div className="bg-charcoal/30 rounded-lg border border-charcoal p-6 mb-8 text-left">
                  <h3 className="font-display text-lg text-gold mb-4 text-center">
                    How to Use Your AI Tutor
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-gold font-bold">1</span>
                      </div>
                      <div>
                        <p className="text-ivory font-semibold mb-1">Ask Anything Foundation-Related</p>
                        <p className="text-ivory/60 text-sm">
                          "What is a Hadamard gate?" • "Explain superposition like I'm five" • 
                          "How do I run my first Qiskit circuit?"
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-gold font-bold">2</span>
                      </div>
                      <div>
                        <p className="text-ivory font-semibold mb-1">Get Socratic Guidance</p>
                        <p className="text-ivory/60 text-sm">
                          The tutor won't just give answers—it will guide you to understanding 
                          with questions, examples, and metaphors.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-gold font-bold">3</span>
                      </div>
                      <div>
                        <p className="text-ivory font-semibold mb-1">Stay on the Path</p>
                        <p className="text-ivory/60 text-sm">
                          If you ask about advanced topics before you're ready, the tutor will 
                          gently redirect you to the foundations you need first.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sample Interaction */}
                <div className="bg-obsidian p-4 rounded-lg border border-charcoal text-left">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-charcoal rounded-full flex items-center justify-center text-sm">
                      You
                    </div>
                    <div className="bg-charcoal/50 px-4 py-2 rounded-lg">
                      <p className="text-ivory text-sm">"What is a qubit?"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                      <span className="text-sm">🎓</span>
                    </div>
                    <div className="bg-gold/10 px-4 py-2 rounded-lg border border-gold/20">
                      <p className="text-ivory/90 text-sm">
                        "Think of a classical bit like a light switch—it's either ON or OFF. 
                        A qubit is more like a dimmer switch that can be anywhere in between... 
                        <span className="text-gold">What do you think happens when we measure it?</span>"
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===== STEP 3: YOUR REWARD ===== */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                {/* Reward Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-8"
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-green-600/30 to-green-800/10 border border-green-600/30 flex items-center justify-center">
                    <span className="text-5xl">💰</span>
                  </div>
                </motion.div>

                <p className="text-gold tracking-[0.3em] text-xs mb-4 font-medium">
                  YOUR INCENTIVE
                </p>
                <h2 className="font-display text-4xl text-ivory mb-4">
                  The $300 Credit Rebound
                </h2>
                <p className="text-ivory/70 text-lg mb-8 max-w-xl mx-auto">
                  Investing in foresight should be rewarded. Complete the 6-month Foundation, 
                  and <span className="text-green-400 font-semibold">$300 comes back to you</span>.
                </p>

                {/* Reward Details */}
                <div className="bg-gradient-to-b from-green-900/20 to-obsidian rounded-lg border border-green-800/30 p-6 mb-8">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="text-center">
                      <p className="font-display text-5xl text-green-400">$300</p>
                      <p className="text-ivory/50 text-sm">Credit Rebound</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div className="bg-obsidian/50 p-4 rounded border border-charcoal">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">📚</span>
                        <p className="text-ivory font-semibold">Option A: Module Credit</p>
                      </div>
                      <p className="text-ivory/60 text-sm">
                        Apply your $300 toward premium features in your chosen Specialization track: 
                        mentor sessions, extended IBM Quantum credits, priority review.
                      </p>
                    </div>
                    <div className="bg-obsidian/50 p-4 rounded border border-charcoal">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">💵</span>
                        <p className="text-ivory font-semibold">Option B: Cash Back</p>
                      </div>
                      <p className="text-ivory/60 text-sm">
                        Request a direct refund of $300 to your original payment method. 
                        Processed within 5-7 business days via Stripe.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-green-800/20">
                    <p className="text-green-400/80 text-sm">
                      <span className="font-semibold">Unlock Condition:</span> Complete the Month 6 
                      Foundation Capstone with a passing score (70/100).
                    </p>
                  </div>
                </div>

                {/* Ready Statement */}
                <div className="bg-gold/10 p-6 rounded-lg border border-gold/30">
                  <p className="font-display text-xl text-gold mb-2">
                    The Quantum Age Is Here
                  </p>
                  <p className="text-ivory/70">
                    Will you be ready, or will you be behind?
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              className={`px-6 py-3 text-ivory/60 hover:text-ivory transition-colors ${
                currentStep === 0 ? 'invisible' : ''
              }`}
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-gold text-obsidian font-semibold rounded hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/20"
            >
              {currentStep === 2 ? 'Begin Your Journey' : 'Continue →'}
            </button>
          </div>

          {/* Skip Option */}
          {currentStep < 2 && (
            <div className="text-center mt-4">
              <button
                onClick={onComplete}
                className="text-xs text-ivory/30 hover:text-ivory/50 transition-colors"
              >
                Skip orientation
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
