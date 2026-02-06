'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =============================================================================
// MONTH 1: THE QUANTUM TOOLBELT
// Full Lesson Content with Code Snippets and Quizzes
// Aesthetic: Academic / Prestigious / Playfair Display headers
// =============================================================================

interface LessonContentProps {
  lessonSlug: string;
  onComplete: () => void;
  onQuizPass: (score: number) => void;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// =============================================================================
// LESSON 1: PYTHON FUNDAMENTALS
// =============================================================================

const LESSON_1_CONTENT = {
  slug: 'm1-python-basics',
  title: 'Python Fundamentals',
  subtitle: 'The Language of Quantum Computing',
  duration: '2-3 weeks',
  objectives: [
    'Understand Python syntax and data structures',
    'Write functions and control flow statements',
    'Work with lists, dictionaries, and NumPy arrays',
    'Prepare for Qiskit programming',
  ],
  sections: [
    {
      title: 'Why Python for Quantum?',
      content: `Every major quantum computing framework—Qiskit (IBM), Cirq (Google), PennyLane, and Amazon Braket—is built in Python. This isn't coincidental. Python's readability, extensive scientific libraries, and gentle learning curve make it the lingua franca of quantum development.

If you already know Python, you're golden. If not, this lesson will give you the foundation you need. We're not aiming for software engineering mastery here—we're building the minimum viable toolkit to write quantum circuits.`,
    },
    {
      title: 'The Essentials: Variables & Types',
      content: `In quantum computing, you'll constantly work with:
      
• **Integers** — Qubit indices, shot counts, measurement results
• **Floats** — Rotation angles, probabilities, amplitudes  
• **Complex numbers** — Quantum state amplitudes (this is where Python shines)
• **Lists** — Collections of measurement outcomes
• **Dictionaries** — Mapping quantum states to their probabilities`,
      code: `# Python basics for quantum computing
import numpy as np

# Integers: qubit indices
qubit_0 = 0
qubit_1 = 1
num_shots = 1024  # How many times we run the circuit

# Floats: rotation angles (in radians)
theta = np.pi / 4  # 45 degrees
phi = np.pi / 2    # 90 degrees

# Complex numbers: quantum amplitudes
# A qubit state is |ψ⟩ = α|0⟩ + β|1⟩ where α, β are complex
alpha = 1/np.sqrt(2)           # Real amplitude
beta = 1j/np.sqrt(2)           # Imaginary amplitude (j is Python's 'i')

# Verify: |α|² + |β|² must equal 1 (normalization)
print(f"Normalization check: {abs(alpha)**2 + abs(beta)**2}")  # Output: 1.0

# Lists: measurement outcomes
measurements = ['0', '1', '0', '0', '1', '1', '0', '1']

# Dictionaries: state → probability mapping
results = {
    '00': 0.25,
    '01': 0.25,
    '10': 0.25,
    '11': 0.25
}

# This is an equal superposition of all 2-qubit states`,
    },
    {
      title: 'Functions: Building Reusable Quantum Operations',
      content: `You'll write many functions that create, manipulate, and measure quantum circuits. Here's the pattern you'll use constantly:`,
      code: `def create_bell_state():
    """
    Create a Bell state: maximally entangled 2-qubit state.
    Returns measurement probabilities.
    """
    from qiskit import QuantumCircuit, Aer, execute
    
    # Create a 2-qubit circuit
    qc = QuantumCircuit(2, 2)
    
    # Apply Hadamard to qubit 0 (creates superposition)
    qc.h(0)
    
    # Apply CNOT with qubit 0 as control, qubit 1 as target
    # This entangles the qubits
    qc.cx(0, 1)
    
    # Measure both qubits
    qc.measure([0, 1], [0, 1])
    
    # Run on simulator
    simulator = Aer.get_backend('qasm_simulator')
    result = execute(qc, simulator, shots=1024).result()
    
    return result.get_counts()

# When you run this, you'll get ~50% '00' and ~50% '11'
# Never '01' or '10' — that's entanglement!`,
    },
    {
      title: 'NumPy: The Mathematical Backbone',
      content: `NumPy is essential for quantum computing. Quantum states are vectors. Quantum gates are matrices. NumPy handles both elegantly.`,
      code: `import numpy as np

# A qubit state is a 2D vector
# |0⟩ state
state_0 = np.array([1, 0])

# |1⟩ state  
state_1 = np.array([0, 1])

# |+⟩ state (equal superposition)
state_plus = np.array([1/np.sqrt(2), 1/np.sqrt(2)])

# Quantum gates are 2x2 matrices
# Pauli-X gate (quantum NOT)
X_gate = np.array([
    [0, 1],
    [1, 0]
])

# Hadamard gate (creates superposition)
H_gate = np.array([
    [1/np.sqrt(2),  1/np.sqrt(2)],
    [1/np.sqrt(2), -1/np.sqrt(2)]
])

# Apply gate to state: matrix-vector multiplication
# X|0⟩ = |1⟩
result = X_gate @ state_0
print(f"X|0⟩ = {result}")  # Output: [0 1] which is |1⟩

# H|0⟩ = |+⟩
result = H_gate @ state_0
print(f"H|0⟩ = {result}")  # Output: [0.707 0.707] which is |+⟩

# This is why linear algebra matters!`,
    },
  ],
  quiz: [
    {
      id: 'q1-1',
      question: 'In Python, how do you represent the imaginary unit i (as in complex numbers)?',
      options: ['i', 'j', 'im', 'sqrt(-1)'],
      correctIndex: 1,
      explanation: 'Python uses "j" for the imaginary unit, following electrical engineering convention. So 1j represents √-1.',
    },
    {
      id: 'q1-2',
      question: 'What does the @ operator do with NumPy arrays?',
      options: [
        'Element-wise multiplication',
        'Array concatenation',
        'Matrix multiplication',
        'Power operation',
      ],
      correctIndex: 2,
      explanation: 'The @ operator performs matrix multiplication (dot product). This is essential for applying quantum gates to states.',
    },
    {
      id: 'q1-3',
      question: 'If α = 1/√2 and β = 1/√2 are the amplitudes of a qubit state, what is |α|² + |β|²?',
      options: ['0.5', '1.0', '1.414', '2.0'],
      correctIndex: 1,
      explanation: 'The sum of squared amplitudes must always equal 1 (normalization). (1/√2)² + (1/√2)² = 0.5 + 0.5 = 1.0',
    },
  ],
};

// =============================================================================
// LESSON 2: LINEAR ALGEBRA ESSENTIALS
// =============================================================================

const LESSON_2_CONTENT = {
  slug: 'm1-linear-algebra',
  title: 'Linear Algebra Essentials',
  subtitle: 'The Mathematics of Quantum States',
  duration: '1-2 weeks',
  objectives: [
    'Understand vectors as quantum state representations',
    'Master matrix multiplication for gate operations',
    'Learn inner products for probability calculations',
    'Connect math to quantum intuition',
  ],
  sections: [
    {
      title: 'Vectors: The Language of Qubits',
      content: `Here's the key insight: **a qubit IS a vector**. Not metaphorically—literally. A qubit's state is completely described by a 2-dimensional complex vector.

The two "computational basis states" are:

• |0⟩ = [1, 0]ᵀ — The "zero" state
• |1⟩ = [0, 1]ᵀ — The "one" state

Any qubit state can be written as a linear combination: |ψ⟩ = α|0⟩ + β|1⟩

Where α and β are complex numbers called **amplitudes**.`,
      code: `import numpy as np

# Computational basis states
ket_0 = np.array([[1], [0]])  # Column vector
ket_1 = np.array([[0], [1]])  # Column vector

print("Basis states:")
print(f"|0⟩ = \\n{ket_0}")
print(f"|1⟩ = \\n{ket_1}")

# A general qubit state: |ψ⟩ = α|0⟩ + β|1⟩
# Example: |+⟩ state (equal superposition)
alpha = 1/np.sqrt(2)
beta = 1/np.sqrt(2)

ket_plus = alpha * ket_0 + beta * ket_1
print(f"\\n|+⟩ = \\n{ket_plus}")

# The |-⟩ state has a phase difference
alpha = 1/np.sqrt(2)
beta = -1/np.sqrt(2)  # Note the minus sign!

ket_minus = alpha * ket_0 + beta * ket_1
print(f"\\n|-⟩ = \\n{ket_minus}")`,
    },
    {
      title: 'Matrices: Quantum Gates as Transformations',
      content: `Quantum gates are **unitary matrices**. When you "apply a gate to a qubit," you're performing matrix-vector multiplication.

Key gates you must know:

• **Pauli-X** (quantum NOT): Flips |0⟩ ↔ |1⟩
• **Pauli-Z**: Adds a phase to |1⟩
• **Hadamard (H)**: Creates superposition from basis states`,
      code: `import numpy as np

# Pauli-X gate (quantum NOT)
X = np.array([
    [0, 1],
    [1, 0]
])

# Pauli-Z gate (phase flip)
Z = np.array([
    [1,  0],
    [0, -1]
])

# Hadamard gate (superposition creator)
H = np.array([
    [1,  1],
    [1, -1]
]) / np.sqrt(2)

# Basis states
ket_0 = np.array([[1], [0]])
ket_1 = np.array([[0], [1]])

# Apply X gate: X|0⟩ = |1⟩
result = X @ ket_0
print(f"X|0⟩ = \\n{result}")  # Should be [0, 1]ᵀ

# Apply H gate: H|0⟩ = |+⟩
result = H @ ket_0
print(f"\\nH|0⟩ = \\n{result}")  # Should be [1/√2, 1/√2]ᵀ

# Apply H gate: H|1⟩ = |-⟩  
result = H @ ket_1
print(f"\\nH|1⟩ = \\n{result}")  # Should be [1/√2, -1/√2]ᵀ

# Key insight: H applied twice returns to original state
# HH|0⟩ = |0⟩
result = H @ H @ ket_0
print(f"\\nHH|0⟩ = \\n{result}")  # Back to [1, 0]ᵀ`,
    },
    {
      title: 'Inner Products: Where Probabilities Come From',
      content: `The probability of measuring a qubit in state |ψ⟩ and getting outcome |0⟩ is:

P(0) = |⟨0|ψ⟩|²

This "bra-ket" notation (⟨0| is the "bra," |ψ⟩ is the "ket") is just the inner product (dot product) of the two vectors.`,
      code: `import numpy as np

# State vectors (column vectors)
ket_0 = np.array([[1], [0]])
ket_1 = np.array([[0], [1]])

# Bra vectors (row vectors) - conjugate transpose
bra_0 = ket_0.conj().T  # [[1, 0]]
bra_1 = ket_1.conj().T  # [[0, 1]]

# A superposition state
ket_psi = np.array([[1/np.sqrt(2)], [1/np.sqrt(2)]])

# Inner product: ⟨0|ψ⟩
inner_product_0 = bra_0 @ ket_psi
print(f"⟨0|ψ⟩ = {inner_product_0[0,0]:.4f}")  # 0.7071

# Probability of measuring |0⟩
prob_0 = np.abs(inner_product_0[0,0])**2
print(f"P(0) = |⟨0|ψ⟩|² = {prob_0:.4f}")  # 0.5

# Probability of measuring |1⟩
inner_product_1 = bra_1 @ ket_psi
prob_1 = np.abs(inner_product_1[0,0])**2
print(f"P(1) = |⟨1|ψ⟩|² = {prob_1:.4f}")  # 0.5

# Verify: probabilities sum to 1
print(f"\\nP(0) + P(1) = {prob_0 + prob_1}")  # 1.0

# This is why |α|² + |β|² = 1 is required!`,
    },
  ],
  quiz: [
    {
      id: 'q2-1',
      question: 'What is the result of applying the Hadamard gate to |0⟩?',
      options: ['|0⟩', '|1⟩', '(|0⟩ + |1⟩)/√2', '(|0⟩ - |1⟩)/√2'],
      correctIndex: 2,
      explanation: 'The Hadamard gate transforms |0⟩ into an equal superposition: H|0⟩ = (|0⟩ + |1⟩)/√2, also called the |+⟩ state.',
    },
    {
      id: 'q2-2',
      question: 'If a qubit is in state |ψ⟩ = (|0⟩ + |1⟩)/√2, what is the probability of measuring |0⟩?',
      options: ['0', '0.25', '0.5', '1'],
      correctIndex: 2,
      explanation: 'P(0) = |⟨0|ψ⟩|² = |1/√2|² = 1/2 = 0.5. Equal superposition means 50% chance of each outcome.',
    },
    {
      id: 'q2-3',
      question: 'What property must all quantum gate matrices satisfy?',
      options: [
        'They must be symmetric',
        'They must be unitary (U†U = I)',
        'They must have determinant 1',
        'They must be real-valued',
      ],
      correctIndex: 1,
      explanation: 'Quantum gates must be unitary: U†U = I. This preserves the normalization of quantum states (probabilities sum to 1).',
    },
  ],
};

// =============================================================================
// LESSON 3: PROBABILITY & STATISTICAL THINKING
// =============================================================================

const LESSON_3_CONTENT = {
  slug: 'm1-probability',
  title: 'Probability & Statistical Thinking',
  subtitle: 'The Nature of Quantum Measurement',
  duration: '1 week',
  objectives: [
    'Understand probability distributions in quantum contexts',
    'Calculate expected values from measurement outcomes',
    'Differentiate quantum randomness from classical randomness',
    'Build intuition for shot counts and statistical significance',
  ],
  sections: [
    {
      title: 'Quantum Computing Is Inherently Probabilistic',
      content: `Here's a fundamental truth that separates quantum from classical computing: **quantum measurement is genuinely random**.

When you measure a qubit in superposition, you don't get the superposition—you get a definite outcome (0 or 1) with some probability. This isn't because we lack information; it's the nature of reality at the quantum level.

This means every quantum computation must be run multiple times ("shots") to build up statistics.`,
      code: `# Simulating quantum measurement statistics
import numpy as np
from collections import Counter

def simulate_quantum_coin(num_shots):
    """
    Simulate measuring a qubit in |+⟩ state.
    This is a "quantum coin toss" - truly random.
    """
    # Probabilities for |+⟩ = (|0⟩ + |1⟩)/√2
    prob_0 = 0.5
    prob_1 = 0.5
    
    # Simulate measurements
    outcomes = np.random.choice(['0', '1'], 
                                size=num_shots, 
                                p=[prob_0, prob_1])
    
    # Count results
    counts = Counter(outcomes)
    
    return dict(counts)

# Run with different shot counts
for shots in [10, 100, 1000, 10000]:
    results = simulate_quantum_coin(shots)
    ratio = results.get('0', 0) / shots
    print(f"Shots: {shots:5d} | Results: {results} | Ratio of 0s: {ratio:.3f}")

# Output shows convergence to 0.5 as shots increase
# This is the Law of Large Numbers in action`,
    },
    {
      title: 'Expected Values and Quantum Observables',
      content: `In quantum mechanics, we often want to know the "expected value" of a measurement—the average outcome if we repeated the experiment infinitely many times.

For a qubit state |ψ⟩ = α|0⟩ + β|1⟩, if we assign value 0 to |0⟩ and value 1 to |1⟩:

**E[outcome] = 0·|α|² + 1·|β|² = |β|²**`,
      code: `import numpy as np

def expected_value(alpha, beta):
    """
    Calculate expected measurement outcome for state α|0⟩ + β|1⟩.
    Assigns value 0 to |0⟩, value 1 to |1⟩.
    """
    prob_0 = np.abs(alpha)**2
    prob_1 = np.abs(beta)**2
    
    # Verify normalization
    assert np.isclose(prob_0 + prob_1, 1.0), "State not normalized!"
    
    return 0 * prob_0 + 1 * prob_1

# |0⟩ state: α=1, β=0
print(f"E[|0⟩] = {expected_value(1, 0)}")  # 0.0

# |1⟩ state: α=0, β=1
print(f"E[|1⟩] = {expected_value(0, 1)}")  # 1.0

# |+⟩ state: α=1/√2, β=1/√2
print(f"E[|+⟩] = {expected_value(1/np.sqrt(2), 1/np.sqrt(2))}")  # 0.5

# Biased superposition: α=√0.9, β=√0.1
print(f"E[biased] = {expected_value(np.sqrt(0.9), np.sqrt(0.1))}")  # 0.1`,
    },
    {
      title: 'The Quantum Coin Toss: Your First Quantum Program',
      content: `Let's build a complete "Quantum Random Number Generator" using Qiskit. This is a genuine quantum program that generates truly random bits using superposition.

**Why is this "more random" than classical?**

Classical random number generators are actually **pseudorandom**—they use deterministic algorithms that just look random. Quantum randomness is fundamentally unpredictable, even with perfect knowledge of the system.`,
      code: `# QUANTUM COIN TOSS - Complete Implementation
# Save this as quantum_coin_toss.py

from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt

def quantum_coin_toss(num_flips=1000):
    """
    Generate truly random bits using quantum superposition.
    
    How it works:
    1. Start with qubit in |0⟩
    2. Apply Hadamard gate → creates |+⟩ = (|0⟩ + |1⟩)/√2
    3. Measure → 50% chance of 0, 50% chance of 1
    4. Repeat many times
    
    Returns:
        dict: Counts of '0' and '1' outcomes
    """
    # Create a quantum circuit with 1 qubit and 1 classical bit
    qc = QuantumCircuit(1, 1)
    
    # Step 1: Qubit starts in |0⟩ by default
    
    # Step 2: Apply Hadamard gate to create superposition
    qc.h(0)  # Now in state (|0⟩ + |1⟩)/√2
    
    # Step 3: Measure the qubit
    qc.measure(0, 0)  # Measure qubit 0 into classical bit 0
    
    # Print the circuit
    print("Quantum Circuit:")
    print(qc.draw())
    
    # Step 4: Run on simulator
    simulator = Aer.get_backend('qasm_simulator')
    job = execute(qc, simulator, shots=num_flips)
    result = job.result()
    counts = result.get_counts()
    
    return counts

# Run the quantum coin toss
if __name__ == "__main__":
    results = quantum_coin_toss(1000)
    print(f"\\nResults after 1000 flips:")
    print(f"  Heads (0): {results.get('0', 0)}")
    print(f"  Tails (1): {results.get('1', 0)}")
    
    # Calculate percentages
    total = sum(results.values())
    print(f"\\nPercentages:")
    for outcome, count in results.items():
        print(f"  {outcome}: {100*count/total:.1f}%")
    
    # If running locally with display:
    # plot_histogram(results)
    # plt.show()`,
    },
    {
      title: 'Understanding Shot Counts',
      content: `How many "shots" (repetitions) do you need to trust your quantum results?

**Statistical Rule of Thumb:** For probabilities around 0.5, you need roughly 1/ε² shots to estimate within error ε.

• 100 shots → ~10% error bars
• 1,000 shots → ~3% error bars  
• 10,000 shots → ~1% error bars`,
      code: `import numpy as np

def confidence_interval(count, total, confidence=0.95):
    """
    Calculate confidence interval for a proportion.
    Uses normal approximation (valid for large samples).
    """
    p = count / total
    z = 1.96  # 95% confidence
    
    margin = z * np.sqrt(p * (1-p) / total)
    
    return (p - margin, p + margin)

# Simulate different shot counts
np.random.seed(42)

for shots in [100, 1000, 10000]:
    # Simulate coin tosses with true probability 0.5
    heads = np.random.binomial(shots, 0.5)
    
    ci = confidence_interval(heads, shots)
    
    print(f"Shots: {shots:5d}")
    print(f"  Observed: {heads/shots:.3f}")
    print(f"  95% CI: ({ci[0]:.3f}, {ci[1]:.3f})")
    print(f"  Width: {ci[1]-ci[0]:.3f}")
    print()`,
    },
  ],
  quiz: [
    {
      id: 'q3-1',
      question: 'Why do we need to run quantum circuits multiple times ("shots")?',
      options: [
        'To warm up the quantum computer',
        'Because quantum measurement is probabilistic',
        'To reduce classical computing errors',
        'Because qubits are slow',
      ],
      correctIndex: 1,
      explanation: 'Quantum measurement is inherently probabilistic. We run multiple shots to build up statistics and estimate the underlying probabilities.',
    },
    {
      id: 'q3-2',
      question: 'A quantum coin toss (measuring |+⟩) gives outcome "0" 480 times out of 1000 shots. Is this concerning?',
      options: [
        'Yes, it should be exactly 500',
        'No, this is within expected statistical fluctuation',
        'Yes, the quantum computer is broken',
        'Cannot determine without more information',
      ],
      correctIndex: 1,
      explanation: 'With 1000 shots and true probability 0.5, the standard deviation is √(0.5×0.5×1000) ≈ 15.8. Getting 480 (2σ from mean) is statistically reasonable.',
    },
    {
      id: 'q3-3',
      question: 'What makes quantum randomness different from classical pseudorandomness?',
      options: [
        'Quantum randomness is faster to generate',
        'Quantum randomness is fundamentally unpredictable, not just computationally hard',
        'Classical randomness uses larger numbers',
        'There is no real difference',
      ],
      correctIndex: 1,
      explanation: 'Classical PRNGs are deterministic algorithms. Quantum randomness arises from the fundamental nature of quantum measurement—no amount of information can predict the outcome.',
    },
  ],
};

// =============================================================================
// LESSON CONTENT MAP
// =============================================================================

const LESSON_MAP: Record<string, typeof LESSON_1_CONTENT> = {
  'm1-python-basics': LESSON_1_CONTENT,
  'm1-linear-algebra': LESSON_2_CONTENT,
  'm1-probability': LESSON_3_CONTENT,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function Month1LessonContent({
  lessonSlug,
  onComplete,
  onQuizPass,
}: LessonContentProps) {
  const lesson = LESSON_MAP[lessonSlug];
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [expandedCode, setExpandedCode] = useState<number | null>(null);

  if (!lesson) {
    return (
      <div className="p-8 text-center text-ivory/50">
        Lesson content not found for: {lessonSlug}
      </div>
    );
  }

  const handleQuizAnswer = (questionId: string, optionIndex: number) => {
    if (!quizSubmitted) {
      setQuizAnswers({ ...quizAnswers, [questionId]: optionIndex });
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const correctCount = lesson.quiz.filter(
      (q) => quizAnswers[q.id] === q.correctIndex
    ).length;
    const score = Math.round((correctCount / lesson.quiz.length) * 100);
    
    if (score >= 70) {
      onQuizPass(score);
    }
  };

  const quizScore = quizSubmitted
    ? Math.round(
        (lesson.quiz.filter((q) => quizAnswers[q.id] === q.correctIndex).length /
          lesson.quiz.length) *
          100
      )
    : null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Lesson Header */}
      <div className="mb-12 pb-8 border-b border-charcoal">
        <p className="text-gold tracking-[0.2em] text-xs mb-3">MONTH 1 • LESSON</p>
        <h1 className="font-display text-4xl md:text-5xl text-ivory mb-3">
          {lesson.title}
        </h1>
        <p className="text-xl text-ivory/60 mb-6">{lesson.subtitle}</p>
        
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gold">⏱</span>
            <span className="text-ivory/60">{lesson.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gold">📋</span>
            <span className="text-ivory/60">{lesson.sections.length} sections</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gold">✓</span>
            <span className="text-ivory/60">{lesson.quiz.length} quiz questions</span>
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="mb-12 p-6 bg-gold/5 rounded-lg border border-gold/20">
        <h2 className="font-display text-lg text-gold mb-4">Learning Objectives</h2>
        <ul className="space-y-2">
          {lesson.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-3 text-ivory/80">
              <span className="text-gold mt-1">→</span>
              {obj}
            </li>
          ))}
        </ul>
      </div>

      {/* Section Navigation */}
      {!showQuiz && (
        <div className="mb-8 flex flex-wrap gap-2">
          {lesson.sections.map((section, i) => (
            <button
              key={i}
              onClick={() => setCurrentSection(i)}
              className={`px-4 py-2 rounded text-sm transition-all ${
                currentSection === i
                  ? 'bg-gold text-obsidian font-semibold'
                  : 'bg-charcoal/50 text-ivory/60 hover:text-ivory'
              }`}
            >
              {i + 1}. {section.title.slice(0, 20)}...
            </button>
          ))}
          <button
            onClick={() => setShowQuiz(true)}
            className="px-4 py-2 rounded text-sm bg-charcoal/50 text-gold border border-gold/30 hover:bg-gold/10 transition-all"
          >
            📝 Take Quiz
          </button>
        </div>
      )}

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {!showQuiz ? (
          <motion.div
            key={`section-${currentSection}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Section Title */}
            <h2 className="font-display text-2xl text-ivory">
              {lesson.sections[currentSection].title}
            </h2>

            {/* Section Content */}
            <div className="prose prose-invert max-w-none">
              <p className="text-ivory/80 leading-relaxed whitespace-pre-line">
                {lesson.sections[currentSection].content}
              </p>
            </div>

            {/* Code Block */}
            {lesson.sections[currentSection].code && (
              <div className="bg-obsidian rounded-lg border border-charcoal overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-charcoal/50 border-b border-charcoal">
                  <span className="text-xs text-gold font-mono">Python</span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(lesson.sections[currentSection].code!)
                    }
                    className="text-xs text-ivory/50 hover:text-ivory transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto">
                  <code className="text-sm text-ivory/90 font-mono whitespace-pre">
                    {lesson.sections[currentSection].code}
                  </code>
                </pre>
              </div>
            )}

            {/* Section Navigation */}
            <div className="flex justify-between pt-8 border-t border-charcoal">
              <button
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
                className="px-6 py-2 text-ivory/60 hover:text-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              {currentSection < lesson.sections.length - 1 ? (
                <button
                  onClick={() => setCurrentSection(currentSection + 1)}
                  className="px-6 py-2 bg-gold text-obsidian font-semibold rounded hover:bg-gold-light transition-colors"
                >
                  Next Section →
                </button>
              ) : (
                <button
                  onClick={() => setShowQuiz(true)}
                  className="px-6 py-2 bg-gold text-obsidian font-semibold rounded hover:bg-gold-light transition-colors"
                >
                  Take Quiz →
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          /* Quiz Section */
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-gold">Knowledge Check</h2>
              <button
                onClick={() => {
                  setShowQuiz(false);
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                }}
                className="text-sm text-ivory/50 hover:text-ivory"
              >
                ← Back to Lesson
              </button>
            </div>

            {/* Quiz Questions */}
            <div className="space-y-8">
              {lesson.quiz.map((question, qIndex) => {
                const isCorrect = quizAnswers[question.id] === question.correctIndex;
                const userAnswer = quizAnswers[question.id];

                return (
                  <div
                    key={question.id}
                    className={`p-6 rounded-lg border ${
                      quizSubmitted
                        ? isCorrect
                          ? 'bg-green-900/10 border-green-800/30'
                          : 'bg-red-900/10 border-red-800/30'
                        : 'bg-charcoal/30 border-charcoal'
                    }`}
                  >
                    <p className="text-ivory font-semibold mb-4">
                      {qIndex + 1}. {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => {
                        const isSelected = userAnswer === oIndex;
                        const isCorrectOption = oIndex === question.correctIndex;

                        return (
                          <button
                            key={oIndex}
                            onClick={() => handleQuizAnswer(question.id, oIndex)}
                            disabled={quizSubmitted}
                            className={`w-full text-left p-3 rounded border transition-all ${
                              quizSubmitted
                                ? isCorrectOption
                                  ? 'bg-green-800/30 border-green-700 text-green-300'
                                  : isSelected && !isCorrectOption
                                  ? 'bg-red-800/30 border-red-700 text-red-300'
                                  : 'bg-charcoal/20 border-charcoal/50 text-ivory/50'
                                : isSelected
                                ? 'bg-gold/20 border-gold text-gold'
                                : 'bg-charcoal/20 border-charcoal hover:border-charcoal-light text-ivory/70'
                            }`}
                          >
                            <span className="mr-3">{String.fromCharCode(65 + oIndex)}.</span>
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {quizSubmitted && (
                      <div className="mt-4 p-3 bg-obsidian/50 rounded border border-charcoal">
                        <p className="text-sm text-ivory/70">
                          <span className="text-gold font-semibold">Explanation: </span>
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-charcoal">
              {quizSubmitted ? (
                <>
                  <div>
                    <p className="text-lg">
                      Score:{' '}
                      <span
                        className={
                          quizScore! >= 70 ? 'text-green-400' : 'text-red-400'
                        }
                      >
                        {quizScore}%
                      </span>
                    </p>
                    <p className="text-sm text-ivory/50">
                      {quizScore! >= 70
                        ? 'Passed! You can proceed.'
                        : 'Review the material and try again.'}
                    </p>
                  </div>
                  {quizScore! >= 70 ? (
                    <button
                      onClick={onComplete}
                      className="px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-500 transition-colors"
                    >
                      Complete Lesson ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                      }}
                      className="px-6 py-3 bg-gold text-obsidian font-semibold rounded hover:bg-gold-light transition-colors"
                    >
                      Retry Quiz
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-ivory/50">
                    {Object.keys(quizAnswers).length} of {lesson.quiz.length} answered
                  </p>
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length < lesson.quiz.length}
                    className="px-6 py-3 bg-gold text-obsidian font-semibold rounded hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Quiz
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
