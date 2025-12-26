'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =============================================================================
// Z2Q INITIATIVE LANDING PAGE
// Brand: Unconventional Wisdom | Powered by Sayada.ai
// Aesthetic: Quiet Luxury / Minimalist Academic / Technological Conservative
// Stripe Integration: price_1Si3mNI3wsIEE2uCkXfbxAvJ
// =============================================================================

export default function Z2QLandingPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeSpecialization, setActiveSpecialization] = useState(0);
  
  // Checkout State
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

  // Check URL params for canceled checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('canceled') === 'true') {
      setCheckoutError('Checkout was canceled. Ready to try again when you are.');
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // ==========================================================================
  // STRIPE CHECKOUT HANDLER
  // ==========================================================================
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      // Check if already enrolled (if email provided)
      if (email) {
        const checkResponse = await fetch(`/api/checkout?email=${encodeURIComponent(email)}`);
        const checkData = await checkResponse.json();
        
        if (checkData.enrolled) {
          setAlreadyEnrolled(true);
          setIsCheckingOut(false);
          return;
        }
      }

      // Create Stripe Checkout Session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || undefined,
          name: fullName || undefined,
        }),
      });

      const data = await response.json();

      if (data.status === 'already_enrolled') {
        setAlreadyEnrolled(true);
        setIsCheckingOut(false);
        return;
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      setCheckoutError(error.message || 'Something went wrong. Please try again.');
      setIsCheckingOut(false);
    }
  };

  // Handle direct checkout (skip modal)
  const handleDirectCheckout = () => {
    setShowEnrollModal(true);
  };

  const specializations = [
    {
      title: 'Legal & IP Strategy',
      icon: '⚖️',
      description: 'Navigate the Quantum Patent Gap and PQC liability landscape.',
      months: ['Quantum IP & Patent Law', 'Cryptographic Transition Liability', 'Regulatory Frameworks', 'Ethical Compliance (HNDL)', 'International Trade Controls', 'Capstone: Q-Ready Legal Strategy'],
    },
    {
      title: 'Finance & Risk Intelligence',
      icon: '📊',
      description: 'Master quantum Monte Carlo, portfolio optimization, and fraud detection.',
      months: ['Quantum Monte Carlo', 'High-Frequency Trading', 'Portfolio Optimization (QUBO)', 'Fraud Detection (QSVM)', 'Quantum Credit Scoring', 'Capstone: Q-Resilient Portfolio'],
    },
    {
      title: 'Cybersecurity & PQC',
      icon: '🛡️',
      description: 'Defend against Shor\'s threat and implement quantum-safe protocols.',
      months: ['Shor\'s Threat Analysis', 'NIST PQC Standards', 'Quantum Key Distribution', 'Legacy Migration', 'Hardware Security Modules', 'Capstone: Q-Vulnerability Audit'],
    },
    {
      title: 'Pharmaceuticals & Discovery',
      icon: '🧬',
      description: 'Simulate molecules and accelerate drug discovery pipelines.',
      months: ['Molecular Hamiltonian', 'Quantum-Enhanced Docking', 'Protein Folding Logic', 'Personalized Medicine', 'Clinical Trial Optimization', 'Capstone: Q-Assisted Discovery'],
    },
    {
      title: 'Machine Learning & AI',
      icon: '🤖',
      description: 'Build quantum neural networks and hybrid AI architectures.',
      months: ['QML Foundations', 'Quantum Neural Networks', 'Quantum Generative AI', 'NLP & Quantum Linguistics', 'Edge Quantum AI', 'Capstone: Hybrid QNN Training'],
    },
    {
      title: 'Logistics & Supply Chain',
      icon: '🚚',
      description: 'Solve TSP, optimize routes, and predict disruptions at scale.',
      months: ['Traveling Salesperson (TSP)', 'Fleet & Route Optimization', 'Quantum Inventory Management', 'Warehouse Automation', 'Predictive Logistics', 'Capstone: Multi-Modal Network'],
    },
  ];

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDownloading(true);
    // Simulated download - would connect to backend
    setTimeout(() => {
      setIsDownloading(false);
      alert('White Paper download initiated. Check your email.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory font-body">
      {/* ===== NAVIGATION ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-obsidian/95 backdrop-blur-sm border-b border-charcoal">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
              <span className="text-obsidian font-display font-bold text-lg">Z</span>
            </div>
            <div>
              <p className="font-display text-gold text-sm tracking-widest">UNCONVENTIONAL WISDOM</p>
              <p className="text-xs text-ivory/50 tracking-wider">Powered by Sayada.ai</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#curriculum" className="text-sm text-ivory/70 hover:text-gold transition-colors">Curriculum</a>
            <a href="#specializations" className="text-sm text-ivory/70 hover:text-gold transition-colors">Specializations</a>
            <a href="#investment" className="text-sm text-ivory/70 hover:text-gold transition-colors">Investment</a>
            <a href="#whitepaper" className="px-5 py-2 bg-gold text-obsidian font-semibold text-sm rounded hover:bg-gold-light transition-colors">
              Get the White Paper
            </a>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-charcoal/30 to-obsidian" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold tracking-[0.3em] text-sm mb-6 font-medium">THE ZERO2QUANTUM INITIATIVE</p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-ivory mb-8 leading-tight">
              Z2Q
              <span className="block text-3xl md:text-4xl lg:text-5xl text-gold mt-4">
                From Zero to Level 2
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-ivory/70 max-w-3xl mx-auto mb-12 leading-relaxed">
              The quantum revolution is not a prediction. <span className="text-gold font-semibold">It is a deadline.</span>
              <br className="hidden md:block" />
              Master quantum computing in 12 months. No PhD required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleDirectCheckout}
                className="px-8 py-4 bg-gold text-obsidian font-semibold text-lg rounded hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/20"
              >
                Begin Your Quantum Journey
              </button>
              <a
                href="#whitepaper"
                className="px-8 py-4 border border-gold/50 text-gold font-semibold text-lg rounded hover:border-gold hover:bg-gold/5 transition-all"
              >
                Download the Legal Briefing
              </a>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <p className="font-display text-4xl text-gold">12</p>
              <p className="text-sm text-ivory/50 mt-1">Months</p>
            </div>
            <div className="text-center border-x border-charcoal">
              <p className="font-display text-4xl text-gold">6</p>
              <p className="text-sm text-ivory/50 mt-1">Specializations</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl text-gold">$300</p>
              <p className="text-sm text-ivory/50 mt-1">Credit Rebound</p>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gold/30 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-gold rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ===== THE QUANTUM MANDATE ===== */}
      <section className="py-24 bg-charcoal/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold tracking-[0.2em] text-sm mb-4">THE INFLECTION POINT</p>
              <h2 className="font-display text-4xl md:text-5xl text-ivory mb-6">
                Q-Day Is Not a Prediction
              </h2>
              <p className="text-ivory/70 text-lg leading-relaxed mb-6">
                While the industry was distracted by LLMs, the quantum revolution quietly moved into its 
                <span className="text-gold"> implementation phase</span>. Google's Willow chip has achieved 
                exponential error reduction. The timeline for "Cryptographically Relevant Quantum Computers" 
                has compressed dramatically.
              </p>
              <p className="text-ivory/70 text-lg leading-relaxed">
                For professionals in legal, finance, and technology sectors, 2026 marks the end of 
                "wait and see." The liabilities are real. <span className="text-gold font-semibold">So are the opportunities.</span>
              </p>
            </div>
            <div className="bg-obsidian p-8 rounded-lg border border-charcoal">
              <h3 className="font-display text-2xl text-gold mb-6">The Three Mandates</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded flex items-center justify-center text-gold shrink-0">01</div>
                  <div>
                    <p className="text-ivory font-semibold mb-1">The IP Land Grab</p>
                    <p className="text-ivory/60 text-sm">Quantum patent filings increased 5x since 2014. Late movers risk permanent lockout.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded flex items-center justify-center text-gold shrink-0">02</div>
                  <div>
                    <p className="text-ivory font-semibold mb-1">PQC Compliance</p>
                    <p className="text-ivory/60 text-sm">NIST has finalized four quantum-resistant algorithms. EU mandates coming in 2026.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded flex items-center justify-center text-gold shrink-0">03</div>
                  <div>
                    <p className="text-ivory font-semibold mb-1">HNDL Liability</p>
                    <p className="text-ivory/60 text-sm">"Harvest Now, Decrypt Later" attacks create present-day fiduciary risk.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CURRICULUM OVERVIEW ===== */}
      <section id="curriculum" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.2em] text-sm mb-4">THE ROADMAP</p>
            <h2 className="font-display text-4xl md:text-5xl text-ivory mb-6">
              Zero to Level 2 in 12 Months
            </h2>
            <p className="text-ivory/70 text-lg max-w-2xl mx-auto">
              A structured progression from quantum awareness to practical application. 
              No PhD required—just focus, consistency, and the right guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Foundation Phase */}
            <div className="bg-gradient-to-b from-charcoal/50 to-obsidian p-8 rounded-lg border border-charcoal hover:border-gold/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">📚</span>
                </div>
                <div>
                  <p className="text-gold text-sm tracking-wider">MONTHS 1-6</p>
                  <h3 className="font-display text-2xl text-ivory">The Foundation</h3>
                </div>
              </div>
              <p className="text-ivory/70 mb-6">
                Bridge the gap between classical computing and quantum logic. Master the prerequisites 
                that separate the informed from the obsolete.
              </p>
              <ul className="space-y-3 text-sm text-ivory/60">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                  Quantum mechanics fundamentals (circuit model)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                  Linear algebra for quantum computing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                  Qiskit & hands-on IBM Quantum access
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                  Core algorithms: Deutsch-Jozsa, Grover's, VQE
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                  Industry landscape & strategic positioning
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-charcoal">
                <p className="text-gold font-semibold">Upon Completion:</p>
                <p className="text-ivory/60 text-sm">Receive your <span className="text-gold">$300 Credit Rebound</span> as cash back OR credit toward specialization.</p>
              </div>
            </div>

            {/* Specialization Phase */}
            <div className="bg-gradient-to-b from-gold/10 to-obsidian p-8 rounded-lg border border-gold/30 hover:border-gold/50 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gold/20 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">🎯</span>
                </div>
                <div>
                  <p className="text-gold text-sm tracking-wider">MONTHS 7-12</p>
                  <h3 className="font-display text-2xl text-ivory">The Specialization</h3>
                </div>
              </div>
              <p className="text-ivory/70 mb-6">
                Choose your domain. Apply quantum computing to real-world problems in your field. 
                Emerge as the rare professional who bridges both worlds.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {specializations.map((spec, i) => (
                  <div key={i} className="bg-obsidian/50 p-3 rounded border border-charcoal text-center">
                    <span className="text-xl">{spec.icon}</span>
                    <p className="text-ivory/70 text-xs mt-1">{spec.title}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gold/20">
                <p className="text-gold font-semibold">Final Capstone:</p>
                <p className="text-ivory/60 text-sm">Complete a real-world project demonstrating Level 2 proficiency.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SPECIALIZATIONS DETAIL ===== */}
      <section id="specializations" className="py-24 bg-charcoal/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.2em] text-sm mb-4">CHOOSE YOUR DOMAIN</p>
            <h2 className="font-display text-4xl md:text-5xl text-ivory mb-6">
              Six Specialization Tracks
            </h2>
            <p className="text-ivory/70 text-lg max-w-2xl mx-auto">
              Each track is engineered for industry-specific quantum application. 
              Select the path that aligns with your professional trajectory.
            </p>
          </div>

          {/* Specialization Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {specializations.map((spec, i) => (
              <button
                key={i}
                onClick={() => setActiveSpecialization(i)}
                className={`px-4 py-2 rounded text-sm transition-all ${
                  activeSpecialization === i
                    ? 'bg-gold text-obsidian font-semibold'
                    : 'bg-charcoal/50 text-ivory/70 hover:text-ivory hover:bg-charcoal'
                }`}
              >
                {spec.icon} {spec.title}
              </button>
            ))}
          </div>

          {/* Active Specialization Detail */}
          <div className="bg-obsidian p-8 md:p-12 rounded-lg border border-charcoal">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-5xl">{specializations[activeSpecialization].icon}</span>
              <div>
                <h3 className="font-display text-3xl text-ivory">{specializations[activeSpecialization].title}</h3>
                <p className="text-ivory/60">{specializations[activeSpecialization].description}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {specializations[activeSpecialization].months.map((month, i) => (
                <div key={i} className="bg-charcoal/30 p-4 rounded border border-charcoal">
                  <p className="text-gold text-xs mb-2">MONTH {i + 7}</p>
                  <p className="text-ivory">{month}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHITE PAPER LEAD MAGNET ===== */}
      <section id="whitepaper" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-gradient-to-r from-gold/10 via-gold/5 to-transparent p-8 md:p-12 rounded-lg border border-gold/30">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-gold tracking-[0.2em] text-sm mb-4">FREE BOARDROOM BRIEFING</p>
                <h2 className="font-display text-3xl md:text-4xl text-ivory mb-6">
                  The 2026 Quantum Patent Gap & Cryptographic Transition
                </h2>
                <p className="text-ivory/70 mb-6">
                  A strategic white paper for legal partners and executive founders navigating the 
                  quantum inflection point. Covers the IP land grab, PQC compliance mandates, and 
                  HNDL liability frameworks.
                </p>
                <ul className="space-y-3 text-sm text-ivory/60 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-gold">✓</span>
                    The narrowing window for quantum IP positioning
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">✓</span>
                    NIST PQC algorithm breakdown & migration timelines
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">✓</span>
                    "Harvest Now, Decrypt Later" fiduciary risk analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">✓</span>
                    2026 global regulatory roadmap
                  </li>
                </ul>
              </div>
              <div className="bg-obsidian p-8 rounded-lg border border-charcoal">
                <h3 className="font-display text-xl text-gold mb-6 text-center">Download the White Paper</h3>
                <form onSubmit={handleDownload} className="space-y-4">
                  <div>
                    <label className="text-sm text-ivory/60 block mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-charcoal/50 border border-charcoal rounded px-4 py-3 text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-ivory/60 block mb-2">Work Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-charcoal/50 border border-charcoal rounded px-4 py-3 text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-ivory/60 block mb-2">Role / Title</label>
                    <select className="w-full bg-charcoal/50 border border-charcoal rounded px-4 py-3 text-ivory focus:border-gold focus:outline-none transition-colors">
                      <option value="">Select your role</option>
                      <option value="executive">C-Suite / Executive</option>
                      <option value="legal">Legal / Compliance</option>
                      <option value="tech">Technology / Engineering</option>
                      <option value="finance">Finance / Risk</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={isDownloading}
                    className="w-full bg-gold text-obsidian font-semibold py-4 rounded hover:bg-gold-light transition-colors disabled:opacity-50"
                  >
                    {isDownloading ? 'Preparing Download...' : 'Get Instant Access'}
                  </button>
                </form>
                <p className="text-ivory/40 text-xs text-center mt-4">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INVESTMENT / PRICING ===== */}
      <section id="investment" className="py-24 bg-charcoal/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold tracking-[0.2em] text-sm mb-4">THE INVESTMENT</p>
          <h2 className="font-display text-4xl md:text-5xl text-ivory mb-6">
            $997 Enrollment
          </h2>
          <p className="text-ivory/70 text-lg mb-12 max-w-2xl mx-auto">
            Investing in foresight should be rewarded. Complete the 6-month Foundation and receive 
            a <span className="text-gold font-semibold">$300 Credit Rebound</span>—returned as cash 
            or applied to your Specialization track.
          </p>

          <div className="bg-obsidian p-8 md:p-12 rounded-lg border border-charcoal max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="font-display text-6xl text-gold">$997</span>
              <div className="text-left">
                <p className="text-ivory font-semibold">Full Program Access</p>
                <p className="text-ivory/60 text-sm">12 Months • 6 Specializations</p>
              </div>
            </div>
            <div className="bg-gold/10 p-6 rounded-lg mb-8">
              <p className="text-gold font-display text-2xl mb-2">$300 Credit Rebound</p>
              <p className="text-ivory/70 text-sm">
                Complete the Foundation phase and choose: cash back OR credit toward advanced specialization modules.
              </p>
            </div>
            <ul className="text-left space-y-3 text-ivory/70 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-gold">✓</span>
                Full 12-month curriculum access
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold">✓</span>
                Socratic AI Tutor (powered by Claude 4.5)
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold">✓</span>
                IBM Quantum & Qiskit integration
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold">✓</span>
                Choice of 6 specialization tracks
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold">✓</span>
                Capstone project certification
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold">✓</span>
                Private community access
              </li>
            </ul>
            <button
              onClick={handleDirectCheckout}
              disabled={isCheckingOut}
              className="block w-full bg-gold text-obsidian font-semibold py-4 rounded text-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? 'Preparing Checkout...' : 'Enroll in the Z2Q Initiative'}
            </button>
            <p className="text-ivory/40 text-xs mt-4">
              Secure checkout via Stripe • 30-day satisfaction guarantee
            </p>
          </div>
        </div>
      </section>

      {/* ===== THE QUANTUM LEVELS ===== */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.2em] text-sm mb-4">THE PROGRESSION</p>
            <h2 className="font-display text-4xl md:text-5xl text-ivory mb-6">
              Three Levels of Quantum Literacy
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-charcoal/30 p-8 rounded-lg border border-charcoal text-center">
              <div className="w-16 h-16 bg-charcoal rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="font-display text-2xl text-ivory/50">0</span>
              </div>
              <h3 className="font-display text-xl text-ivory mb-4">Level Zero</h3>
              <p className="text-ivory/60 text-sm mb-4">Quantum Awareness</p>
              <p className="text-ivory/50 text-sm">
                Understand what quantum computing is and why it matters. Have intelligent conversations 
                about quantum applications.
              </p>
            </div>
            <div className="bg-charcoal/30 p-8 rounded-lg border border-charcoal text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="font-display text-2xl text-gold">1</span>
              </div>
              <h3 className="font-display text-xl text-ivory mb-4">Level One</h3>
              <p className="text-ivory/60 text-sm mb-4">Quantum Application</p>
              <p className="text-ivory/50 text-sm">
                Write basic quantum circuits. Implement algorithms using Qiskit. 
                Run experiments on real quantum hardware.
              </p>
            </div>
            <div className="bg-gradient-to-b from-gold/20 to-transparent p-8 rounded-lg border border-gold/30 text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="font-display text-2xl text-obsidian">2</span>
              </div>
              <h3 className="font-display text-xl text-gold mb-4">Level Two</h3>
              <p className="text-gold/80 text-sm mb-4">Quantum Specialization</p>
              <p className="text-ivory/60 text-sm">
                Apply quantum computing to domain-specific problems. Build real applications. 
                Bridge both worlds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section id="enroll" className="py-24 bg-gradient-to-b from-charcoal/30 to-obsidian">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold tracking-[0.2em] text-sm mb-6">THE QUANTUM AGE IS HERE</p>
          <h2 className="font-display text-4xl md:text-6xl text-ivory mb-8">
            Are You Ready, or Are You Behind?
          </h2>
          <p className="text-ivory/70 text-xl mb-12 max-w-2xl mx-auto">
            The future is non-deterministic. Your strategy shouldn't be.
          </p>
          <a
            href="#"
            className="inline-block px-12 py-5 bg-gold text-obsidian font-semibold text-xl rounded hover:bg-gold-light transition-all hover:shadow-xl hover:shadow-gold/20"
          >
            Join Unconventional Wisdom Today
          </a>
          <p className="text-ivory/40 text-sm mt-6">
            First cohort launching Q1 2026
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 border-t border-charcoal">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <span className="text-obsidian font-display font-bold text-sm">Z</span>
              </div>
              <div>
                <p className="font-display text-gold text-sm">UNCONVENTIONAL WISDOM</p>
                <p className="text-xs text-ivory/50">Powered by Sayada.ai</p>
              </div>
            </div>
            <p className="text-ivory/40 text-sm">
              © 2025 Unconventional Wisdom. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-ivory/50 hover:text-gold text-sm transition-colors">Privacy</a>
              <a href="#" className="text-ivory/50 hover:text-gold text-sm transition-colors">Terms</a>
              <a href="#" className="text-ivory/50 hover:text-gold text-sm transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== ENROLLMENT MODAL ===== */}
      <AnimatePresence>
        {showEnrollModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/95 backdrop-blur-sm p-4"
            onClick={() => !isCheckingOut && setShowEnrollModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-obsidian border border-charcoal rounded-lg shadow-2xl"
            >
              {/* Already Enrolled State */}
              {alreadyEnrolled ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">✓</span>
                  </div>
                  <h3 className="font-display text-2xl text-ivory mb-4">You're Already Enrolled!</h3>
                  <p className="text-ivory/60 mb-8">
                    Welcome back. Your quantum journey awaits in your dashboard.
                  </p>
                  <a
                    href="/dashboard"
                    className="block w-full bg-gold text-obsidian font-semibold py-4 rounded text-lg hover:bg-gold-light transition-colors"
                  >
                    Go to Dashboard
                  </a>
                  <button
                    onClick={() => {
                      setAlreadyEnrolled(false);
                      setShowEnrollModal(false);
                    }}
                    className="mt-4 text-ivory/50 hover:text-ivory text-sm"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Modal Header */}
                  <div className="p-6 border-b border-charcoal">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gold tracking-widest text-xs mb-1">Z2Q INITIATIVE</p>
                        <h3 className="font-display text-xl text-ivory">Secure Enrollment</h3>
                      </div>
                      <button
                        onClick={() => !isCheckingOut && setShowEnrollModal(false)}
                        className="text-ivory/40 hover:text-ivory text-2xl"
                        disabled={isCheckingOut}
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6">
                    {/* Error Message */}
                    {checkoutError && (
                      <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded">
                        <p className="text-red-400 text-sm">{checkoutError}</p>
                      </div>
                    )}

                    {/* Price Display */}
                    <div className="bg-charcoal/30 p-4 rounded mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-ivory font-semibold">Z2Q Full Program</p>
                          <p className="text-ivory/50 text-sm">12 Months • All Specializations</p>
                        </div>
                        <p className="font-display text-3xl text-gold">$997</p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-charcoal flex items-center gap-2">
                        <span className="text-green-500">→</span>
                        <span className="text-sm text-green-400">$300 Credit Rebound on completion</span>
                      </div>
                    </div>

                    {/* Optional: Collect info for Stripe prefill */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="text-sm text-ivory/60 block mb-2">Name (optional)</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your name"
                          className="w-full bg-charcoal/50 border border-charcoal rounded px-4 py-3 text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-ivory/60 block mb-2">Email (optional)</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full bg-charcoal/50 border border-charcoal rounded px-4 py-3 text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none transition-colors"
                        />
                        <p className="text-ivory/40 text-xs mt-1">
                          Pre-fill your checkout for faster enrollment
                        </p>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full bg-gold text-obsidian font-semibold py-4 rounded text-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isCheckingOut ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>Redirecting to Checkout...</span>
                        </>
                      ) : (
                        <>
                          <span>Proceed to Secure Checkout</span>
                          <span>→</span>
                        </>
                      )}
                    </button>

                    {/* Trust Badges */}
                    <div className="mt-4 flex items-center justify-center gap-4 text-ivory/40 text-xs">
                      <span>🔒 SSL Encrypted</span>
                      <span>•</span>
                      <span>💳 Powered by Stripe</span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
