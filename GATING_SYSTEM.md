# Z2Q Initiative: Foundation Gating System

## The Sequential Learning Model

The Z2Q program is **strictly gated**. Students cannot skip ahead to advanced specialization topics until they've proven foundational proficiency.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LEVEL 0: FOUNDATION                         │
│                          (Months 1-6)                               │
├─────────────────────────────────────────────────────────────────────┤
│  Month 1: Python, Linear Algebra, Probability                       │
│  Month 2: IBM Quantum, Qubits, Superposition                        │
│  Month 3: Quantum Gates, Circuits, Measurements                     │
│  Month 4: Deutsch-Jozsa, Grover's, VQE                              │
│  Month 5: Qiskit Deep Dive, Real Hardware, Projects                 │
│  Month 6: Ecosystem, Career, CAPSTONE                               │
├─────────────────────────────────────────────────────────────────────┤
│                    ↓ Complete Capstone ↓                            │
│                 $300 Credit Rebound Unlocked                        │
│                  Specialization Unlocked                            │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      LEVEL 1: SPECIALIZATION                        │
│                          (Months 7-12)                              │
├─────────────────────────────────────────────────────────────────────┤
│  Choose ONE track:                                                  │
│  ⚖️  Legal & IP Strategy                                            │
│  📊 Finance & Risk Intelligence                                     │
│  🛡️  Cybersecurity & PQC                                            │
│  🧬 Pharmaceuticals & Discovery                                     │
│  🤖 Machine Learning & AI                                           │
│  🚚 Logistics & Supply Chain                                        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     LEVEL 2: QUANTUM READY                          │
│                    (Specialization Complete)                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Gating Rules

### 1. Month-to-Month Progression (Foundation)

Within the Foundation phase, months unlock sequentially:

- **Month 1**: Always accessible
- **Months 2-6**: Require 66% completion of the previous month

```typescript
// From lib/gating.ts
const required = Math.ceil(previousLessonIds.length * 0.66);
```

### 2. Foundation → Specialization Gate

Specialization content (Months 7-12) is **completely locked** until:

1. `knowledge_level` in `profiles` table equals `'1'`
2. Foundation capstone (`m6-foundation-capstone`) is marked complete
3. At least 15 of 18 foundation lessons are completed

```typescript
// Core gating check
if (!lesson.is_foundation && currentLevel === '0') {
  return {
    canAccess: false,
    reason: 'Specialization content requires Level 1 (Foundation Complete)',
  };
}
```

### 3. Credit Rebound Trigger

The $300 Credit Rebound becomes eligible **only** when:

```sql
-- Triggered by check_level_promotion() function
IF current_level = '0' AND completed_foundation >= 15 THEN
  UPDATE profiles SET knowledge_level = '1' WHERE id = NEW.profile_id;
  UPDATE enrollments SET credit_rebound_eligible = TRUE WHERE profile_id = NEW.profile_id;
END IF;
```

---

## AI Tutor: Specialization Drift Prevention

The Socratic AI Tutor actively prevents students from getting ahead of themselves.

### How It Works

When a Level 0 student asks about advanced topics, the tutor:

1. **Detects the drift** by checking for specialization keywords
2. **Acknowledges curiosity** (positive reinforcement)
3. **Redirects to Foundation** with context about why it matters
4. **Provides Foundation guidance** for their current month

### Specialization Keywords (Blocked for Level 0)

```typescript
const SPECIALIZATION_KEYWORDS = {
  legal: ['patent', 'ip law', 'quantum patent gap', 'hndl', 'fiduciary'],
  finance: ['monte carlo', 'portfolio optimization', 'qubo', 'qsvm'],
  cybersecurity: ['shor\'s algorithm', 'pqc', 'q-day', 'post-quantum'],
  pharmaceuticals: ['molecular hamiltonian', 'drug discovery', 'vqe docking'],
  machine_learning: ['qnn', 'quantum neural network', 'quantum boltzmann'],
  logistics: ['tsp quantum', 'qaoa', 'quantum annealing'],
};
```

### Example Redirect Response

**Student (Month 2, Level 0):** "What is the Quantum Patent Gap?"

**AI Tutor Response:**
> Great question! That topic falls under **Quantum IP & Patent Law**, which is covered in your Specialization phase (Months 7-12). For now, let's focus on building the foundation you'll need to truly understand it.
>
> **Month 2 Focus:** You're learning what qubits actually *are*. Superposition isn't magic — it's a mathematical state we can describe precisely with the linear algebra you just learned. This is where theory meets reality.
>
> What would you like to explore about these foundational concepts?

---

## File Structure

```
z2q-initiative/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/
│   │   └── page.tsx          # Foundation Dashboard (Months 1-6)
│   └── api/
│       └── tutor/
│           └── route.ts      # AI Tutor with drift prevention
├── lib/
│   ├── supabase.ts           # Database client
│   └── gating.ts             # Gating logic utilities
├── supabase/
│   ├── schema.sql            # Database schema
│   └── seed_foundation.sql   # Foundation curriculum data
└── GATING_SYSTEM.md          # This file
```

---

## Database Tables

### `profiles.knowledge_level`

| Value | Meaning | Access |
|-------|---------|--------|
| `'0'` | Foundation Phase | Months 1-6 only |
| `'1'` | Application Phase | Months 1-12 |
| `'2'` | Specialization Complete | Full access |

### `lessons.is_foundation`

| Value | Meaning |
|-------|---------|
| `TRUE` | Foundation lesson (Months 1-6) |
| `FALSE` | Specialization lesson (Months 7-12) |

### `enrollments.credit_rebound_eligible`

| Value | Meaning |
|-------|---------|
| `FALSE` | Still in Foundation |
| `TRUE` | Foundation complete, $300 available |

---

## n8n Webhook Behavior

The webhook at `http://72.62.82.174/zero2quantum` receives:

```json
{
  "student_id": "uuid",
  "current_lesson": "m2-qubits-explained",
  "message": "The enriched prompt with Foundation context",
  "knowledge_level": "0",
  "timestamp": "2025-12-24T..."
}
```

The n8n workflow should:

1. Fetch `knowledge_level` from Supabase `profiles` table
2. If Level 0 + specialization topic detected → Use redirect prompt
3. If Level 0 + foundation topic → Use Socratic teaching prompt
4. If Level 1/2 → Full access to all topics

---

## Testing the Gating System

### Test Case 1: Month Progression

1. Create a new user (Level 0)
2. Attempt to access Month 3 lesson → Should be blocked
3. Complete 2/3 Month 1 lessons
4. Complete 2/3 Month 2 lessons
5. Attempt to access Month 3 lesson → Should be allowed

### Test Case 2: Specialization Lock

1. Create a new user (Level 0)
2. Navigate to Dashboard
3. Verify Specialization tracks show 🔒
4. Complete all Foundation lessons
5. Complete Foundation Capstone
6. Verify Level promotes to 1
7. Verify Specialization tracks are now accessible

### Test Case 3: AI Tutor Drift Prevention

1. Login as Level 0 student
2. Open AI Tutor in Month 2
3. Ask: "What is post-quantum cryptography?"
4. Verify redirect response (not a direct answer)
5. Ask: "What is a Hadamard gate?"
6. Verify direct teaching response (foundation topic)

---

## The Philosophy

> "The people who figure this out now, while we're still in the early days, are going to have an absolutely massive advantage over everyone else."

But that advantage comes from **solid foundations**, not from skipping ahead. The gating system ensures every Z2Q graduate has earned their Level 2 status through genuine mastery.

---

*Unconventional Wisdom | Powered by Sayada.ai*
