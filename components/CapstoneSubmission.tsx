'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// =============================================================================
// CAPSTONE SUBMISSION COMPONENT
// Month 6: The Gateway to Specialization
// =============================================================================

interface CapstoneSubmissionProps {
  studentId: string;
  onSubmissionSuccess: (result: CapstoneResult) => void;
}

interface CapstoneResult {
  passed: boolean;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  levelPromoted: boolean;
}

// Foundation Benchmarks for AI Evaluation
const FOUNDATION_BENCHMARKS = `
Z2Q FOUNDATION CAPSTONE BENCHMARKS:

The student must demonstrate proficiency in ALL of the following areas:

1. QUANTUM CIRCUIT CONSTRUCTION (25 points)
   - Properly initializes qubits
   - Uses appropriate gates (H, X, CNOT, etc.)
   - Circuit is logically structured
   - Demonstrates understanding of gate ordering

2. MEASUREMENT & PROBABILITY (25 points)
   - Correctly implements measurement
   - Understands probabilistic outcomes
   - Can explain why results are random
   - Shows awareness of shot count impact

3. CODE QUALITY & DOCUMENTATION (25 points)
   - Clean, readable Python/Qiskit code
   - Appropriate comments explaining logic
   - Follows quantum computing conventions
   - Error handling where appropriate

4. CONCEPTUAL UNDERSTANDING (25 points)
   - Can explain superposition in their own words
   - Understands the difference from classical randomness
   - Aware of hardware vs simulator differences
   - Demonstrates foundational linear algebra connection

PASSING THRESHOLD: 70/100 points
PASSING WITH DISTINCTION: 90/100 points
`;

export default function CapstoneSubmission({
  studentId,
  onSubmissionSuccess,
}: CapstoneSubmissionProps) {
  const [submissionType, setSubmissionType] = useState<'github' | 'code' | 'notebook'>('github');
  const [githubUrl, setGithubUrl] = useState('');
  const [codeContent, setCodeContent] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<CapstoneResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle capstone submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate submission
    if (submissionType === 'github' && !githubUrl.includes('github.com')) {
      setError('Please provide a valid GitHub repository URL');
      setIsSubmitting(false);
      return;
    }

    if ((submissionType === 'code' || submissionType === 'notebook') && codeContent.length < 100) {
      setError('Please provide your complete code (minimum 100 characters)');
      setIsSubmitting(false);
      return;
    }

    if (projectDescription.length < 50) {
      setError('Please describe your project in at least 50 characters');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/capstone/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          submission_type: submissionType,
          github_url: submissionType === 'github' ? githubUrl : null,
          code_content: submissionType !== 'github' ? codeContent : null,
          project_description: projectDescription,
          benchmarks: FOUNDATION_BENCHMARKS,
        }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else {
        setEvaluationResult(result);
        if (result.passed) {
          onSubmissionSuccess(result);
        }
      }
    } catch (err) {
      setError('Failed to submit capstone. Please try again.');
    }

    setIsSubmitting(false);
  };

  // If already evaluated and passed, show success state
  if (evaluationResult?.passed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-b from-green-900/20 to-obsidian p-8 rounded-lg border border-green-700/50"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">🎓</span>
          </div>
          <h2 className="font-display text-3xl text-green-400 mb-2">
            Foundation Complete!
          </h2>
          <p className="text-ivory/70">
            Score: <span className="text-green-400 font-bold">{evaluationResult.score}/100</span>
            {evaluationResult.score >= 90 && (
              <span className="ml-2 px-2 py-0.5 bg-gold/20 text-gold text-xs rounded">
                WITH DISTINCTION
              </span>
            )}
          </p>
        </div>

        <div className="bg-obsidian/50 p-6 rounded border border-charcoal mb-6">
          <h3 className="text-gold font-semibold mb-3">Evaluator Feedback</h3>
          <p className="text-ivory/80 whitespace-pre-wrap">{evaluationResult.feedback}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-900/10 p-4 rounded border border-green-800/30">
            <h4 className="text-green-400 font-semibold mb-2">✓ Strengths</h4>
            <ul className="text-sm text-ivory/70 space-y-1">
              {evaluationResult.strengths.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gold/10 p-4 rounded border border-gold/30">
            <h4 className="text-gold font-semibold mb-2">→ Areas for Growth</h4>
            <ul className="text-sm text-ivory/70 space-y-1">
              {evaluationResult.improvements.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center p-4 bg-gold/10 rounded border border-gold/30">
          <p className="text-gold font-semibold">
            🎉 You've been promoted to Level 1!
          </p>
          <p className="text-ivory/60 text-sm mt-1">
            Your $300 Credit Rebound is now available. Select your Specialization track below.
          </p>
        </div>
      </motion.div>
    );
  }

  // If evaluated but failed, show retry state
  if (evaluationResult && !evaluationResult.passed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-charcoal/30 p-8 rounded-lg border border-charcoal"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-charcoal rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h2 className="font-display text-2xl text-ivory mb-2">
            Not Quite There Yet
          </h2>
          <p className="text-ivory/70">
            Score: <span className="text-gold font-bold">{evaluationResult.score}/100</span>
            <span className="text-ivory/50 ml-2">(70 required to pass)</span>
          </p>
        </div>

        <div className="bg-obsidian/50 p-6 rounded border border-charcoal mb-6">
          <h3 className="text-gold font-semibold mb-3">Feedback</h3>
          <p className="text-ivory/80 whitespace-pre-wrap">{evaluationResult.feedback}</p>
        </div>

        <div className="bg-gold/10 p-4 rounded border border-gold/30 mb-6">
          <h4 className="text-gold font-semibold mb-2">Focus Areas for Resubmission</h4>
          <ul className="text-sm text-ivory/70 space-y-1">
            {evaluationResult.improvements.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => setEvaluationResult(null)}
          className="w-full py-3 bg-gold text-obsidian font-semibold rounded hover:bg-gold-light transition-colors"
        >
          Revise & Resubmit
        </button>
      </motion.div>
    );
  }

  // Submission form
  return (
    <div className="bg-charcoal/30 p-8 rounded-lg border border-charcoal">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🏆</span>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ivory">Foundation Capstone</h2>
            <p className="text-ivory/60 text-sm">
              Submit your Quantum Random Number Generator project
            </p>
          </div>
        </div>

        <div className="bg-obsidian/50 p-4 rounded border border-charcoal">
          <p className="text-ivory/70 text-sm">
            <span className="text-gold font-semibold">Project Requirement:</span> Build a Quantum Random 
            Number Generator using Qiskit that demonstrates your understanding of superposition, 
            measurement, and quantum circuit construction. Run it on IBM Quantum hardware (not just 
            a simulator) and document your results.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Submission Type */}
        <div>
          <label className="text-sm text-ivory/60 block mb-3">Submission Type</label>
          <div className="flex gap-3">
            {[
              { id: 'github', label: 'GitHub Repository', icon: '🔗' },
              { id: 'code', label: 'Paste Code', icon: '📄' },
              { id: 'notebook', label: 'Jupyter Notebook', icon: '📓' },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSubmissionType(type.id as any)}
                className={`flex-1 p-3 rounded border transition-colors ${
                  submissionType === type.id
                    ? 'bg-gold/20 border-gold text-gold'
                    : 'bg-charcoal/50 border-charcoal text-ivory/60 hover:border-charcoal-light'
                }`}
              >
                <span className="text-xl block mb-1">{type.icon}</span>
                <span className="text-xs">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* GitHub URL */}
        {submissionType === 'github' && (
          <div>
            <label className="text-sm text-ivory/60 block mb-2">GitHub Repository URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/yourusername/quantum-rng"
              className="w-full bg-charcoal/50 border border-charcoal rounded px-4 py-3 text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none transition-colors"
              required
            />
            <p className="text-xs text-ivory/40 mt-2">
              Ensure your repository is public and includes a README explaining your project.
            </p>
          </div>
        )}

        {/* Code Content */}
        {(submissionType === 'code' || submissionType === 'notebook') && (
          <div>
            <label className="text-sm text-ivory/60 block mb-2">
              {submissionType === 'notebook' ? 'Jupyter Notebook JSON' : 'Python/Qiskit Code'}
            </label>
            <textarea
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              placeholder={`# Quantum Random Number Generator
from qiskit import QuantumCircuit, execute, IBMQ

# Your code here...`}
              rows={12}
              className="w-full bg-charcoal/50 border border-charcoal rounded px-4 py-3 text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none transition-colors font-mono text-sm"
              required
            />
          </div>
        )}

        {/* Project Description */}
        <div>
          <label className="text-sm text-ivory/60 block mb-2">Project Description</label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Explain your approach: What gates did you use? Why? How does superposition create true randomness? What did you learn from running on real hardware vs the simulator?"
            rows={4}
            className="w-full bg-charcoal/50 border border-charcoal rounded px-4 py-3 text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none transition-colors"
            required
          />
          <p className="text-xs text-ivory/40 mt-2">
            Minimum 50 characters. This demonstrates your conceptual understanding.
          </p>
        </div>

        {/* Evaluation Criteria */}
        <div className="bg-obsidian/50 p-4 rounded border border-charcoal">
          <h3 className="text-gold font-semibold text-sm mb-3">Evaluation Criteria (100 points)</h3>
          <div className="grid grid-cols-2 gap-3 text-xs text-ivory/60">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-charcoal rounded flex items-center justify-center text-gold">25</span>
              <span>Quantum Circuit Construction</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-charcoal rounded flex items-center justify-center text-gold">25</span>
              <span>Measurement & Probability</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-charcoal rounded flex items-center justify-center text-gold">25</span>
              <span>Code Quality & Documentation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-charcoal rounded flex items-center justify-center text-gold">25</span>
              <span>Conceptual Understanding</span>
            </div>
          </div>
          <p className="text-xs text-ivory/40 mt-3">
            Passing: 70/100 • Distinction: 90/100
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gold text-obsidian font-semibold text-lg rounded hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
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
              Evaluating Submission...
            </span>
          ) : (
            'Submit for Evaluation'
          )}
        </button>

        <p className="text-xs text-ivory/40 text-center">
          Your submission will be evaluated by our AI Academic Proctor using the Z2Q Foundation Benchmarks.
        </p>
      </form>
    </div>
  );
}
