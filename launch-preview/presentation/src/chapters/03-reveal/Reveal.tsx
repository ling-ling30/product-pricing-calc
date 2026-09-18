import type { ChapterStepProps } from "../../registry/types";
import "./Reveal.css";

export default function Reveal({ step }: ChapterStepProps) {
  return (
    <div className="rv-stage">
      {/* Top Swiss Running Header */}
      <div className="rv-header">
        <div>
          <div className="rv-kicker">03 / The Experience</div>
          <div style={{ fontSize: 13, color: "var(--text-mute)", marginTop: 4, fontFamily: "var(--font-mono)" }}>
            LOCAL-FIRST PRIVACY · ONE-TAP EXPORT · PRODUCTION LAUNCH
          </div>
        </div>
        <div className="rv-meta">
          <div>STEP 0{step + 1} OF 03</div>
          <div style={{ color: "var(--accent)", marginTop: 4 }}>SWISS IKB GRID</div>
        </div>
      </div>

      {/* Main Body Driven by Step */}
      <div className="rv-body">
        {step === 0 && (
          <>
            <h1 className="rv-title">
              Runs completely offline on your device. <strong>Zero sign-up wall</strong>.
            </h1>

            {/* Visual: Local-First & Zero Friction Cards */}
            <div className="rv-privacy-grid">
              <div className="rv-privacy-card">
                <div className="rv-card-head">
                  <div className="rv-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                      <line x1="6" y1="6" x2="6.01" y2="6"></line>
                      <line x1="6" y1="18" x2="6.01" y2="18"></line>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text)" }}>Local-First Privacy</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-mute)" }}>OFFLINE STORAGE</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: "var(--text-mute)", lineHeight: 1.6, margin: 0 }}>
                  All calculations and saved products stay on your device via browser LocalStorage. No confidential supplier costs or margin formulas are ever uploaded.
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <span className="rv-pill-badge">NO CLOUD LEAKS</span>
                  <span className="rv-pill-badge">SUB-MILLISECOND SPEED</span>
                </div>
              </div>

              <div className="rv-privacy-card">
                <div className="rv-card-head">
                  <div className="rv-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text)" }}>Zero-Friction Access</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-mute)" }}>NO SIGN-UP WALL</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: "var(--text-mute)", lineHeight: 1.6, margin: 0 }}>
                  No email capture, no password resets, no forced onboarding wizards. Instant utility right when you need to calculate unit margins for a new SKU.
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <span className="rv-pill-badge">100% UNGATED</span>
                  <span className="rv-pill-badge">OPEN TO ALL MAKERS</span>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="rv-title">
              Whenever you need to send a quote, <strong>one tap copies the breakdown</strong>.
            </h1>

            {/* Visual: Instant Quote Card */}
            <div className="rv-quote-container">
              <div className="rv-quote-card">
                <div className="rv-quote-head">
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em", fontWeight: 600 }}>
                      COMMERCIAL QUOTATION
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>Specialty Single-Origin Coffee</div>
                  </div>
                  <span className="rv-pill-badge" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
                    1 KG BATCH
                  </span>
                </div>

                <div className="rv-quote-rows">
                  <div className="rv-quote-row">
                    <span>Green Coffee Raw Beans</span>
                    <span>$60.00</span>
                  </div>
                  <div className="rv-quote-row">
                    <span>Toll Roasting & Gas Labor</span>
                    <span>$15.00</span>
                  </div>
                  <div className="rv-quote-row">
                    <span>Moisture Loss / Shrinkage (15%)</span>
                    <span>$9.00</span>
                  </div>
                  <div className="rv-quote-row">
                    <span>Degassing Pouch & Mailer Box</span>
                    <span>$6.00</span>
                  </div>
                  <div className="rv-quote-row total">
                    <span>Base Production Cost (COGS)</span>
                    <span>$90.00</span>
                  </div>
                  <div className="rv-quote-row" style={{ color: "var(--accent)", fontWeight: 700, fontSize: 16 }}>
                    <span>Target Selling Price (25% Margin)</span>
                    <span>$120.00</span>
                  </div>
                </div>
              </div>

              <div className="rv-quote-action-panel">
                <div className="rv-copied-banner">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>COPIED TO CLIPBOARD</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-mute)", lineHeight: 1.5, marginTop: 4 }}>
                  Generates clean, pre-formatted Markdown or plain text ready to paste directly into WhatsApp, Slack, or client email proposals.
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="rv-title">
              Experience Product Calculator <strong>live in production</strong>.
            </h1>

            {/* Visual: Hero Launch Poster */}
            <div className="rv-hero-launch">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="rv-pill-badge" style={{ color: "var(--accent)", borderColor: "var(--accent)", background: "var(--accent-soft)" }}>
                  ● NOW LIVE WORLDWIDE
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-mute)" }}>
                  DEPLOYED ON VERCEL EDGE
                </span>
              </div>

              <div className="rv-hero-domain">
                hitung-harga-product.vercel.app
              </div>

              <div style={{ fontSize: 18, color: "var(--text-mute)", maxWidth: 800, lineHeight: 1.5 }}>
                A focused, Apple-inspired pricing engine built for makers, e-commerce founders, and boutique manufacturers.
              </div>

              <div className="rv-pills-row">
                <div className="rv-pill-badge">12 GLOBAL CURRENCIES</div>
                <div className="rv-pill-badge">INTERACTIVE UNDO HISTORY</div>
                <div className="rv-pill-badge">RADIX DIALOG CONFIRMATIONS</div>
                <div className="rv-pill-badge">ZERO RUNTIME SPREADSHEETS</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Swiss Bottom Folio */}
      <div className="rv-footer">
        <div>PRODUCT PRICE & MARGIN CALCULATOR · LAUNCH PREVIEW</div>
        <div>HITUNG-HARGA-PRODUCT.VERCEL.APP · 16:9 1080P</div>
      </div>
    </div>
  );
}
