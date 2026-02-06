'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =============================================================================
// LEVEL UP MODAL
// The "Congratulatory Fellowship" - Triggers when knowledge_level reaches '1'
// =============================================================================

interface LevelUpModalProps {
  isOpen: boolean;
  studentName: string;
  score: number;
  onSpecializationSelect: (
    specialization: SpecializationTrack,
    creditChoice: CreditChoice
  ) => void;
  onClose: () => void;
}

type SpecializationTrack =
  | 'legal'
  | 'finance'
  | 'cybersecurity'
  | 'pharmaceuticals'
  | 'machine_learning'
  | 'logistics';

type CreditChoice = 'apply_to_module' | 'cash_back';

interface Specialization {
  id: SpecializationTrack;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  monthTopics: string[];
  careerPaths: string[];
}

const SPECIALIZATIONS: Specialization[] = [
  {
    id: 'legal',
    title: 'Legal & IP Strategy',
    subtitle: 'Quantum Patent Gap & Regulatory Compliance',
    icon: '⚖️',
    description:
      'Navigate the winner-takes-all IP landscape and prepare organizations for post-quantum compliance mandates.',
    monthTopics: [
      'Quantum IP & Patent Law',
      'Cryptographic Transition Liability',
      'Regulatory Frameworks',
      'HNDL Ethical Compliance',
      'International Trade Controls',
      'Capstone: Q-Ready Legal Strategy',
    ],
    careerPaths: ['Quantum IP Attorney', 'Compliance Officer', 'Policy Advisor'],
  },
  {
    id: 'finance',
    title: 'Finance & Risk Intelligence',
    subtitle: 'Quantum Monte Carlo & Portfolio Optimization',
    icon: '📊',
    description:
      'Apply quantum algorithms to derivatives pricing, fraud detection, and portfolio management.',
    monthTopics: [
      'Quantum Monte Carlo',
      'High-Frequency Trading',
      'Portfolio Optimization (QUBO)',
      'Fraud Detection (QSVM)',
      'Quantum Credit Scoring',
      'Capstone: Q-Resilient Portfolio',
    ],
    careerPaths: ['Quant Analyst', 'Risk Manager', 'Algorithmic Trader'],
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & PQC',
    subtitle: "Shor's Threat & Post-Quantum Cryptography",
    icon: '🛡️',
    description:
      "Defend against quantum attacks by implementing NIST's post-quantum cryptographic standards.",
    monthTopics: [
      "Shor's Threat Analysis",
      'NIST PQC Standards',
      'Quantum Key Distribution',
      'Legacy Migration Strategies',
      'Hardware Security Modules',
      'Capstone: Q-Vulnerability Audit',
    ],
    careerPaths: ['Security Architect', 'Cryptography Engineer', 'CISO'],
  },
  {
    id: 'pharmaceuticals',
    title: 'Pharmaceuticals & Discovery',
    subtitle: 'Molecular Simulation & Drug Discovery',
    icon: '🧬',
    description:
      'Simulate molecular interactions and accelerate drug discovery pipelines with quantum precision.',
    monthTopics: [
      'Molecular Hamiltonian Simulation',
      'Quantum-Enhanced Docking',
      'Protein Folding Logic',
      'Personalized Medicine',
      'Clinical Trial Optimization',
      'Capstone: Q-Assisted Discovery',
    ],
    careerPaths: ['Computational Chemist', 'Drug Discovery Scientist', 'Biotech Lead'],
  },
  {
    id: 'machine_learning',
    title: 'Machine Learning & AI',
    subtitle: 'Quantum Neural Networks & Hybrid AI',
    icon: '🤖',
    description:
      'Build quantum-enhanced AI models that outperform classical approaches in specific domains.',
    monthTopics: [
      'QML Foundations',
      'Quantum Neural Networks',
      'Quantum Generative AI',
      'NLP & Quantum Linguistics',
      'Edge Quantum AI',
      'Capstone: Hybrid QNN Training',
    ],
    careerPaths: ['QML Researcher', 'AI Engineer', 'Quantum Software Developer'],
  },
  {
    id: 'logistics',
    title: 'Logistics & Supply Chain',
    subtitle: 'TSP, QAOA & Global Optimization',
    icon: '🚚',
    description:
      'Solve NP-hard logistics problems with quantum optimization algorithms.',
    monthTopics: [
      'Traveling Salesperson (TSP)',
      'Fleet & Route Optimization',
      'Quantum Inventory Management',
      'Warehouse Automation',
      'Predictive Logistics',
      'Capstone: Multi-Modal Network',
    ],
    careerPaths: ['Operations Researcher', 'Supply Chain Strategist', 'Logistics Director'],
  },
];

export default function LevelUpModal({
  isOpen,
  studentName,
  score,
  onSpecializationSelect,
  onClose,
}: LevelUpModalProps) {
  const [step, setStep] = useState<'congrats' | 'select' | 'credit' | 'confirm'>('congrats');
  const [selectedTrack, setSelectedTrack] = useState<SpecializationTrack | null>(null);
  const [creditChoice, setCreditChoice] = useState<CreditChoice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedSpecialization = SPECIALIZATIONS.find((s) => s.id === selectedTrack);

  const handleFinalConfirm = async () => {
    if (!selectedTrack || !creditChoice) return;
    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onSpecializationSelect(selectedTrack, creditChoice);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/95 backdrop-blur-md overflow-y-auto py-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-full max-w-4xl mx-4 bg-obsidian border border-gold/30 rounded-lg shadow-2xl shadow-gold/10"
        >
          {/* ===== STEP 1: CONGRATULATIONS ===== */}
          {step === 'congrats' && (
            <div className="p-8 md:p-12 text-center">
              {/* Animated Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-32 h-32 mx-auto mb-8 relative"
              >
                <div className="absolute inset-0 bg-gold/20 rounded-full animate-pulse" />
                <div className="absolute inset-2 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center">
                  <span className="text-6xl">🎓</span>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-2 -right-2 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center border-4 border-obsidian"
                >
                  <span className="text-white text-lg">✓</span>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-gold tracking-[0.3em] text-sm mb-4">
                  THE Z2Q FELLOWSHIP
                </p>
                <h1 className="font-display text-4xl md:text-5xl text-ivory mb-4">
                  Congratulations, {studentName || 'Scholar'}!
                </h1>
                <p className="text-2xl text-gold mb-6">
                  You've Achieved <span className="font-display">Level 1</span>
                </p>
                <p className="text-ivory/70 max-w-xl mx-auto mb-8">
                  You have successfully completed the Z2Q Foundation with a score of{' '}
                  <span className="text-gold font-bold">{score}/100</span>. You now possess
                  the quantum literacy to apply these skills to real-world domains.
                </p>

                {/* Stats */}
                <div className="flex justify-center gap-8 mb-8">
                  <div className="text-center">
                    <p className="font-display text-3xl text-gold">6</p>
                    <p className="text-xs text-ivory/50">Months Complete</p>
                  </div>
                  <div className="text-center border-x border-charcoal px-8">
                    <p className="font-display text-3xl text-gold">18</p>
                    <p className="text-xs text-ivory/50">Lessons Mastered</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-3xl text-gold">$300</p>
                    <p className="text-xs text-ivory/50">Credit Available</p>
                  </div>
                </div>

                <button
                  onClick={() => setStep('select')}
                  className="px-8 py-4 bg-gold text-obsidian font-semibold text-lg rounded hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/20"
                >
                  Choose Your Specialization →
                </button>
              </motion.div>
            </div>
          )}

          {/* ===== STEP 2: SELECT SPECIALIZATION ===== */}
          {step === 'select' && (
            <div className="p-6 md:p-8">
              <div className="text-center mb-8">
                <p className="text-gold tracking-widest text-xs mb-2">STEP 1 OF 2</p>
                <h2 className="font-display text-3xl text-ivory mb-2">
                  Select Your Specialization
                </h2>
                <p className="text-ivory/60">
                  Choose the domain where you'll apply quantum computing for Months 7-12
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {SPECIALIZATIONS.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedTrack(spec.id)}
                    className={`text-left p-5 rounded-lg border transition-all ${
                      selectedTrack === spec.id
                        ? 'bg-gold/20 border-gold shadow-lg shadow-gold/10'
                        : 'bg-charcoal/30 border-charcoal hover:border-charcoal-light'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{spec.icon}</span>
                      <div>
                        <h3
                          className={`font-semibold ${
                            selectedTrack === spec.id ? 'text-gold' : 'text-ivory'
                          }`}
                        >
                          {spec.title}
                        </h3>
                        <p className="text-xs text-ivory/50">{spec.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-xs text-ivory/60 line-clamp-2">{spec.description}</p>
                    {selectedTrack === spec.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-3 border-t border-gold/30"
                      >
                        <p className="text-xs text-gold mb-2">Career Paths:</p>
                        <div className="flex flex-wrap gap-1">
                          {spec.careerPaths.map((path) => (
                            <span
                              key={path}
                              className="text-[10px] px-2 py-0.5 bg-gold/10 text-gold rounded"
                            >
                              {path}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('congrats')}
                  className="px-6 py-3 text-ivory/60 hover:text-ivory transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep('credit')}
                  disabled={!selectedTrack}
                  className="px-8 py-3 bg-gold text-obsidian font-semibold rounded hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Credit Rebound →
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 3: CREDIT REBOUND CHOICE ===== */}
          {step === 'credit' && selectedSpecialization && (
            <div className="p-6 md:p-8">
              <div className="text-center mb-8">
                <p className="text-gold tracking-widest text-xs mb-2">STEP 2 OF 2</p>
                <h2 className="font-display text-3xl text-ivory mb-2">
                  Your $300 Credit Rebound
                </h2>
                <p className="text-ivory/60">
                  You've earned this. Choose how to receive it.
                </p>
              </div>

              {/* Selected Track Summary */}
              <div className="bg-charcoal/30 p-4 rounded-lg border border-charcoal mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedSpecialization.icon}</span>
                  <div>
                    <p className="text-ivory/50 text-xs">Selected Specialization</p>
                    <p className="text-gold font-semibold">{selectedSpecialization.title}</p>
                  </div>
                </div>
              </div>

              {/* Credit Options */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Option A: Apply to Module */}
                <button
                  onClick={() => setCreditChoice('apply_to_module')}
                  className={`text-left p-6 rounded-lg border transition-all ${
                    creditChoice === 'apply_to_module'
                      ? 'bg-gold/20 border-gold shadow-lg shadow-gold/10'
                      : 'bg-charcoal/30 border-charcoal hover:border-charcoal-light'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        creditChoice === 'apply_to_module'
                          ? 'bg-gold text-obsidian'
                          : 'bg-charcoal text-ivory'
                      }`}
                    >
                      <span className="text-xl">📚</span>
                    </div>
                    <div>
                      <h3
                        className={`font-semibold ${
                          creditChoice === 'apply_to_module' ? 'text-gold' : 'text-ivory'
                        }`}
                      >
                        Apply to Specialization
                      </h3>
                      <p className="text-xs text-ivory/50">Invest in your future</p>
                    </div>
                  </div>
                  <p className="text-sm text-ivory/70 mb-4">
                    Apply your $300 credit toward premium features in the{' '}
                    <span className="text-gold">{selectedSpecialization.title}</span> track:
                  </p>
                  <ul className="text-xs text-ivory/60 space-y-1">
                    <li>• 1-on-1 mentor sessions</li>
                    <li>• Extended IBM Quantum credits</li>
                    <li>• Priority capstone review</li>
                    <li>• Certificate of Distinction</li>
                  </ul>
                  {creditChoice === 'apply_to_module' && (
                    <div className="mt-4 p-2 bg-gold/10 rounded text-center">
                      <span className="text-gold text-sm font-semibold">✓ Selected</span>
                    </div>
                  )}
                </button>

                {/* Option B: Cash Back */}
                <button
                  onClick={() => setCreditChoice('cash_back')}
                  className={`text-left p-6 rounded-lg border transition-all ${
                    creditChoice === 'cash_back'
                      ? 'bg-green-900/20 border-green-700/50 shadow-lg shadow-green-900/10'
                      : 'bg-charcoal/30 border-charcoal hover:border-charcoal-light'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        creditChoice === 'cash_back'
                          ? 'bg-green-600 text-white'
                          : 'bg-charcoal text-ivory'
                      }`}
                    >
                      <span className="text-xl">💵</span>
                    </div>
                    <div>
                      <h3
                        className={`font-semibold ${
                          creditChoice === 'cash_back' ? 'text-green-400' : 'text-ivory'
                        }`}
                      >
                        Request Cash Back
                      </h3>
                      <p className="text-xs text-ivory/50">Direct to your account</p>
                    </div>
                  </div>
                  <p className="text-sm text-ivory/70 mb-4">
                    Receive your $300 as a direct refund via your original payment method.
                  </p>
                  <ul className="text-xs text-ivory/60 space-y-1">
                    <li>• Processed within 5-7 business days</li>
                    <li>• Via Stripe to original payment method</li>
                    <li>• Full specialization access included</li>
                    <li>• No premium features</li>
                  </ul>
                  {creditChoice === 'cash_back' && (
                    <div className="mt-4 p-2 bg-green-800/30 rounded text-center">
                      <span className="text-green-400 text-sm font-semibold">✓ Selected</span>
                    </div>
                  )}
                </button>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('select')}
                  className="px-6 py-3 text-ivory/60 hover:text-ivory transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  disabled={!creditChoice}
                  className="px-8 py-3 bg-gold text-obsidian font-semibold rounded hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review & Confirm →
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 4: CONFIRMATION ===== */}
          {step === 'confirm' && selectedSpecialization && creditChoice && (
            <div className="p-6 md:p-8">
              <div className="text-center mb-8">
                <p className="text-gold tracking-widest text-xs mb-2">CONFIRMATION</p>
                <h2 className="font-display text-3xl text-ivory mb-2">
                  Review Your Selection
                </h2>
              </div>

              <div className="bg-charcoal/30 p-6 rounded-lg border border-charcoal mb-8">
                {/* Specialization */}
                <div className="flex items-center gap-4 pb-4 mb-4 border-b border-charcoal">
                  <span className="text-4xl">{selectedSpecialization.icon}</span>
                  <div>
                    <p className="text-ivory/50 text-xs">Specialization Track</p>
                    <p className="text-gold font-display text-xl">
                      {selectedSpecialization.title}
                    </p>
                  </div>
                </div>

                {/* Month Topics */}
                <div className="mb-4">
                  <p className="text-ivory/50 text-xs mb-2">Months 7-12 Curriculum:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedSpecialization.monthTopics.map((topic, i) => (
                      <div
                        key={topic}
                        className="flex items-center gap-2 text-xs text-ivory/70"
                      >
                        <span className="text-gold">M{i + 7}</span>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Credit Choice */}
                <div className="pt-4 border-t border-charcoal">
                  <p className="text-ivory/50 text-xs mb-2">Credit Rebound Choice:</p>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded ${
                      creditChoice === 'apply_to_module'
                        ? 'bg-gold/20 text-gold'
                        : 'bg-green-800/30 text-green-400'
                    }`}
                  >
                    <span className="text-lg">
                      {creditChoice === 'apply_to_module' ? '📚' : '💵'}
                    </span>
                    <span className="font-semibold">
                      {creditChoice === 'apply_to_module'
                        ? `$300 Applied to ${selectedSpecialization.title}`
                        : '$300 Cash Back Requested'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-gold/10 p-4 rounded border border-gold/30 mb-8">
                <p className="text-gold text-sm">
                  <span className="font-semibold">Note:</span> Once confirmed, your specialization
                  selection is locked for this cohort. Other tracks will be available in "Audit
                  Only" mode.
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('credit')}
                  className="px-6 py-3 text-ivory/60 hover:text-ivory transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleFinalConfirm}
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gold text-obsidian font-semibold text-lg rounded hover:bg-gold-light transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
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
                      Confirming...
                    </span>
                  ) : (
                    'Confirm & Begin Specialization'
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
