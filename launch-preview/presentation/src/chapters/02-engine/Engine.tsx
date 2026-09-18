import type { ChapterStepProps } from "../../registry/types";
import "./Engine.css";

export default function Engine({ step }: ChapterStepProps) {
  return (
    <div className="eg-stage">
      {/* Top Swiss Running Header */}
      <div className="eg-header">
        <div>
          <div className="eg-kicker">02 / The Cost Engine</div>
          <div style={{ fontSize: 13, color: "var(--text-mute)", marginTop: 4, fontFamily: "var(--font-mono)" }}>
            MODULAR CASCADES · MARGIN SOLVER ALGORITHM
          </div>
        </div>
        <div className="eg-meta">
          <div>STEP 0{step + 1} OF 03</div>
          <div style={{ color: "var(--accent)", marginTop: 4 }}>SWISS IKB GRID</div>
        </div>
      </div>

      {/* Main Body Driven by Step */}
      <div className="eg-body">
        {step === 0 && (
          <>
            <h1 className="eg-title">
              Build your unit economics with <strong>clean modular blocks</strong>.
            </h1>

            {/* Visual: Cost Blocks Stack */}
            <div className="eg-stack-demo">
              <div className="eg-block-item">
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span className="eg-pill-accent">01 · MATERIAL</span>
                  <span className="eg-block-name">Specialty Green Coffee (1 kg)</span>
                </div>
                <div className="eg-block-val">$60.00</div>
              </div>

              <div className="eg-block-item">
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span className="eg-pill-accent">02 · PROCESS</span>
                  <span className="eg-block-name">Toll Roasting & Quality Inspection</span>
                </div>
                <div className="eg-block-val">$15.00</div>
              </div>

              <div className="eg-block-item">
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span className="eg-pill-accent">03 · SHRINKAGE</span>
                  <span className="eg-block-name">Roast Moisture Loss Factor (15%)</span>
                </div>
                <div className="eg-block-val" style={{ color: "var(--accent)" }}>+$9.00</div>
              </div>

              <div className="eg-block-item">
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span className="eg-pill-accent">04 · LOGISTICS</span>
                  <span className="eg-block-name">Degassing Valve Pouch & Box Mailer</span>
                </div>
                <div className="eg-block-val">$6.00</div>
              </div>

              <div className="eg-subtotal-bar">
                <div style={{ fontSize: 13, letterSpacing: "0.08em", color: "var(--text-mute)", fontWeight: 600 }}>
                  TOTAL TRUE UNIT COST (COGS)
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text)" }}>$90.00</div>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="eg-title">
              Chain percentage fees to <strong>running subtotals</strong> or specific items.
            </h1>

            {/* Visual: Link Grid */}
            <div className="eg-link-grid">
              <div className="eg-link-card">
                <div className="eg-link-head">
                  <span className="eg-pill-accent">TARGETED LINK</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-mute)" }}>ITEM-LEVEL</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>
                  Yield & Shrinkage Loss
                </div>
                <p style={{ fontSize: 14, color: "var(--text-mute)", lineHeight: 1.5, margin: 0 }}>
                  Calculated strictly against Item 01 (Raw Material), automatically scaling whenever source commodity prices shift.
                </p>
                <div style={{ marginTop: 24, padding: "12px 16px", background: "var(--surface-2)", border: "1px solid var(--rule)", fontFamily: "var(--font-mono)", fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                  <span>15.0% × $60.00</span>
                  <strong style={{ color: "var(--accent)" }}>$9.00 / unit</strong>
                </div>
              </div>

              <div className="eg-link-card">
                <div className="eg-link-head">
                  <span className="eg-pill-accent">CASCADE LINK</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-mute)" }}>SUBTOTAL-LEVEL</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>
                  Fulfillment & Merchant Fees
                </div>
                <p style={{ fontSize: 14, color: "var(--text-mute)", lineHeight: 1.5, margin: 0 }}>
                  Calculated against the running subtotal or final retail price, ensuring gateway transaction cuts never compress your margin.
                </p>
                <div style={{ marginTop: 24, padding: "12px 16px", background: "var(--surface-2)", border: "1px solid var(--rule)", fontFamily: "var(--font-mono)", fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                  <span>Cascade Base</span>
                  <strong style={{ color: "var(--accent)" }}>Fully Dynamic</strong>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="eg-title">
              Target your margin. <strong>The selling price solves itself</strong>.
            </h1>

            {/* Visual: Calculation Hero */}
            <div className="eg-hero-calc">
              <div className="eg-calc-panel">
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-mute)", letterSpacing: "0.1em", marginBottom: 16 }}>
                  INPUT PARAMETERS
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--rule)" }}>
                  <span style={{ fontSize: 14, color: "var(--text-mute)" }}>Direct Production Cost</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>$90.00</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--rule)" }}>
                  <span style={{ fontSize: 14, color: "var(--text-mute)" }}>Target Net Profit Margin</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--accent)" }}>25.0%</span>
                </div>
                <div style={{ marginTop: 16, fontSize: 12, color: "var(--text-mute)", fontFamily: "var(--font-mono)", lineHeight: 1.6 }}>
                  SOLVER FORMULA:<br />
                  Price = Cost / (1 - Margin) = $90.00 / 0.75
                </div>
              </div>

              <div className="eg-calc-hero">
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)", letterSpacing: "0.12em", fontWeight: 600 }}>
                  RECOMMENDED SELLING PRICE
                </div>
                <div className="eg-large-price">$120.00</div>
                <div style={{ display: "flex", gap: 24, paddingTop: 16, borderTop: "1px solid var(--rule)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
                  <div>
                    <span style={{ color: "var(--text-mute)" }}>Net Profit: </span>
                    <strong style={{ color: "var(--accent)" }}>$30.00</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-mute)" }}>Markup: </span>
                    <strong>+33.3%</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-mute)" }}>Realized Margin: </span>
                    <strong style={{ color: "var(--accent)" }}>25.0%</strong>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Swiss Bottom Folio */}
      <div className="eg-footer">
        <div>PRICING ENGINE · DETERMINISTIC MARGIN CALCULATION</div>
        <div>NO SPREADSHEET DEPENDENCIES · ZERO DRIFT</div>
      </div>
    </div>
  );
}
