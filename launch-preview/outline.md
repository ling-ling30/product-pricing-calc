# Video Outline: Product Calculator Launch Preview

> **Theme**: `swiss-ikb` (Recommended) — Precision Swiss grid, Yves Klein Blue accents, bold numerical typography
> **Total Duration**: ~45s (9 steps · ~5s per step)
> **Chapters**: 3 slides / 9 steps total

---

## 1. the-problem — Why Pricing Breaks (3 steps · ~15s)

**Information Pool**:
- Problem: Hidden formula errors & lost margins in manual spreadsheets — Source: `article.md` §The Problem
- Metric: 12-15% unmodeled yield loss/shrinkage erases target profit — Source: `article.md` §The Problem
- Solution: Clean, modular product pricing engine — Source: `article.md` §The Solution

**Development Plan**:
- step 1 (~4s) — Hero statement showing chaotic spreadsheet formulas fading into red alert indicator
- step 2 (~5s) — Contrast visual showing margin erosion: projected 25% margin shrinking to -4% deficit
- step 3 (~6s) — Clean product calculator emblem reveal with headline: "Price with Confidence"

Excerpt:
> Most product pricing still happens in a messy spreadsheet. One broken cell or forgotten shrinkage fee, and you're suddenly losing money on every sale. Meet Product Calculator: a clean, modular way to price anything with absolute confidence.

---

## 2. the-engine — Modular Cost Waterfall (3 steps · ~15s)

**Information Pool**:
- Building blocks: Direct fixed items (Materials, Labor, Shipping, Packaging) — Source: `article.md` §The Solution L1
- Cascades: % of running subtotal or % of specific item (shrinkage) — Source: `article.md` §The Solution L2
- Solver: Mathematical gross margin solver: `Selling Price = Cost / (1 - Margin)` — Source: `article.md` §The Solution L3

**Development Plan**:
- step 1 (~5s) — Stacked visual building blocks assembling step-by-step: Material ($50) + Labor ($25)
- step 2 (~5s) — Dynamic percentage linking: 15% shrinkage badge snapping to Material with formula badge
- step 3 (~5s) — Giant selling price hero card resolving to $100 with bright green 25% profit margin pill

Excerpt:
> You build your price with simple blocks: raw materials, labor, yield loss, and shipping. Chain percentage fees to running subtotals, or link waste directly to a specific item. Enter your target margin, and the exact selling price and profit update in real time.

---

## 3. the-reveal — Offline Freedom & Instant Quotes (3 steps · ~15s)

**Information Pool**:
- Storage: 100% offline local storage + optional Google OAuth cloud sync — Source: `article.md` §Experience
- Action: One-tap commercial quote copy to clipboard — Source: `article.md` §Experience
- URL: Live in production at `https://hitung-harga-product.vercel.app` — Source: `article.md` §Experience

**Development Plan**:
- step 1 (~5s) — Dual badge showcase: "Device Storage" icon pulsing alongside "Cloud Synced" indicator
- step 2 (~5s) — Interactive quote card preview with instant "Copied to Clipboard" green checkmark pill
- step 3 (~5s) — Final launch poster card with live domain URL: `hitung-harga-product.vercel.app`

Excerpt:
> It runs completely offline on your device, with zero setup and no sign-up wall. Whenever you need to send a quote, one tap copies a clean, professional breakdown. Try it live right now at hitung-harga-product.vercel.app.

---

## Asset Checklist

### 1. the-problem
- ✓ SVG Spreadsheet glitch & warning icon (Code-generated SVG)
- ✓ Typography tokens & alert red accent

### 2. the-engine
- ✓ Waterfall bar data visualization components
- ✓ Dynamic pill badges (Fixed, % Item, Margin)

### 3. the-reveal
- ✓ Cloud & Local drive vector badges
- ✓ Clipboard copy animation & checkmark
- ✓ Live URL typography lockup
