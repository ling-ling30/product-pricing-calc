export type ComponentType =
  | "fixed"            // Flat amount (+/- number)
  | "pct_subtotal"     // % of cumulative subtotal up to this point
  | "pct_component"    // % of a specific previous component
  | "margin"           // Target Gross Margin % on final selling price
  | "markup";          // Markup % on accumulated cost

export interface PricingComponent {
  id: string;
  name: string;
  type: ComponentType;
  value: number;
  targetComponentId?: string; // ID of referenced component when type === 'pct_component'
  enabled: boolean;
  category?: "material" | "labor" | "overhead" | "logistics" | "tax" | "profit" | "custom";
}

export interface CalculationLineResult {
  componentId: string;
  name: string;
  type: ComponentType;
  inputValue: number;
  monetaryValue: number; // Actual dollar/currency contribution
  subtotalAfter: number; // Cumulative subtotal after this step
  enabled: boolean;
  referenceDetail?: string; // Human-friendly context, e.g. "15% of Subtotal ($120.00)"
}

export interface CalculationSummary {
  lines: CalculationLineResult[];
  baseCost: number;        // Sum of pure direct costs
  totalCost: number;       // Total cost before profit/margin
  finalSellPrice: number;  // Recommended selling price
  netProfit: number;       // Final price - Total cost
  grossMarginPct: number;  // Net profit as % of final price
  markupPct: number;       // Net profit as % of total cost
  currency: string;
}

export interface CalculationPreset {
  id: string;
  name: string;
  currency: string;
  components: PricingComponent[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
}
