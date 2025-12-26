// =============================================================================
// Z2Q AI TUTOR API ROUTE
// Frontend URL: https://uw.sayada.ai/z2q/api/tutor
// Proxies to n8n: http://72.62.82.174/zero2quantum
// Prevents "Specialization Drift" - Foundation students stay on Foundation topics
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';

// n8n VPS webhook endpoint (configurable via environment)
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://72.62.82.174/zero2quantum';

// =============================================================================
// DRIFT DETECTION: Topics that are OFF-LIMITS for Foundation (Level 0) students
// =============================================================================
const SPECIALIZATION_KEYWORDS = {
  legal: [
    'patent', 'ip law', 'intellectual property', 'quantum patent gap',
    'regulatory', 'compliance', 'hndl', 'harvest now decrypt later',
    'fiduciary', 'liability', 'wassenaar', 'export control'
  ],
  finance: [
    'monte carlo', 'portfolio optimization', 'qubo', 'derivatives pricing',
    'high-frequency trading', 'fraud detection', 'credit scoring', 'qsvm'
  ],
  cybersecurity: [
    'shor\'s algorithm', 'rsa breaking', 'post-quantum cryptography', 'pqc',
    'nist standards', 'qkd', 'quantum key distribution', 'q-day',
    'cryptographically relevant quantum'
  ],
  pharmaceuticals: [
    'molecular hamiltonian', 'drug discovery', 'protein folding', 'vqe docking',
    'genomic', 'clinical trial', 'personalized medicine'
  ],
  machine_learning: [
    'qnn', 'quantum neural network', 'quantum boltzmann', 'qml advanced',
    'quantum nlp', 'edge quantum ai', 'quantum generative'
  ],
  logistics: [
    'tsp quantum', 'qaoa', 'fleet optimization', 'quantum annealing',
    'supply chain quantum', 'bin-packing quantum'
  ],
};

// Foundation topics that ARE appropriate for Level 0 students
const FOUNDATION_TOPICS = [
  'python', 'linear algebra', 'matrix', 'vector', 'probability',
  'qubit', 'superposition', 'entanglement', 'quantum gate', 'hadamard',
  'cnot', 'pauli', 'circuit', 'measurement', 'deutsch', 'grover',
  'qiskit', 'ibm quantum', 'basics', 'fundamentals', 'beginner',
  'what is quantum', 'how does quantum', 'explain quantum'
];

// =============================================================================
// DRIFT DETECTION FUNCTION
// =============================================================================
function detectSpecializationDrift(
  message: string,
  knowledgeLevel: string
): { isDrifting: boolean; topic: string | null } {
  // Level 1 and 2 students can ask anything
  if (knowledgeLevel !== '0') {
    return { isDrifting: false, topic: null };
  }

  const lowerMessage = message.toLowerCase();

  // Check each specialization category
  for (const [category, keywords] of Object.entries(SPECIALIZATION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return { isDrifting: true, topic: category };
      }
    }
  }

  return { isDrifting: false, topic: null };
}

// =============================================================================
// GENERATE REDIRECT RESPONSE
// =============================================================================
function generateRedirectResponse(topic: string, currentLesson: string): string {
  const topicLabels: Record<string, string> = {
    legal: 'Quantum IP & Patent Law',
    finance: 'Quantum Finance & Risk',
    cybersecurity: 'Post-Quantum Cryptography',
    pharmaceuticals: 'Quantum Drug Discovery',
    machine_learning: 'Quantum Machine Learning',
    logistics: 'Quantum Logistics Optimization',
  };

  const currentMonthMatch = currentLesson.match(/month-(\d)/);
  const currentMonth = currentMonthMatch ? parseInt(currentMonthMatch[1]) : 1;

  const redirectMessages = [
    `Great question! That topic falls under **${topicLabels[topic]}**, which is covered in your Specialization phase (Months 7-12). For now, let's focus on building the foundation you'll need to truly understand it.`,
    
    `I appreciate your curiosity about ${topicLabels[topic]}! That's actually Month 7+ material. The good news? The linear algebra and quantum circuit concepts you're learning *right now* are exactly what you'll need to master those advanced topics later.`,
    
    `That's a fantastic topic — and it's waiting for you in the Specialization phase! Right now in Month ${currentMonth}, we're building the mathematical and computational foundation that makes those advanced applications possible.`,
  ];

  // Select a response based on some variety
  const response = redirectMessages[Math.floor(Math.random() * redirectMessages.length)];

  // Add contextual foundation guidance
  const foundationGuidance = getFoundationGuidance(currentMonth);

  return `${response}\n\n${foundationGuidance}\n\nWhat would you like to explore about these foundational concepts?`;
}

// =============================================================================
// FOUNDATION GUIDANCE BY MONTH
// =============================================================================
function getFoundationGuidance(month: number): string {
  const guidance: Record<number, string> = {
    1: `**Month 1 Focus:** Right now, your priority is Python fluency and linear algebra basics. These aren't just prerequisites — they're the *language* of quantum computing. A vector isn't just math; it's how we represent a qubit's state.`,
    
    2: `**Month 2 Focus:** You're learning what qubits actually *are*. Superposition isn't magic — it's a mathematical state we can describe precisely with the linear algebra you just learned. This is where theory meets reality.`,
    
    3: `**Month 3 Focus:** Quantum gates are your building blocks. Every advanced algorithm — from breaking encryption to optimizing portfolios — is built from these same gates you're mastering now.`,
    
    4: `**Month 4 Focus:** Deutsch-Jozsa and Grover's algorithms are your first taste of quantum advantage. Understanding *why* they work is more important than memorizing the circuits.`,
    
    5: `**Month 5 Focus:** Qiskit is your tool for making quantum real. Running circuits on IBM's actual quantum computers transforms abstract concepts into tangible results.`,
    
    6: `**Month 6 Focus:** You're preparing for the specialization phase. The industry landscape, career positioning, and your capstone project will determine which track you pursue next.`,
  };

  return guidance[month] || guidance[1];
}

// =============================================================================
// CONSTRUCT FOUNDATION-AWARE PROMPT
// =============================================================================
function constructFoundationPrompt(
  message: string,
  currentLesson: string,
  knowledgeLevel: string
): string {
  const currentMonthMatch = currentLesson.match(/m(\d)/);
  const currentMonth = currentMonthMatch ? parseInt(currentMonthMatch[1]) : 1;

  const monthContext: Record<number, string> = {
    1: 'Python programming basics, linear algebra (vectors, matrices, matrix multiplication), and probability/statistical thinking',
    2: 'IBM Quantum Learning Platform, understanding qubits, superposition, and entanglement from a computational (not physics) perspective',
    3: 'Quantum gates (X, Y, Z, Hadamard, CNOT), building quantum circuits, and understanding measurement',
    4: 'Deutsch-Jozsa algorithm, Grover\'s search algorithm, and introduction to VQE',
    5: 'Deep Qiskit proficiency, running on real IBM quantum hardware, and building original projects',
    6: 'The quantum ecosystem (IBM, Google, Microsoft), career positioning, and Foundation capstone',
  };

  return `You are the Z2Q Academic Proctor — a Socratic AI tutor for quantum computing education.

CURRENT CONTEXT:
- Student Knowledge Level: ${knowledgeLevel} (Level 0 = Foundation phase)
- Current Month: ${currentMonth}
- Month ${currentMonth} Topics: ${monthContext[currentMonth] || monthContext[1]}
- Current Lesson: ${currentLesson}

YOUR ROLE:
You are teaching FOUNDATION concepts (Months 1-6). Your job is to help this student build the mathematical and computational prerequisites for quantum computing.

TEACHING APPROACH:
1. Use simple language (8th grade reading level)
2. Use metaphors and real-world examples
3. Ask Socratic questions to check understanding
4. Guide students to external resources (IBM Quantum Learning, Qiskit Textbook, Khan Academy) rather than replacing them
5. Be encouraging but maintain academic rigor

CONSTRAINT: This student is in the Foundation phase. If they ask about advanced specialization topics (Quantum IP law, Post-Quantum Cryptography, Drug Discovery, etc.), gently acknowledge their curiosity but redirect them to the foundational concepts they need to master FIRST.

STUDENT'S QUESTION:
${message}

Respond in a helpful, Socratic manner. Keep responses concise (2-3 paragraphs max). End with a guiding question when appropriate.`;
}

// =============================================================================
// API ROUTE HANDLER
// =============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_id, current_lesson, message, knowledge_level } = body;

    // Validate required fields
    if (!student_id || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: student_id, message' },
        { status: 400 }
      );
    }

    const knowledgeLevel = knowledge_level || '0';
    const lesson = current_lesson || 'month-1';

    // Check for specialization drift
    const { isDrifting, topic } = detectSpecializationDrift(message, knowledgeLevel);

    if (isDrifting && topic) {
      // Return redirect response without hitting the AI
      const redirectResponse = generateRedirectResponse(topic, lesson);
      return NextResponse.json({
        reply: redirectResponse,
        suggested_action: 'focus_foundation',
        credit_balance: 0,
        drift_detected: true,
        drift_topic: topic,
      });
    }

    // Construct foundation-aware prompt
    const prompt = constructFoundationPrompt(message, lesson, knowledgeLevel);

    // Call n8n webhook (proxied through Cloudflare → Vercel → Hostinger VPS)
    console.log(`[AI Tutor] Proxying to n8n: ${N8N_WEBHOOK_URL}`);
    
    const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Z2Q-Source': 'uw.sayada.ai',
        'X-Student-Level': knowledgeLevel,
        'X-Request-Timestamp': new Date().toISOString(),
      },
      body: JSON.stringify({
        student_id,
        current_lesson: lesson,
        message: prompt, // Send the enriched prompt
        knowledge_level: knowledgeLevel,
        timestamp: new Date().toISOString(),
        source: 'z2q-frontend',
      }),
      // Timeout after 30 seconds (Claude can take time)
      signal: AbortSignal.timeout(30000),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook error: ${webhookResponse.status}`);
    }

    const data = await webhookResponse.json();

    return NextResponse.json({
      reply: data.reply || data.response || 'I received your question. Let me think about that...',
      suggested_action: data.suggested_action || 'continue',
      credit_balance: data.credit_balance || 0,
      drift_detected: false,
    });

  } catch (error) {
    console.error('[AI Tutor] API error:', error);

    // Handle timeout specifically
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      return NextResponse.json({
        reply: `The AI is taking longer than expected. This might happen with complex questions. Please try a simpler question or try again in a moment.`,
        suggested_action: 'simplify',
        credit_balance: 0,
        error: 'timeout',
      });
    }

    // Return a graceful fallback
    return NextResponse.json({
      reply: `I'm having trouble connecting to the AI system right now. In the meantime, here are some resources for your current studies:

• **IBM Quantum Learning**: https://learning.quantum.ibm.com/
• **Qiskit Textbook**: https://qiskit.org/textbook
• **Khan Academy Linear Algebra**: https://www.khanacademy.org/math/linear-algebra

Try your question again in a moment!`,
      suggested_action: 'retry',
      credit_balance: 0,
      error: true,
    });
  }
}

// =============================================================================
// GET: Health check for the tutor endpoint
// Used to verify n8n connectivity
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    // Ping n8n to verify connectivity (with short timeout)
    const healthCheck = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: 'health-check',
        message: 'ping',
        current_lesson: 'health-check',
        knowledge_level: '0',
      }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => null);

    return NextResponse.json({
      status: healthCheck?.ok ? 'ok' : 'degraded',
      endpoint: 'https://uw.sayada.ai/z2q/api/tutor',
      n8n_url: N8N_WEBHOOK_URL,
      n8n_reachable: healthCheck?.ok || false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      endpoint: 'https://uw.sayada.ai/z2q/api/tutor',
      n8n_url: N8N_WEBHOOK_URL,
      n8n_reachable: false,
      error: 'Health check failed',
      timestamp: new Date().toISOString(),
    });
  }
}
