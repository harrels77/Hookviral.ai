// app/terms/page.tsx
// Copy this file to: app/terms/page.tsx

export default function TermsPage() {
  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <div style={{ maxWidth:"760px", margin:"0 auto", padding:"4rem 1.5rem 6rem" }}>
        <div style={{ marginBottom:"3rem" }}>
          <div style={{ fontSize:".72rem", letterSpacing:"3px", textTransform:"uppercase", color:"var(--electric)", marginBottom:"1rem" }}>Legal</div>
          <h1 style={{ fontFamily:"var(--fd)", fontSize:"clamp(2rem,5vw,3rem)", fontWeight:800, letterSpacing:"-2px", marginBottom:"1rem" }}>Terms of Service</h1>
          <p style={{ color:"var(--muted)", fontSize:".875rem" }}>Last updated: January 2026</p>
        </div>

        {[
          ["1. Acceptance of Terms", "By accessing or using HookViral AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service."],
          ["2. Description of Service", "HookViral AI provides an AI-powered social media hook generator. The service includes a free tier with 10 daily generations and paid plans (Pro and Agency) with additional features including unlimited generations, script generation, hashtag optimization, and analytics."],
          ["3. User Accounts", "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. You must be at least 13 years old to use this service."],
          ["4. Acceptable Use", "You agree not to use HookViral AI to generate content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable. You agree not to attempt to reverse engineer, scrape, or abuse our API."],
          ["5. Intellectual Property", "Content you input into HookViral AI remains your property. Generated hooks and scripts are provided for your use. HookViral AI retains rights to the underlying technology, models, and platform."],
          ["6. Payments and Refunds", "Paid plans are billed monthly or annually. Subscriptions auto-renew unless cancelled. We offer a 7-day refund policy for first-time Pro subscribers if you are not satisfied. Agency refunds are handled on a case-by-case basis."],
          ["7. Limitation of Liability", "HookViral AI is provided 'as is' without warranties of any kind. We are not liable for any indirect, incidental, special, or consequential damages arising from your use of the service."],
          ["8. Termination", "We reserve the right to suspend or terminate your account for violations of these terms. You may cancel your account at any time."],
          ["9. Changes to Terms", "We may update these terms periodically. Continued use of the service after changes constitutes acceptance of the new terms."],
          ["10. Contact", "For questions about these terms, contact us at legal@hookviral.ai"],
        ].map(([title, content]) => (
          <div key={title} style={{ marginBottom:"2.5rem" }}>
            <h2 style={{ fontFamily:"var(--fd)", fontSize:"1.1rem", fontWeight:700, marginBottom:".75rem", color:"var(--text)" }}>{title}</h2>
            <p style={{ fontSize:".9rem", color:"var(--soft)", lineHeight:1.8, fontWeight:300 }}>{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
