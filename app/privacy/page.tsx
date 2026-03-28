// app/privacy/page.tsx
// Copy this file to: app/privacy/page.tsx

export default function PrivacyPage() {
  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <div style={{ maxWidth:"760px", margin:"0 auto", padding:"4rem 1.5rem 6rem" }}>
        <div style={{ marginBottom:"3rem" }}>
          <div style={{ fontSize:".72rem", letterSpacing:"3px", textTransform:"uppercase", color:"var(--electric)", marginBottom:"1rem" }}>Legal</div>
          <h1 style={{ fontFamily:"var(--fd)", fontSize:"clamp(2rem,5vw,3rem)", fontWeight:800, letterSpacing:"-2px", marginBottom:"1rem" }}>Privacy Policy</h1>
          <p style={{ color:"var(--muted)", fontSize:".875rem" }}>Last updated: January 2026</p>
        </div>

        {[
          ["1. Information We Collect", "We collect information you provide directly (topic descriptions, account details) and usage data (pages visited, features used, generation count). We do not sell your personal data."],
          ["2. How We Use Your Information", "We use collected data to provide and improve our service, process payments, send service-related communications, and analyze usage patterns to improve the product. We do not use your content inputs to train AI models."],
          ["3. Data Storage", "Hook generations and history are stored locally in your browser (localStorage). Account data for paid plans is stored securely on our servers. We use industry-standard encryption."],
          ["4. Third-Party Services", "We use Anthropic's Claude API to generate content. Your prompts are sent to Anthropic's servers for processing. Please review Anthropic's privacy policy at anthropic.com. For payments, we use Stripe. Your payment data is handled entirely by Stripe and never stored on our servers."],
          ["5. Cookies", "We use essential cookies for authentication and session management. We do not use tracking or advertising cookies. You can disable cookies in your browser settings, though this may affect functionality."],
          ["6. Data Retention", "Free tier data is stored in your browser and cleared when you clear browser data. Paid account data is retained while your account is active and for 30 days after deletion."],
          ["7. Your Rights", "You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at privacy@hookviral.ai. We will respond within 30 days."],
          ["8. Children's Privacy", "HookViral AI is not directed to children under 13. We do not knowingly collect personal information from children under 13."],
          ["9. Changes to This Policy", "We may update this policy periodically. We will notify users of significant changes via email or a prominent notice on our website."],
          ["10. Contact Us", "For privacy-related questions or requests: privacy@hookviral.ai"],
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
