import { PricingComponent } from "@/types/calculator";

export interface StarterTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultCurrency: string;
  components: PricingComponent[];
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "coffee",
    name: "Coffee Roastery SKU",
    icon: "☕",
    description: "Specialty green beans, toll roasting labor, moisture loss factor & degassing valve pouch.",
    defaultCurrency: "USD",
    components: [
      {
        id: "c-coffee-1",
        name: "Specialty Green Beans (1 kg)",
        type: "fixed",
        value: 60,
        enabled: true,
        category: "material",
      },
      {
        id: "c-coffee-2",
        name: "Toll Roasting & Gas Labor",
        type: "fixed",
        value: 15,
        enabled: true,
        category: "labor",
      },
      {
        id: "c-coffee-3",
        name: "Roast Moisture Shrinkage (15%)",
        type: "pct_component",
        value: 15,
        targetComponentId: "c-coffee-1",
        enabled: true,
        category: "overhead",
      },
      {
        id: "c-coffee-4",
        name: "Valve Pouch & Mailer Box",
        type: "fixed",
        value: 6,
        enabled: true,
        category: "logistics",
      },
      {
        id: "c-coffee-5",
        name: "Target Profit Margin",
        type: "margin",
        value: 25,
        enabled: true,
        category: "profit",
      },
    ],
  },
  {
    id: "apparel",
    name: "E-Commerce Apparel",
    icon: "👕",
    description: "Heavyweight cotton, cut & sew production, scrap factor, polymailer & merchant fee.",
    defaultCurrency: "USD",
    components: [
      {
        id: "c-apparel-1",
        name: "Organic Heavyweight Cotton",
        type: "fixed",
        value: 18,
        enabled: true,
        category: "material",
      },
      {
        id: "c-apparel-2",
        name: "Cut & Sew Production Labor",
        type: "fixed",
        value: 14,
        enabled: true,
        category: "labor",
      },
      {
        id: "c-apparel-3",
        name: "Fabric Cutting Scrap (8%)",
        type: "pct_component",
        value: 8,
        targetComponentId: "c-apparel-1",
        enabled: true,
        category: "overhead",
      },
      {
        id: "c-apparel-4",
        name: "Custom Polymailer & Hangtag",
        type: "fixed",
        value: 4,
        enabled: true,
        category: "logistics",
      },
      {
        id: "c-apparel-5",
        name: "Platform & Card Processing (3.5%)",
        type: "pct_subtotal",
        value: 3.5,
        enabled: true,
        category: "overhead",
      },
      {
        id: "c-apparel-6",
        name: "Target Profit Margin",
        type: "margin",
        value: 35,
        enabled: true,
        category: "profit",
      },
    ],
  },
  {
    id: "craft",
    name: "Handmade / Artisan Candle",
    icon: "🕯️",
    description: "Natural soy wax, amber glass vessel, artisan labor, packing & target margin.",
    defaultCurrency: "USD",
    components: [
      {
        id: "c-craft-1",
        name: "Soy Wax & Essential Oils",
        type: "fixed",
        value: 8,
        enabled: true,
        category: "material",
      },
      {
        id: "c-craft-2",
        name: "Amber Glass Vessel & Cotton Wick",
        type: "fixed",
        value: 4.5,
        enabled: true,
        category: "material",
      },
      {
        id: "c-craft-3",
        name: "Hand Pouring & Curing Labor",
        type: "fixed",
        value: 12,
        enabled: true,
        category: "labor",
      },
      {
        id: "c-craft-4",
        name: "Protective Honeycomb Wrap & Box",
        type: "fixed",
        value: 3.5,
        enabled: true,
        category: "logistics",
      },
      {
        id: "c-craft-5",
        name: "Target Profit Margin",
        type: "margin",
        value: 40,
        enabled: true,
        category: "profit",
      },
    ],
  },
];
