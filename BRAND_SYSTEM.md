# Z2Q Initiative - Brand Design System

## Unconventional Wisdom | Powered by Sayada.ai

---

## 1. Branding Identity: Tailwind CSS Theme Variables

### Color Palette: "Quiet Luxury"

The Z2Q brand embodies **Technological Conservative** aesthetics—sophisticated, authoritative, and timeless. No cyberpunk. No neon. No glitch effects. Pure prestige.

```css
/* Primary: Obsidian Slate */
--color-obsidian: #1A1A1B;         /* The foundation */
--color-obsidian-light: #222223;   /* Elevated surfaces */
--color-obsidian-dark: #0F0F10;    /* Deep shadows */

/* Secondary: Deep Charcoal */
--color-charcoal: #2D2D2E;         /* Cards, panels */
--color-charcoal-light: #3A3A3B;   /* Hover states */
--color-charcoal-dark: #232324;    /* Borders */

/* Accent: Metallic Gold */
--color-gold: #D4AF37;             /* Primary accent */
--color-gold-light: #E5C45C;       /* Hover gold */
--color-gold-dark: #B8962F;        /* Pressed gold */

/* Neutral: Ivory */
--color-ivory: #F5F5F0;            /* Primary text */
--color-ivory-warm: #FAF8F2;       /* Highlighted text */
```

### Typography System

| Role | Font Family | Use Case |
|------|-------------|----------|
| **Display** | Playfair Display | Headlines, hero text, section titles |
| **Body** | DM Sans | Paragraphs, UI elements, buttons |
| **Mono** | JetBrains Mono | Code samples, technical content |

**Why not Inter?** Inter is overused in AI/tech interfaces. DM Sans provides similar readability with a more distinctive character—essential for the "Quiet Luxury" feel.

### Tailwind Mapping

```javascript
// tailwind.config.ts
colors: {
  obsidian: '#1A1A1B',
  charcoal: '#2D2D2E',
  gold: '#D4AF37',
  ivory: '#F5F5F0',
}

fontFamily: {
  display: ['Playfair Display', 'Georgia', 'serif'],
  body: ['DM Sans', 'Helvetica Neue', 'sans-serif'],
}
```

---

## 2. Landing Page Architecture

### Section Flow

1. **Navigation** - Fixed, glass-morphism effect, logo + gold CTA
2. **Hero Section** - Z2Q headline, atmospheric gradients, stats row
3. **The Quantum Mandate** - Three pillars from white paper (IP, PQC, HNDL)
4. **Curriculum Overview** - Foundation (1-6) + Specialization (7-12) split
5. **Specializations Detail** - Tabbed interface for 6 tracks
6. **White Paper Lead Magnet** - Form capture for Legal & IP Briefing
7. **Investment/Pricing** - $997 enrollment + $300 Credit Rebound
8. **Level Progression** - Visual of Level 0 → 1 → 2
9. **Final CTA** - "Are You Ready, or Are You Behind?"
10. **Footer** - Branding, legal links

### Key Design Decisions

- **Hero gradient**: Subtle gold atmospheric glow on obsidian base
- **Cards**: Charcoal backgrounds with gold border on hover
- **CTAs**: Solid gold buttons, never outline-only for primary actions
- **Spacing**: Generous padding (py-24) for luxurious feel
- **Animation**: Framer Motion for fade-in-up on scroll

---

## 3. Database Schema Summary

### Core Tables

| Table | Purpose |
|-------|---------|
| `profiles` | Student data + **knowledge_level** (0, 1, 2) |
| `enrollments` | Payment status, credit rebound tracking |
| `lessons` | Curriculum content (foundation + specializations) |
| `lesson_completions` | Individual progress per student |
| `ai_interactions` | Claude tutor conversation logs |
| `lead_magnets` | White paper download tracking |
| `credit_transactions` | $300 rebound disbursement |

### The Knowledge Level Flow

```
Level 0 (Awareness)
    ↓ Complete ~24 foundation lessons
Level 1 (Application)
    ↓ Complete ~20 specialization lessons
Level 2 (Specialization)
```

The `knowledge_level` field is the **critical field** for the n8n webhook. It determines how Claude 4.5 contextualizes responses.

---

## 4. n8n Webhook Integration

### Endpoint
```
POST http://72.62.82.174/zero2quantum
```

### Request Payload
```json
{
  "student_id": "uuid",
  "current_lesson": "legal-m8-pqc",
  "message": "What is the Quantum Patent Gap?"
}
```

### n8n Workflow Logic

1. **Webhook Trigger** receives POST request
2. **Supabase Node** fetches `profiles.knowledge_level` for student_id
3. **Claude 4.5 Node** constructs prompt:
   ```
   As the Z2Q Academic Proctor, answer this student using the 
   context of [current_lesson]. If they are in the Legal Module, 
   explain the 'Quantum Patent Gap' where current IP laws struggle 
   with non-deterministic algorithms.
   ```
4. **Response Node** returns structured JSON:
   ```json
   {
     "reply": "The Quantum Patent Gap refers to...",
     "suggested_action": "explore_case_study",
     "credit_balance": 0
   }
   ```

### Legal Module Special Handling

When `current_lesson` contains "legal-", Claude receives additional context from the white paper:
- IP Land Grab dynamics
- PQC transition timelines
- HNDL liability frameworks
- Wassenaar Arrangement implications

---

## 5. Financial Model

| Component | Amount |
|-----------|--------|
| **Enrollment Fee** | $997 |
| **Credit Rebound** | $300 |
| **Effective Cost** | $697 (after completion) |

**Credit Rebound Options:**
1. **Cash Back** - Direct refund via Stripe
2. **Specialization Credit** - Applied to advanced modules

**Trigger:** Foundation completion (all Month 1-6 lessons marked complete)

---

## 6. Component Library Reference

### Buttons
```jsx
<button className="btn-primary">Enroll Now</button>
<button className="btn-secondary">Download White Paper</button>
<button className="btn-ghost">Learn More</button>
```

### Cards
```jsx
<div className="card">Standard card</div>
<div className="card-elevated">Elevated card</div>
<div className="card-gold">Gold accent card</div>
```

### Typography
```jsx
<p className="text-overline">THE INITIATIVE</p>
<h1 className="font-display text-display-xl">Z2Q</h1>
<p className="text-body text-ivory/70">Body copy</p>
```

---

## 7. File Structure

```
z2q-initiative/
├── app/
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Global styles + Tailwind
├── lib/
│   └── supabase.ts       # Database + webhook utilities
├── supabase/
│   └── schema.sql        # Complete database schema
├── tailwind.config.ts    # Theme configuration
└── package.json          # Dependencies
```

---

## 8. Deployment Checklist

- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` environment variable
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variable
- [ ] Run `supabase db push` with schema.sql
- [ ] Configure n8n webhook on VPS (72.62.82.174)
- [ ] Upload UW logo to `/public/logo.png`
- [ ] Generate OG image for social sharing
- [ ] Configure Stripe for payment processing
- [ ] Set up email service for white paper delivery

---

*Brand integrity is non-negotiable. Every pixel represents Unconventional Wisdom.*
