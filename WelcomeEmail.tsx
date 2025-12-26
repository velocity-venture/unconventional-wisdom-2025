// =============================================================================
// Z2Q WELCOME EMAIL TEMPLATE
// React-Email compatible HTML for new student onboarding
// Brand: Unconventional Wisdom | Aesthetic: Quiet Luxury
// =============================================================================

export interface WelcomeEmailProps {
  studentName: string;
  enrollmentDate: string;
  dashboardUrl: string;
}

export function generateWelcomeEmailHtml({
  studentName,
  enrollmentDate,
  dashboardUrl,
}: WelcomeEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to Z2Q | Unconventional Wisdom</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset */
    body, table, td, p, a { margin: 0; padding: 0; }
    img { border: 0; display: block; }
    
    /* Base */
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #1A1A1B;
      color: #F5F5F0;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    
    /* Links */
    a { color: #D4AF37; text-decoration: none; }
    a:hover { color: #E5C45C; }
    
    /* Typography */
    .font-display {
      font-family: Georgia, 'Times New Roman', serif;
    }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px !important; }
      .content { padding: 24px !important; }
      .heading { font-size: 28px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #1A1A1B;">
  <!-- Preheader (hidden text for email preview) -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    Welcome to the Z2Q Initiative. Your quantum journey begins now.
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <!-- Main Container -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #1A1A1B;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Email Body -->
        <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #1A1A1B; max-width: 600px;">
          
          <!-- Header / Logo -->
          <tr>
            <td align="center" style="padding: 0 0 30px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="background: linear-gradient(135deg, #D4AF37, #B8962F); width: 50px; height: 50px; border-radius: 8px; text-align: center; vertical-align: middle;">
                    <span style="color: #1A1A1B; font-family: Georgia, serif; font-size: 24px; font-weight: bold;">Z</span>
                  </td>
                  <td style="padding-left: 15px;">
                    <p style="margin: 0; color: #D4AF37; font-size: 12px; letter-spacing: 3px; font-weight: 500;">UNCONVENTIONAL WISDOM</p>
                    <p style="margin: 2px 0 0 0; color: #808080; font-size: 10px; letter-spacing: 1px;">Powered by Sayada.ai</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Section -->
          <tr>
            <td class="content" style="background-color: #2D2D2E; border-radius: 12px; padding: 48px 40px; text-align: center;">
              
              <!-- Level Badge -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin-bottom: 24px;">
                <tr>
                  <td style="background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 50%; width: 80px; height: 80px; text-align: center; vertical-align: middle;">
                    <span class="font-display" style="color: #D4AF37; font-size: 36px; font-family: Georgia, serif;">0</span>
                  </td>
                </tr>
              </table>

              <!-- Welcome Text -->
              <p style="color: #D4AF37; font-size: 11px; letter-spacing: 4px; margin: 0 0 16px 0; text-transform: uppercase;">THE Z2Q INITIATIVE</p>
              
              <h1 class="heading font-display" style="color: #F5F5F0; font-size: 36px; font-weight: 400; margin: 0 0 16px 0; font-family: Georgia, serif;">
                Welcome, ${studentName}
              </h1>
              
              <p style="color: #B0B0B0; font-size: 16px; margin: 0 0 32px 0; line-height: 1.7;">
                You are now <span style="color: #D4AF37; font-weight: 600;">Level 0 — Quantum Awareness</span>.
                <br>
                Your journey from zero to quantum proficiency begins today.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td style="background: linear-gradient(135deg, #D4AF37, #B8962F); border-radius: 6px;">
                    <a href="${dashboardUrl}" target="_blank" style="display: inline-block; padding: 16px 32px; color: #1A1A1B; font-size: 16px; font-weight: 600; text-decoration: none;">
                      Enter Your Dashboard →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height: 32px;"></td></tr>

          <!-- Timeline Section -->
          <tr>
            <td class="content" style="background-color: #232324; border: 1px solid #3A3A3B; border-radius: 12px; padding: 32px 40px;">
              
              <h2 class="font-display" style="color: #D4AF37; font-size: 20px; font-weight: 400; margin: 0 0 24px 0; font-family: Georgia, serif;">
                Your 12-Month Roadmap
              </h2>

              <!-- Foundation Phase -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
                <tr>
                  <td width="50" valign="top">
                    <div style="width: 32px; height: 32px; background: rgba(212, 175, 55, 0.2); border-radius: 50%; text-align: center; line-height: 32px;">
                      <span style="color: #D4AF37; font-size: 14px;">1-6</span>
                    </div>
                  </td>
                  <td valign="top" style="padding-left: 12px;">
                    <p style="color: #F5F5F0; font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">Foundation Phase</p>
                    <p style="color: #808080; font-size: 14px; margin: 0;">
                      Python, Linear Algebra, Quantum Circuits, Qiskit, Core Algorithms
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Specialization Phase -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="50" valign="top">
                    <div style="width: 32px; height: 32px; background: rgba(128, 128, 128, 0.2); border-radius: 50%; text-align: center; line-height: 32px;">
                      <span style="color: #808080; font-size: 14px;">7-12</span>
                    </div>
                  </td>
                  <td valign="top" style="padding-left: 12px;">
                    <p style="color: #808080; font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">Specialization Phase</p>
                    <p style="color: #606060; font-size: 14px; margin: 0;">
                      Choose: Legal, Finance, Cybersecurity, Pharma, ML, or Logistics
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height: 32px;"></td></tr>

          <!-- Credit Rebound Section -->
          <tr>
            <td class="content" style="background: linear-gradient(135deg, rgba(74, 124, 89, 0.1), rgba(26, 26, 27, 1)); border: 1px solid rgba(74, 124, 89, 0.3); border-radius: 12px; padding: 32px 40px; text-align: center;">
              
              <p style="color: #4A7C59; font-size: 11px; letter-spacing: 3px; margin: 0 0 12px 0; text-transform: uppercase;">YOUR INCENTIVE</p>
              
              <h2 class="font-display" style="color: #6ABF7B; font-size: 48px; font-weight: 400; margin: 0 0 8px 0; font-family: Georgia, serif;">
                $300
              </h2>
              
              <p style="color: #F5F5F0; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">
                Credit Rebound
              </p>
              
              <p style="color: #808080; font-size: 14px; margin: 0; line-height: 1.6;">
                Complete the Foundation Phase and receive $300 back—<br>
                as cash or credit toward your Specialization track.
              </p>

            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height: 32px;"></td></tr>

          <!-- Quick Start Section -->
          <tr>
            <td class="content" style="background-color: #232324; border: 1px solid #3A3A3B; border-radius: 12px; padding: 32px 40px;">
              
              <h2 class="font-display" style="color: #D4AF37; font-size: 20px; font-weight: 400; margin: 0 0 24px 0; font-family: Georgia, serif;">
                Your First Week
              </h2>

              <!-- Day 1 -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 16px;">
                <tr>
                  <td width="60" valign="top">
                    <span style="color: #D4AF37; font-size: 12px; font-weight: 600;">Day 1</span>
                  </td>
                  <td valign="top">
                    <p style="color: #B0B0B0; font-size: 14px; margin: 0;">
                      Complete the Welcome Orientation in your dashboard
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Day 2-3 -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 16px;">
                <tr>
                  <td width="60" valign="top">
                    <span style="color: #D4AF37; font-size: 12px; font-weight: 600;">Day 2-3</span>
                  </td>
                  <td valign="top">
                    <p style="color: #B0B0B0; font-size: 14px; margin: 0;">
                      Start Lesson 1: Python Fundamentals
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Day 4 -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 16px;">
                <tr>
                  <td width="60" valign="top">
                    <span style="color: #D4AF37; font-size: 12px; font-weight: 600;">Day 4</span>
                  </td>
                  <td valign="top">
                    <p style="color: #B0B0B0; font-size: 14px; margin: 0;">
                      Create your free <a href="https://quantum.ibm.com" style="color: #D4AF37;">IBM Quantum account</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Day 5-7 -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="60" valign="top">
                    <span style="color: #D4AF37; font-size: 12px; font-weight: 600;">Day 5-7</span>
                  </td>
                  <td valign="top">
                    <p style="color: #B0B0B0; font-size: 14px; margin: 0;">
                      Review Khan Academy's Linear Algebra basics
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height: 32px;"></td></tr>

          <!-- AI Tutor Tip -->
          <tr>
            <td class="content" style="background: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; padding: 24px 40px;">
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="50" valign="top">
                    <span style="font-size: 32px;">🎓</span>
                  </td>
                  <td valign="top" style="padding-left: 16px;">
                    <p style="color: #D4AF37; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">
                      Your AI Tutor is Ready
                    </p>
                    <p style="color: #808080; font-size: 14px; margin: 0; line-height: 1.6;">
                      Stuck on a concept? Click "Ask AI Tutor" in your dashboard. 
                      Our Socratic guide will help you understand—not just give you answers.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height: 40px;"></td></tr>

          <!-- Footer -->
          <tr>
            <td style="text-align: center; padding: 0 40px;">
              
              <!-- Tagline -->
              <p class="font-display" style="color: #D4AF37; font-size: 18px; font-style: italic; margin: 0 0 24px 0; font-family: Georgia, serif;">
                "The quantum age is here. Are you ready, or are you behind?"
              </p>

              <!-- Divider -->
              <div style="width: 60px; height: 1px; background: linear-gradient(90deg, transparent, #D4AF37, transparent); margin: 0 auto 24px auto;"></div>

              <!-- Links -->
              <p style="margin: 0 0 16px 0;">
                <a href="${dashboardUrl}" style="color: #808080; font-size: 12px; margin: 0 12px;">Dashboard</a>
                <span style="color: #3A3A3B;">|</span>
                <a href="https://z2q.academy/support" style="color: #808080; font-size: 12px; margin: 0 12px;">Support</a>
                <span style="color: #3A3A3B;">|</span>
                <a href="https://z2q.academy/community" style="color: #808080; font-size: 12px; margin: 0 12px;">Community</a>
              </p>

              <!-- Copyright -->
              <p style="color: #606060; font-size: 11px; margin: 0 0 8px 0;">
                © 2025 Unconventional Wisdom. All rights reserved.
              </p>
              <p style="color: #606060; font-size: 11px; margin: 0;">
                Enrolled: ${enrollmentDate}
              </p>

              <!-- Unsubscribe -->
              <p style="margin: 24px 0 0 0;">
                <a href="https://z2q.academy/unsubscribe" style="color: #505050; font-size: 10px;">
                  Unsubscribe from these emails
                </a>
              </p>

            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

// =============================================================================
// REACT EMAIL COMPONENT (for React-Email library)
// =============================================================================

export function WelcomeEmailReact({
  studentName,
  enrollmentDate,
  dashboardUrl,
}: WelcomeEmailProps) {
  // This is a simplified React component version
  // For full React-Email, use @react-email/components
  return (
    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        backgroundColor: '#1A1A1B',
        color: '#F5F5F0',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#1A1A1B',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '15px',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #D4AF37, #B8962F)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  color: '#1A1A1B',
                  fontFamily: 'Georgia, serif',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                Z
              </span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <p
                style={{
                  margin: 0,
                  color: '#D4AF37',
                  fontSize: '12px',
                  letterSpacing: '3px',
                }}
              >
                UNCONVENTIONAL WISDOM
              </p>
              <p
                style={{
                  margin: '2px 0 0 0',
                  color: '#808080',
                  fontSize: '10px',
                }}
              >
                Powered by Sayada.ai
              </p>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div
          style={{
            backgroundColor: '#2D2D2E',
            borderRadius: '12px',
            padding: '48px 40px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: '#D4AF37',
              fontSize: '11px',
              letterSpacing: '4px',
              margin: '0 0 16px 0',
              textTransform: 'uppercase',
            }}
          >
            THE Z2Q INITIATIVE
          </p>
          <h1
            style={{
              color: '#F5F5F0',
              fontSize: '36px',
              fontFamily: 'Georgia, serif',
              fontWeight: 400,
              margin: '0 0 16px 0',
            }}
          >
            Welcome, {studentName}
          </h1>
          <p style={{ color: '#B0B0B0', fontSize: '16px', margin: '0 0 32px 0' }}>
            You are now <span style={{ color: '#D4AF37', fontWeight: 600 }}>Level 0</span>.
            <br />
            Your journey from zero to quantum proficiency begins today.
          </p>
          <a
            href={dashboardUrl}
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #D4AF37, #B8962F)',
              color: '#1A1A1B',
              fontSize: '16px',
              fontWeight: 600,
              textDecoration: 'none',
              borderRadius: '6px',
            }}
          >
            Enter Your Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// EXPORT DEFAULT HTML GENERATOR
// =============================================================================

export default generateWelcomeEmailHtml;
