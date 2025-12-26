# Z2Q Promotion Phase: Technical Documentation

## Overview

The Promotion Phase is the critical conversion moment where a student transitions from **Level 0 (Foundation)** to **Level 1 (Specialization)**. This document details the technical implementation.

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MONTH 6: FOUNDATION CAPSTONE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Student completes:                                                         │
│  ├── Lesson 1: The Quantum Ecosystem ✓                                      │
│  ├── Lesson 2: Strategic Career Positioning ✓                               │
│  └── Lesson 3: Foundation Capstone Project                                  │
│                        │                                                    │
│                        ▼                                                    │
│            ┌─────────────────────┐                                          │
│            │ CAPSTONE SUBMISSION │                                          │
│            │   Interface         │                                          │
│            │   - GitHub URL      │                                          │
│            │   - Code paste      │                                          │
│            │   - Description     │                                          │
│            └─────────┬───────────┘                                          │
│                      │                                                      │
│                      ▼                                                      │
│            ┌─────────────────────┐                                          │
│            │ POST /api/capstone/ │                                          │
│            │     evaluate        │                                          │
│            └─────────┬───────────┘                                          │
│                      │                                                      │
│                      ▼                                                      │
│            ┌─────────────────────┐                                          │
│            │  n8n Webhook        │                                          │
│            │  72.62.82.174       │                                          │
│            │  /zero2quantum      │                                          │
│            └─────────┬───────────┘                                          │
│                      │                                                      │
│                      ▼                                                      │
│            ┌─────────────────────┐                                          │
│            │  Claude 4.5         │                                          │
│            │  Evaluates against  │                                          │
│            │  Z2Q Benchmarks     │                                          │
│            └─────────┬───────────┘                                          │
│                      │                                                      │
│           ┌──────────┴──────────┐                                           │
│           │                     │                                           │
│           ▼                     ▼                                           │
│    ┌────────────┐       ┌────────────┐                                      │
│    │ Score < 70 │       │ Score ≥ 70 │                                      │
│    │   FAIL     │       │   PASS     │                                      │
│    └─────┬──────┘       └─────┬──────┘                                      │
│          │                    │                                             │
│          ▼                    ▼                                             │
│    Feedback +           ┌─────────────┐                                     │
│    Retry Option         │ UPDATE DB   │                                     │
│                         │ knowledge_  │                                     │
│                         │ level = '1' │                                     │
│                         └─────┬───────┘                                     │
│                               │                                             │
└───────────────────────────────┼─────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SUPABASE REAL-TIME TRIGGER                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  supabase.channel('profile-changes')                                        │
│    .on('postgres_changes', { table: 'profiles' }, (payload) => {            │
│        if (payload.new.knowledge_level === '1') {                           │
│            setShowLevelUpModal(true);  // <-- INSTANT UI UPDATE             │
│        }                                                                    │
│    })                                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LEVEL UP MODAL                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STEP 1: Congratulations                                                    │
│  ├── Animated badge                                                         │
│  ├── Score display                                                          │
│  └── "Choose Specialization" button                                         │
│                        │                                                    │
│                        ▼                                                    │
│  STEP 2: Select Specialization                                              │
│  ├── ⚖️  Legal & IP Strategy                                                │
│  ├── 📊 Finance & Risk Intelligence                                         │
│  ├── 🛡️  Cybersecurity & PQC                                                │
│  ├── 🧬 Pharmaceuticals & Discovery                                         │
│  ├── 🤖 Machine Learning & AI                                               │
│  └── 🚚 Logistics & Supply Chain                                            │
│                        │                                                    │
│                        ▼                                                    │
│  STEP 3: Credit Rebound Choice                                              │
│  ├── [A] Apply $300 to Selected Module                                      │
│  │       → Premium features, mentor access                                  │
│  └── [B] Request $300 Cash Back                                             │
│          → Direct Stripe refund                                             │
│                        │                                                    │
│                        ▼                                                    │
│  STEP 4: Confirmation                                                       │
│  └── Review selection → POST /api/specialization                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       POST-SELECTION STATE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  profiles.specialization = 'legal' (example)                                │
│  enrollments.credit_rebound_type = 'apply_to_module'                        │
│  credit_transactions → record created                                       │
│                                                                             │
│  UI UPDATES:                                                                │
│  ├── Selected track: "Enrolled" status, full access                         │
│  ├── Other tracks: "Audit Only" status, read-only                           │
│  └── Month 7 lessons: Unlocked for selected track                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### 1. CapstoneSubmission (`/components/CapstoneSubmission.tsx`)

**Purpose:** Collects student's final project submission for AI evaluation.

**Props:**
```typescript
interface CapstoneSubmissionProps {
  studentId: string;
  onSubmissionSuccess: (result: CapstoneResult) => void;
}
```

**Submission Types:**
- `github` — Link to public GitHub repository
- `code` — Direct code paste
- `notebook` — Jupyter notebook JSON

**Evaluation Benchmarks:**
| Criteria | Points |
|----------|--------|
| Quantum Circuit Construction | 25 |
| Measurement & Probability | 25 |
| Code Quality & Documentation | 25 |
| Conceptual Understanding | 25 |
| **Passing Threshold** | **70** |

---

### 2. LevelUpModal (`/components/LevelUpModal.tsx`)

**Purpose:** Congratulates student, collects specialization choice and credit preference.

**Props:**
```typescript
interface LevelUpModalProps {
  isOpen: boolean;
  studentName: string;
  score: number;
  onSpecializationSelect: (track, creditChoice) => void;
  onClose: () => void;
}
```

**Steps:**
1. `congrats` — Animated celebration with score
2. `select` — 6 specialization track cards
3. `credit` — Cash back vs. module credit choice
4. `confirm` — Final review before submission

---

### 3. usePromotionState (`/hooks/usePromotionState.ts`)

**Purpose:** Central state management with Supabase real-time subscription.

**State:**
```typescript
interface PromotionState {
  knowledgeLevel: '0' | '1' | '2';
  specialization: SpecializationTrack | null;
  foundationComplete: boolean;
  capstoneScore: number | null;
  creditReboundEligible: boolean;
  showLevelUpModal: boolean;
  // ...
}
```

**Real-time Subscription:**
```typescript
supabase
  .channel(`profile-${profileId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'profiles',
    filter: `id=eq.${profileId}`,
  }, (payload) => {
    if (payload.new.knowledge_level === '1') {
      setShowLevelUpModal(true);  // <-- INSTANT!
    }
  })
  .subscribe();
```

---

## API Routes

### POST `/api/capstone/evaluate`

**Request:**
```json
{
  "student_id": "uuid",
  "submission_type": "github",
  "github_url": "https://github.com/...",
  "project_description": "My QRNG uses...",
  "benchmarks": "Z2Q FOUNDATION BENCHMARKS..."
}
```

**Response:**
```json
{
  "passed": true,
  "score": 85,
  "feedback": "Excellent work on...",
  "strengths": ["Circuit design", "Documentation"],
  "improvements": ["Error handling"],
  "levelPromoted": true
}
```

---

### POST `/api/specialization`

**Request:**
```json
{
  "student_id": "uuid",
  "specialization": "legal",
  "credit_choice": "apply_to_module"
}
```

**Response:**
```json
{
  "success": true,
  "specialization": "legal",
  "credit_choice": "apply_to_module",
  "message": "Specialization 'legal' selected successfully..."
}
```

---

## Database Changes

### New Table: `capstone_submissions`

```sql
CREATE TABLE capstone_submissions (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id),
  submission_type TEXT,
  github_url TEXT,
  code_content TEXT,
  project_description TEXT,
  score INTEGER,
  passed BOOLEAN,
  feedback TEXT,
  evaluation_data JSONB,
  submitted_at TIMESTAMPTZ
);
```

### Enable Real-time

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
```

---

## Specialization Access Logic

Once a specialization is selected, the `canAccessSpecialization()` function determines UI state:

```typescript
function canAccessSpecialization(
  knowledgeLevel: KnowledgeLevel,
  selectedSpecialization: SpecializationTrack,
  targetTrack: string
): 'enrolled' | 'audit' | 'locked' {
  // Level 0 = Foundation only
  if (knowledgeLevel === '0') return 'locked';
  
  // Matching track = full access
  if (selectedSpecialization === targetTrack) return 'enrolled';
  
  // No selection yet = all available
  if (!selectedSpecialization) return 'enrolled';
  
  // Different track = audit only
  return 'audit';
}
```

**UI Mapping:**
| Status | Appearance |
|--------|------------|
| `enrolled` | Gold border, full lessons, interactive |
| `audit` | Dimmed, read-only, "Audit Only" badge |
| `locked` | Greyed out, 🔒 icon, non-clickable |

---

## Webhook Success → UI Transition (No Refresh)

The key to instant UI updates is the **optimistic + real-time pattern**:

1. **Optimistic:** After `fetch('/api/capstone/evaluate')` returns `levelPromoted: true`, we immediately update local state and show the modal.

2. **Real-time Confirmation:** Supabase broadcasts the database change, confirming the server state matches the UI.

```typescript
// In submitCapstone()
if (result.passed && result.levelPromoted) {
  setState((prev) => ({
    ...prev,
    knowledgeLevel: '1',
    foundationComplete: true,
    showLevelUpModal: true,  // <-- INSTANT
  }));
}
```

This ensures the modal appears **immediately** after AI evaluation, without any page refresh or polling.

---

## File Structure

```
z2q-initiative/
├── app/
│   ├── api/
│   │   ├── capstone/
│   │   │   └── evaluate/route.ts    # Capstone evaluation
│   │   ├── specialization/
│   │   │   └── route.ts             # Specialization selection
│   │   └── tutor/route.ts           # AI tutor (drift prevention)
│   └── dashboard/
│       ├── page.tsx                 # Basic foundation dashboard
│       └── integrated/page.tsx      # Full promotion flow
├── components/
│   ├── CapstoneSubmission.tsx       # Capstone UI
│   ├── LevelUpModal.tsx             # Specialization selection
│   └── index.ts                     # Component exports
├── hooks/
│   └── usePromotionState.ts         # Real-time state management
└── supabase/
    └── migrations/
        └── 001_capstone_submissions.sql
```

---

*The Promotion Phase is where potential converts to proficiency.*
