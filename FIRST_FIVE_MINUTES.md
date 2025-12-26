# Z2Q First Five Minutes: Onboarding System

## Overview

The "First Five Minutes" system defines the initial experience for new Level 0 students. This critical touchpoint sets expectations, introduces key features, and creates the premium "Quiet Luxury" impression that differentiates Z2Q from generic bootcamps.

---

## Components

### 1. Welcome Orientation (`WelcomeOrientation.tsx`)

A full-screen overlay that appears on first login. Three-step "Mission Briefing" format.

**Step 1: Your Mission**
- Confirms Level 0 status
- Shows 12-month timeline (Foundation → Specialization)
- Displays key stats: 18 lessons, 6 tracks, $300 reward

**Step 2: Your AI Tutor**
- Introduces the Socratic AI (Claude via n8n webhook)
- Shows sample interaction
- Explains how to ask questions

**Step 3: Your Reward**
- Highlights the $300 Credit Rebound
- Explains two options: Module Credit vs. Cash Back
- Sets completion expectation

### 2. Month 1 Lesson Content (`Month1LessonContent.tsx`)

Full academic content for the "Quantum Toolbelt" month with:

**Lesson 1: Python Fundamentals**
- Why Python for quantum (lingua franca)
- Variables & types for quantum (complex numbers, arrays)
- NumPy for vectors and matrices
- Code: Bell state creation

**Lesson 2: Linear Algebra Essentials**
- Vectors as qubit states
- Matrices as quantum gates
- Inner products for probabilities
- Code: Gate application examples

**Lesson 3: Probability & Statistical Thinking**
- Quantum measurement is probabilistic
- Expected values and observables
- The Quantum Coin Toss (complete Qiskit QRNG)
- Shot counts and statistical significance

Each lesson includes:
- Learning objectives
- Multiple content sections with code
- 3-question quiz (70% to pass)
- Sequential unlocking

### 3. Welcome Email (`WelcomeEmail.tsx`)

Branded HTML email template with:

- UW logo header (Z badge + wordmark)
- Level 0 status confirmation
- 12-month roadmap overview
- $300 Credit Rebound highlight
- First week action items
- AI Tutor introduction
- Footer with links

Generates both raw HTML and React component versions.

---

## Orientation Tracking

**How does the UI know if orientation has been seen?**

### Database (Primary Source of Truth)

```sql
-- Column in enrollments table
orientation_completed_at TIMESTAMPTZ

-- Check function
CREATE FUNCTION needs_orientation(p_profile_id UUID)
RETURNS BOOLEAN
```

### API Endpoints

```
GET /api/orientation?profile_id={uuid}
→ { needs_orientation: boolean, orientation_completed_at: timestamp|null }

POST /api/orientation
Body: { profile_id: uuid }
→ { success: true, orientation_completed_at: timestamp }
```

### Client Flow

```typescript
// On dashboard mount:
useEffect(() => {
  // Quick check: localStorage
  if (localStorage.getItem('z2q_orientation_seen') === 'true') {
    setShowOrientation(false);
    return;
  }
  
  // Database check
  const response = await fetch(`/api/orientation?profile_id=${profileId}`);
  const { needs_orientation } = await response.json();
  
  if (!needs_orientation) {
    localStorage.setItem('z2q_orientation_seen', 'true');
    setShowOrientation(false);
  }
}, []);

// On orientation complete:
const handleComplete = async () => {
  await fetch('/api/orientation', {
    method: 'POST',
    body: JSON.stringify({ profile_id: profileId })
  });
  localStorage.setItem('z2q_orientation_seen', 'true');
  setShowOrientation(false);
};
```

### Why Both?

| Storage | Purpose |
|---------|---------|
| **Database** | Cross-device persistence, source of truth |
| **localStorage** | Fast check, reduces API calls |

---

## File Structure

```
z2q-initiative/
├── app/
│   ├── api/
│   │   └── orientation/
│   │       └── route.ts         # GET/POST orientation status
│   └── onboarding/
│       └── page.tsx             # First Five Minutes page
├── components/
│   ├── WelcomeOrientation.tsx   # 3-step overlay
│   ├── Month1LessonContent.tsx  # Full lesson content
│   └── WelcomeEmail.tsx         # HTML email template
└── supabase/
    └── migrations/
        └── 002_orientation_tracking.sql
```

---

## Design Specifications

### Palette (Quiet Luxury)

| Element | Color |
|---------|-------|
| Background | `#1A1A1B` (Obsidian) |
| Cards | `#2D2D2E` (Charcoal) |
| Accent | `#D4AF37` (Metallic Gold) |
| Text | `#F5F5F0` (Ivory) |
| Success | `#4A7C59` (Muted Green) |

### Typography

| Element | Font |
|---------|------|
| Headlines | Playfair Display (serif) |
| Body | DM Sans (sans-serif) |
| Code | JetBrains Mono |

### Animation

- Framer Motion for all transitions
- 0.4s duration for step changes
- Spring physics for badge animations
- Staggered delays for list items

---

## Month 1 Quiz Questions

### Lesson 1: Python Fundamentals

1. **In Python, how do you represent the imaginary unit i?**
   - Answer: `j` (electrical engineering convention)

2. **What does the @ operator do with NumPy arrays?**
   - Answer: Matrix multiplication

3. **If α = 1/√2 and β = 1/√2, what is |α|² + |β|²?**
   - Answer: 1.0 (normalization)

### Lesson 2: Linear Algebra

1. **What is the result of applying Hadamard to |0⟩?**
   - Answer: (|0⟩ + |1⟩)/√2

2. **If |ψ⟩ = (|0⟩ + |1⟩)/√2, what is P(measuring |0⟩)?**
   - Answer: 0.5

3. **What property must quantum gate matrices satisfy?**
   - Answer: Unitary (U†U = I)

### Lesson 3: Probability

1. **Why do we run quantum circuits multiple times?**
   - Answer: Measurement is probabilistic

2. **480 heads out of 1000 coin tosses - concerning?**
   - Answer: No, within statistical fluctuation

3. **What makes quantum randomness different?**
   - Answer: Fundamentally unpredictable, not just computationally hard

---

## Welcome Email Sending

### Via Node.js (Resend/SendGrid)

```typescript
import { generateWelcomeEmailHtml } from '@/components/WelcomeEmail';

const html = generateWelcomeEmailHtml({
  studentName: 'John',
  enrollmentDate: 'December 24, 2025',
  dashboardUrl: 'https://z2q.academy/dashboard',
});

await sendEmail({
  to: student.email,
  subject: 'Welcome to Z2Q | Your Quantum Journey Begins',
  html,
});
```

### Preview Email

Navigate to `/api/email-preview?name=John` to see rendered HTML in browser.

---

## Integration Points

### With Supabase Auth

```typescript
// On successful signup/login:
const { data: user } = await supabase.auth.getUser();

// Check enrollment
const { data: enrollment } = await supabase
  .from('enrollments')
  .select('orientation_completed_at')
  .eq('profile_id', user.id)
  .single();

if (!enrollment?.orientation_completed_at) {
  // Show orientation
}
```

### With n8n Webhook

The AI Tutor button in the onboarding page triggers the same `/api/tutor` endpoint that powers the dashboard, ensuring consistent behavior.

---

## Testing Checklist

- [ ] Orientation appears on first visit
- [ ] Orientation does NOT appear on subsequent visits
- [ ] "Skip orientation" works and persists
- [ ] "Replay Orientation" button works
- [ ] All three steps render correctly
- [ ] Month 1 lessons unlock sequentially
- [ ] Quiz scoring works (70% threshold)
- [ ] Code blocks render with syntax highlighting
- [ ] Mobile responsive (tested at 375px width)
- [ ] Email renders correctly in Outlook, Gmail, Apple Mail

---

*The first five minutes define the relationship. Make them count.*
