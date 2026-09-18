import type { ChapterStepProps } from "../../registry/types";
import "./Problem.css";

export default function Problem({ step }: ChapterStepProps) {
  return (
    <div className="pb-stage">
      {/* Top Swiss Running Header */}
      <div className="pb-header">
        <div>
          <div className="pb-kicker">01 / The Vulnerability</div>
          <div style={{ fontSize: 13, color: "var(--text-mute)", marginTop: 4, fontFamily: "var(--font-mono)" }}>
            PRICING INTEGRITY · SPREADSHEET AUDIT
          </div>
        </div>
        <div className="pb-meta">
          <div>STEP 0{step + 1} OF 03</div>
          <div style={{ color: "var(--accent)", marginTop: 4 }}>SWISS IKB GRID</div>
        </div>
      </div>

      {/* Main Body Driven by Step */}
      <div className="pb-body">
        {step === 0 && (
          <>
            <h1 className="pb-title">
              Most product pricing still happens in a <strong>messy spreadsheet</strong>.
            </h1>

            {/* Visual: Chaotic Glitched Spreadsheet */}
            <div className="pb-sheet-demo">
              <div className="pb-sheet-head">
                <div>ROW</div>
                <div>COST COMPONENT</div>
                <div>TYPE</div>
                <div>VALUE</div>
              </div>
              <div className="pb-sheet-row">
                <div style={{ fontFamily: "var(--font-mono)" }}>01</div>
                <div style={{ fontWeight: 500 }}>Green Coffee / Raw Material</div>
                <div style={{ color: "var(--text-mute)", fontSize: 13 }}>Direct Cost</div>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>$140.00 / kg</div>
              </div>
              <div className="pb-sheet-row">
                <div style={{ fontFamily: "var(--font-mono)" }}>02</div>
                <div style={{ fontWeight: 500 }}>Toll Roasting & Gas</div>
                <div style={{ color: "var(--text-mute)", fontSize: 13 }}>Labor/Processing</div>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>$25.00 / kg</div>
              </div>
              <div className="pb-sheet-row pb-glitch">
                <div style={{ fontFamily: "var(--font-mono)", color: "#d91414" }}>03</div>
                <div style={{ fontWeight: 600, color: "#d91414" }}>Roast Shrinkage & Loss (15%)</div>
                <div style={{ color: "#d91414", fontSize: 13 }}>Formula Link Broken</div>
                <div>
                  <span className="pb-err-pill">#REF! INVALID CELL</span>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="pb-title">
              One unmodeled shrinkage fee silently <strong>erases your margin</strong>.
            </h1>

            {/* Visual: Contrast Cards */}
            <div className="pb-contrast-grid">
              <div className="pb-contrast-card">
                <div className="pb-card-tag">Expected Scenario</div>
                <div className="pb-big-num pb-good">25.0%</div>
                <div className="pb-card-desc">
                  Estimated target profit margin based on paper cost calculations without waste factors.
                </div>
              </div>

              <div className="pb-contrast-card pb-bad">
                <div className="pb-card-tag" style={{ color: "#d91414" }}>Realized Reality</div>
                <div className="pb-big-num pb-danger">-4.2%</div>
                <div className="pb-card-desc">
                  Actual net margin after 15% physical roast shrinkage and uncounted toll shipping fees.
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="pb-title">
              Meet <strong>Product Calculator</strong>.
            </h1>

            {/* Visual: Brand Emblem Hero */}
            <div className="pb-hero-banner">
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.1em", color: "var(--accent)" }}>
                INTRODUCING THE SYSTEM
              </div>
              <div style={{ fontSize: 32, fontWeight: 300, marginTop: 12, lineHeight: 1.3, color: "var(--text)" }}>
                A modular, distraction-free cost engine engineered for total commercial pricing clarity.
              </div>

              <div className="pb-badges-row">
                <div className="pb-spec-badge pb-highlight">MODULAR CASCADES</div>
                <div className="pb-spec-badge">TRUE MARGIN MATH</div>
                <div className="pb-spec-badge">ZERO FORMULA BUGS</div>
                <div className="pb-spec-badge">100% OFFLINE FIRST</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Swiss Bottom Folio */}
      <div className="pb-footer">
        <div>PRODUCT PRICE & MARGIN CALCULATOR · LAUNCH PREVIEW</div>
        <div>SWISS INTERNATIONAL STYLE · 16:9 1080P</div>
      </div>
    </div>
  );
}
