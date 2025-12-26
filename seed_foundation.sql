-- =============================================================================
-- Z2Q FOUNDATION CURRICULUM SEED DATA
-- Months 1-6: The Gated Prerequisites (Based on YouTube Transcript)
-- This file should be run AFTER schema.sql
-- =============================================================================

-- Clear existing foundation lessons (for re-seeding)
DELETE FROM lessons WHERE is_foundation = TRUE;

-- =============================================================================
-- MONTH 1: FOUNDATION BUILDING (2-4 weeks)
-- Topics: Python, Linear Algebra, Probability
-- =============================================================================

INSERT INTO lessons (slug, title, description, month_number, lesson_order, is_foundation, required_level, estimated_duration_minutes) VALUES

-- Month 1: Python & Math Prerequisites
('m1-python-basics', 
 'Python Fundamentals', 
 'If you already know Python, you''re golden. If not, spend 2-3 weeks learning Python basics: variables, functions, loops, data structures. Code Academy, Free Code Camp, or the official Python tutorial are all great resources.',
 1, 1, TRUE, '0', 180),

('m1-linear-algebra', 
 'Linear Algebra Essentials', 
 'You only need the basics: vectors, matrices, matrix multiplication. Khan Academy has an excellent free linear algebra course. Focus on understanding what these mathematical objects ARE and how they work—not on memorizing formulas.',
 1, 2, TRUE, '0', 180),

('m1-probability', 
 'Probability & Statistical Thinking', 
 'Quantum computing is inherently probabilistic. You need to understand probability distributions, expected values, and statistical thinking. This is the language of quantum measurement.',
 1, 3, TRUE, '0', 120),

-- =============================================================================
-- MONTH 2: QUANTUM CONCEPTS (4-6 weeks)
-- Topics: IBM Quantum, Qubits, Superposition, Entanglement
-- =============================================================================

('m2-ibm-quantum-start', 
 'IBM Quantum Learning Platform', 
 'Start with the IBM Quantum Learning Platform. It''s completely free and specifically designed for beginners. Create your account and complete the first tutorial. Run your first quantum circuit on real quantum hardware.',
 2, 1, TRUE, '0', 60),

('m2-qubits-explained', 
 'Understanding Qubits', 
 'Learn what qubits actually are and how they''re different from classical bits. A qubit isn''t just a 0 or 1—it can exist in superposition of both states simultaneously. We''ll use the linear algebra you just learned to represent this.',
 2, 2, TRUE, '0', 120),

('m2-superposition-entanglement', 
 'Superposition & Entanglement', 
 'How superposition and entanglement work WITHOUT getting lost in quantum mechanics. You don''t need to derive Schrödinger''s equation. You need to understand the computational model, not the physics textbook.',
 2, 3, TRUE, '0', 150),

-- =============================================================================
-- MONTH 3: QUANTUM CIRCUITS (4-6 weeks)
-- Topics: Quantum Gates, Circuit Building, Measurements
-- =============================================================================

('m3-quantum-gates', 
 'Quantum Gates & Operations', 
 'Learn to build quantum circuits visually. The fundamental gates: X (NOT), Y, Z, Hadamard (superposition creator), and CNOT (entanglement creator). These are your building blocks.',
 3, 1, TRUE, '0', 180),

('m3-circuit-building', 
 'Building & Running Circuits', 
 'Run your circuits on real quantum computers in the cloud. IBM Quantum gives free access to actual quantum hardware. You''re not using simulators—you''re running on real qubits.',
 3, 2, TRUE, '0', 120),

('m3-measurements', 
 'Quantum Measurements', 
 'Understanding measurement collapse and probabilistic outcomes. When you measure a qubit, superposition collapses to a definite state. This is why quantum results are inherently probabilistic.',
 3, 3, TRUE, '0', 90),

-- =============================================================================
-- MONTH 4: CORE ALGORITHMS (6-8 weeks)
-- Topics: Deutsch-Jozsa, Grover's, VQE Introduction
-- =============================================================================

('m4-deutsch-jozsa', 
 'Deutsch-Jozsa Algorithm', 
 'Your first quantum algorithm that beats classical. Understand WHY it works, not just copy-paste code. This algorithm determines if a function is constant or balanced in ONE query instead of multiple.',
 4, 1, TRUE, '0', 180),

('m4-grovers-search', 
 'Grover''s Search Algorithm', 
 'Quadratic speedup for unstructured database searching. Classical search: O(N). Grover''s: O(√N). This is the algorithm that makes quantum computing practical for real problems.',
 4, 2, TRUE, '0', 240),

('m4-vqe-introduction', 
 'Introduction to VQE', 
 'Variational Quantum Eigensolver: used for chemistry simulations and the foundation for quantum machine learning. This is a hybrid classical-quantum algorithm you''ll see everywhere.',
 4, 3, TRUE, '0', 150),

-- =============================================================================
-- MONTH 5: QISKIT MASTERY (6-8 weeks)
-- Topics: Deep Qiskit, Real Hardware, Original Projects
-- =============================================================================

('m5-qiskit-deep-dive', 
 'Qiskit Deep Dive', 
 'Go deep with IBM''s quantum framework. Qiskit has the largest community and best documentation. It''s backed by IBM which means long-term stability. Master the QuantumCircuit, transpiler, and execution pipeline.',
 5, 1, TRUE, '0', 240),

('m5-real-quantum-hardware', 
 'Running on Real Quantum Hardware', 
 'IBM Quantum gives free access to real quantum computers. You can run circuits on actual quantum hardware without paying a penny. Learn about noise, error rates, and the reality of NISQ devices.',
 5, 2, TRUE, '0', 180),

('m5-original-projects', 
 'Build Original Projects', 
 'Don''t just complete tutorials. Build something original: a quantum random number generator, a simple quantum game, a quantum algorithm for a real optimization problem. Put these on GitHub.',
 5, 3, TRUE, '0', 300),

-- =============================================================================
-- MONTH 6: INDUSTRY READINESS (4-6 weeks)
-- Topics: Ecosystem, Career, Foundation Capstone
-- =============================================================================

('m6-quantum-ecosystem', 
 'The Quantum Ecosystem', 
 'IBM, Google, Microsoft, Amazon—they''re all building quantum computing platforms and desperately looking for people who understand how to use them. Understand the players and their strategic positions.',
 6, 1, TRUE, '0', 120),

('m6-career-positioning', 
 'Strategic Career Positioning', 
 'The quantum skills gap is massive right now. Most quantum researchers don''t have deep domain expertise. Most domain experts don''t understand quantum. You''ll be one of the rare people who has both.',
 6, 2, TRUE, '0', 90),

('m6-foundation-capstone', 
 'Foundation Capstone Project', 
 'Demonstrate Level 1 proficiency. Build and document a complete quantum project that shows you understand qubits, gates, algorithms, and can execute on real hardware. Completion unlocks your $300 Credit Rebound and Specialization access.',
 6, 3, TRUE, '0', 480);

-- =============================================================================
-- VERIFICATION QUERY
-- =============================================================================

-- Check that we have 18 foundation lessons (3 per month × 6 months)
SELECT 
  month_number,
  COUNT(*) as lesson_count,
  STRING_AGG(title, ', ' ORDER BY lesson_order) as lessons
FROM lessons 
WHERE is_foundation = TRUE
GROUP BY month_number
ORDER BY month_number;
