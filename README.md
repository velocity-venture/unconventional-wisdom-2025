# Z2Q Initiative - Deployment Guide

## Brand Hierarchy

| Level | Brand | Domain |
|-------|-------|--------|
| **Parent** | Sayada.ai | `sayada.ai` |
| **Academic** | Unconventional Wisdom Academy | `uw.sayada.ai` |
| **Product** | Z2Q (Zero2Quantum) | `uw.sayada.ai/z2q` |

## Production URLs

| Route | URL |
|-------|-----|
| Landing Page | `https://uw.sayada.ai/z2q` |
| Dashboard | `https://uw.sayada.ai/z2q/dashboard` |
| Onboarding | `https://uw.sayada.ai/z2q/onboarding` |
| AI Tutor API | `https://uw.sayada.ai/z2q/api/tutor` |
| Stripe Webhook | `https://uw.sayada.ai/z2q/api/webhooks/stripe` |

## Project Overview

**Z2Q (Zero2Quantum)** is a 12-month quantum computing education platform powered by **Unconventional Wisdom Academy** and **Sayada.ai**.

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend/Auth:** Supabase
- **AI Middleware:** n8n Hosted on Hostinger VPS (72.62.82.174)
- **Payments:** Stripe
- **Email:** Resend
- **CDN/Proxy:** Cloudflare

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Z2Q SYSTEM ARCHITECTURE                            │
│                        https://uw.sayada.ai/z2q                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐               │
│   │   Vercel     │     │   Supabase   │     │   Stripe     │               │
│   │  (Frontend)  │────▶│  (Database)  │◀────│  (Payments)  │               │
│   │  Next.js 14  │     │  PostgreSQL  │     │   Webhooks   │               │
│   │  basePath:   │     │              │     │              │               │
│   │    /z2q      │     │              │     │              │               │
│   └──────────────┘     └──────────────┘     └──────────────┘               │
│          │                    ▲                    │                        │
│          │                    │                    │                        │
│          ▼                    │                    ▼                        │
│   ┌──────────────────────────────────────────────────────┐                 │
│   │              Hostinger VPS (72.62.82.174)            │                 │
│   │  ┌─────────────────────────────────────────────┐     │                 │
│   │  │                   n8n                        │     │                 │
│   │  │  Webhook: /zero2quantum                     │     │                 │
│   │  │  ├── Student Questions → Claude 4.5        │     │                 │
│   │  │  ├── Capstone Evaluation                   │     │                 │
│   │  │  └── Drift Prevention Logic                │     │                 │
│   │  └─────────────────────────────────────────────┘     │                 │
│   └──────────────────────────────────────────────────────┘                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

Create a `.env.local` file in the project root (see `.env.example` for full template):

```env
# =============================================================================
# APPLICATION (New Domain Structure)
# =============================================================================
# Base URL for Unconventional Wisdom (without /z2q path)
# Note: /z2q is added via basePath in next.config.js
NEXT_PUBLIC_APP_URL=https://uw.sayada.ai

# =============================================================================
# SUPABASE
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# =============================================================================
# STRIPE
# =============================================================================
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Stripe Product/Price IDs (Z2Q)
STRIPE_PRODUCT_ID=prod_TfOZoziWZb6QYG
STRIPE_PRICE_ID=price_1Si3mNI3wsIEE2uCkXfbxAvJ

# =============================================================================
# EMAIL (Resend)
# =============================================================================
RESEND_API_KEY=re_...

# =============================================================================
# n8n WEBHOOK (Hostinger VPS)
# =============================================================================
N8N_WEBHOOK_URL=http://72.62.82.174/zero2quantum
```

### Important: basePath Configuration

The Z2Q app uses Next.js `basePath` to deploy under `/z2q`:

```javascript
// next.config.js
module.exports = {
  basePath: '/z2q',
  assetPrefix: '/z2q',
}
```

**What this means:**
- Internal routes: `/dashboard` → served at `/z2q/dashboard`
- API routes: `/api/checkout` → served at `/z2q/api/checkout`
- Assets: `/_next/static/*` → served at `/z2q/_next/static/*`
- `<Link href="/dashboard">` works automatically (basePath prepended)

---

## Hostinger VPS Setup (n8n Webhook)

### 1. Initial Server Setup

```bash
# SSH into your VPS
ssh root@72.62.82.174

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y
```

### 2. Install n8n

```bash
# Create n8n directory
mkdir -p /opt/n8n
cd /opt/n8n

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3'

services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your-secure-password
      - N8N_HOST=72.62.82.174
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://72.62.82.174/
      - GENERIC_TIMEZONE=America/Chicago
    volumes:
      - ./data:/home/node/.n8n
EOF

# Start n8n
docker-compose up -d
```

### 3. Configure Nginx Reverse Proxy

```bash
# Install Nginx
apt install nginx -y

# Create config
cat > /etc/nginx/sites-available/n8n << 'EOF'
server {
    listen 80;
    server_name 72.62.82.174;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Webhook endpoint (no auth required)
    location /zero2quantum {
        proxy_pass http://localhost:5678/webhook/zero2quantum;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx
```

### 4. Create n8n Workflow

In the n8n UI (http://72.62.82.174:5678):

1. **Create new workflow:** "Z2Q Academic Proctor"

2. **Add Webhook Node:**
   - HTTP Method: POST
   - Path: `zero2quantum`
   - Authentication: None (public endpoint)

3. **Add Function Node (Parse Request):**
```javascript
const { student_id, current_lesson, message, knowledge_level, evaluation_mode } = $input.item.json.body;

return {
  student_id,
  current_lesson,
  message,
  knowledge_level: knowledge_level || '0',
  evaluation_mode: evaluation_mode || false,
};
```

4. **Add Claude (Anthropic) Node:**
   - Model: claude-3-5-sonnet-20241022
   - System Prompt:
```
You are the Z2Q Academic Proctor, a Socratic AI tutor for quantum computing education.

RULES:
1. Guide students to understanding through questions, not direct answers.
2. Use metaphors and examples at an 8th-grade reading level.
3. If the student is Level 0, focus ONLY on Foundation topics (Months 1-6).
4. Redirect advanced questions back to current lesson context.
5. Never provide code without explanation.
6. Encourage use of IBM Quantum, Qiskit, and Khan Academy.

Current Lesson Context: {{$json.current_lesson}}
Student Level: {{$json.knowledge_level}}
```
   - User Message: `{{$json.message}}`

5. **Add Response Node:**
```javascript
return {
  json: {
    reply: $input.item.json.content[0].text,
    suggested_action: "Continue with current lesson",
    credit_balance: 0,
    drift_detected: false,
  }
};
```

6. **Connect nodes and activate workflow**

### 5. Test Webhook

```bash
curl -X POST http://72.62.82.174/zero2quantum \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "test-123",
    "current_lesson": "m1-python-basics",
    "message": "What is a qubit?",
    "knowledge_level": "0"
  }'
```

### 6. AI Tutor Proxy Architecture

The frontend never calls the n8n webhook directly. All requests go through the Next.js API:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AI TUTOR REQUEST FLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Frontend                 Cloudflare              Next.js API              │
│   (Browser)                  (Proxy)              (/z2q/api/tutor)          │
│       │                         │                       │                   │
│       │  POST /z2q/api/tutor    │                       │                   │
│       │ ───────────────────────▶│                       │                   │
│       │                         │  Forward to Vercel    │                   │
│       │                         │ ──────────────────────▶                   │
│       │                         │                       │                   │
│       │                         │                       │  Drift Detection  │
│       │                         │                       │  (Local check)    │
│       │                         │                       │                   │
│       │                         │                       │  POST to n8n      │
│       │                         │                       │ ──────────────────▶
│       │                         │                       │                   │
│       │                         │                       │  ◀────────────────
│       │                         │                       │  Claude response  │
│       │                         │                       │                   │
│       │                         │  ◀────────────────────│                   │
│       │  ◀──────────────────────│                       │                   │
│       │     JSON response       │                       │                   │
│                                                                             │
│                         Hostinger VPS                                       │
│                       (72.62.82.174)                                        │
│                              │                                              │
│                              ▼                                              │
│                    n8n /zero2quantum                                        │
│                    ├── Claude 4.5 API                                       │
│                    └── Response formatting                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Request URL:** `https://uw.sayada.ai/z2q/api/tutor`

**Request Body:**
```json
{
  "student_id": "uuid",
  "current_lesson": "m1-python-basics",
  "message": "What is superposition?",
  "knowledge_level": "0"
}
```

**Response Body:**
```json
{
  "reply": "Great question! Think of superposition like...",
  "suggested_action": "continue",
  "credit_balance": 0,
  "drift_detected": false
}
```

**Health Check:**
```bash
curl https://uw.sayada.ai/z2q/api/tutor
# Returns: { "status": "ok", "n8n_reachable": true, ... }
```

---

## Supabase Setup

### 1. Create Project

1. Go to [supabase.com](https://supabase.com) and create new project
2. Note the Project URL and API keys

### 2. Run Migrations

In order, execute these SQL files in Supabase SQL Editor:

```
supabase/schema.sql
supabase/seed_foundation.sql
supabase/migrations/001_capstone_submissions.sql
supabase/migrations/002_orientation_tracking.sql
```

### 3. Add Missing Columns (if needed)

```sql
-- Add Stripe columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add Stripe columns to enrollments
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS stripe_session_id TEXT UNIQUE;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS price_id TEXT;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS product_id TEXT;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2);
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'usd';
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
  stripe_session_id TEXT,
  stripe_customer_id TEXT,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'usd',
  status TEXT,
  transaction_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable realtime for profiles
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
```

### 4. Enable Row Level Security

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;

-- Create policies (example for profiles)
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);
```

---

## Stripe Setup

### 1. Create Product

In Stripe Dashboard:
- Product Name: "Z2Q Initiative - Full Program"
- Price: $997 (one-time)
- Product ID: `prod_TfOZoziWZb6QYG`
- Price ID: `price_1Si3mNI3wsIEE2uCkXfbxAvJ`

### 2. Configure Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://uw.sayada.ai/z2q/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `charge.refunded` (optional, for refunds)
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 3. Test Mode

For testing, use:
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

### 4. Local Development

For testing webhooks locally:
```bash
# Install Stripe CLI
stripe login

# Forward webhooks to local (note the /z2q basePath)
stripe listen --forward-to localhost:3000/z2q/api/webhooks/stripe
```

### 5. Cloudflare Configuration (CRITICAL for Webhooks)

Stripe signs webhooks using the **raw request body**. Cloudflare must not modify the body or the signature will fail.

**Create a Page Rule for the webhook endpoint:**

1. Go to Cloudflare Dashboard → Rules → Page Rules
2. Add rule for: `uw.sayada.ai/z2q/api/webhooks/*`
3. Settings:
   - **Cache Level:** Bypass
   - **Rocket Loader:** Off
   - **Auto Minify:** Off (all)
   - **Browser Integrity Check:** Off
   - **Security Level:** Essentially Off (for this path only)

**Alternative: Cache Rule (new Cloudflare UI)**
```
Expression: (http.host eq "uw.sayada.ai" and starts_with(http.request.uri.path, "/z2q/api/webhooks"))
Action: Bypass cache
```

**SSL/TLS Configuration:**
- Mode: Full (Strict)
- Always Use HTTPS: On
- Minimum TLS Version: 1.2

**Why this matters:**
```
Stripe → Cloudflare → Vercel → Next.js
           ↓
   If body modified = signature invalid = webhook fails
```

---

## Cloudflare DNS Setup

### 1. DNS Records

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | `uw` | `cname.vercel-dns.com` | Proxied (Orange) |
| TXT | `_vercel` | `vc-domain-verify=...` | DNS only |

### 2. SSL/TLS

- **Mode:** Full (Strict)
- **Edge Certificates:** Universal (free)
- **Always Use HTTPS:** On
- **Automatic HTTPS Rewrites:** On

### 3. Page Rules (Minimum Required)

1. **Webhook Bypass** (as above)
2. **API No-Cache:** `uw.sayada.ai/z2q/api/*` → Cache Level: Bypass

---

## Vercel Deployment

### 1. Connect Repository

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 2. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add all variables from `.env.example`.

### 3. Configure Domain

1. **Option A: Subdomain + Path (Recommended)**
   - Add custom domain: `uw.sayada.ai`
   - Next.js basePath handles `/z2q` routing automatically
   - Final URL: `https://uw.sayada.ai/z2q`

2. **Option B: Vercel Rewrites (if using separate projects)**
   - In the parent `uw.sayada.ai` project, add rewrite:
   ```json
   {
     "rewrites": [
       {
         "source": "/z2q/:path*",
         "destination": "https://z2q-project.vercel.app/:path*"
       }
     ]
   }
   ```

### 4. Update After Deploy

After deployment, update:
- Stripe webhook URL: `https://uw.sayada.ai/z2q/api/webhooks/stripe`
- Resend sending domain: Verify `uw.sayada.ai` in Resend dashboard

---

## File Structure

```
z2q-initiative/
├── app/
│   ├── api/
│   │   ├── capstone/evaluate/route.ts    # Capstone AI evaluation
│   │   ├── checkout/route.ts             # Stripe checkout creation
│   │   ├── orientation/route.ts          # Orientation tracking
│   │   ├── specialization/route.ts       # Specialization selection
│   │   ├── tutor/route.ts                # AI tutor (drift prevention)
│   │   └── webhooks/stripe/route.ts      # Stripe webhook handler
│   ├── dashboard/
│   │   ├── page.tsx                      # Foundation dashboard
│   │   └── integrated/page.tsx           # Full promotion flow
│   ├── enrollment/
│   │   └── success/page.tsx              # Post-checkout success
│   ├── onboarding/
│   │   └── page.tsx                      # First Five Minutes
│   ├── globals.css                       # Tailwind + custom styles
│   ├── layout.tsx                        # Root layout
│   └── page.tsx                          # Landing page (Stripe CTA)
├── components/
│   ├── CapstoneSubmission.tsx            # Month 6 capstone form
│   ├── LevelUpModal.tsx                  # Specialization selection
│   ├── Month1LessonContent.tsx           # Full Month 1 curriculum
│   ├── WelcomeEmail.tsx                  # HTML email template
│   └── WelcomeOrientation.tsx            # 3-step onboarding overlay
├── hooks/
│   └── usePromotionState.ts              # Real-time state management
├── lib/
│   ├── gating.ts                         # Level gating utilities
│   └── supabase.ts                       # Supabase client config
├── supabase/
│   ├── migrations/
│   │   ├── 001_capstone_submissions.sql
│   │   └── 002_orientation_tracking.sql
│   ├── schema.sql                        # Main database schema
│   └── seed_foundation.sql               # Month 1-6 lesson data
├── tailwind.config.ts                    # Tailwind + UW brand colors
├── tsconfig.json                         # TypeScript config
├── package.json                          # Dependencies
├── BRAND_SYSTEM.md                       # Design system docs
├── FIRST_FIVE_MINUTES.md                 # Onboarding system docs
├── GATING_SYSTEM.md                      # Level gating docs
├── PROMOTION_PHASE.md                    # Level-up flow docs
└── README.md                             # This file
```

---

## Testing Checklist

### Pre-Launch

- [ ] Supabase schema deployed
- [ ] Foundation lessons seeded (18 lessons)
- [ ] n8n webhook responding
- [ ] Stripe test checkout works
- [ ] Welcome email sends via Resend
- [ ] Orientation tracking persists
- [ ] Level gating enforced

### Post-Launch

- [ ] Live Stripe payments processing
- [ ] Webhook creating profiles/enrollments
- [ ] Dashboard accessible after payment
- [ ] AI tutor responding correctly
- [ ] No duplicate enrollments on retry

---

## Quick Commands

```bash
# Local development (runs at localhost:3000/z2q)
npm run dev

# Build
npm run build

# Deploy to Vercel
vercel --prod

# Test Stripe webhook locally (note /z2q basePath)
stripe listen --forward-to localhost:3000/z2q/api/webhooks/stripe

# Check n8n logs
docker logs -f n8n
```

### URL Reference (Production)

| Purpose | URL |
|---------|-----|
| Landing Page | `https://uw.sayada.ai/z2q` |
| Dashboard | `https://uw.sayada.ai/z2q/dashboard` |
| Stripe Webhook | `https://uw.sayada.ai/z2q/api/webhooks/stripe` |
| AI Tutor API | `https://uw.sayada.ai/z2q/api/tutor` |
| n8n Webhook | `http://72.62.82.174/zero2quantum` |

---

## Support

- **Technical Issues:** Check Vercel logs and Supabase logs
- **Payment Issues:** Check Stripe Dashboard → Payments
- **AI Tutor Issues:** Check n8n workflow execution history

---

*Built with Quiet Luxury. The quantum age is here.*
