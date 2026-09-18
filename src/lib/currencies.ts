export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: "USD", symbol: "$", name: "US Dollar (USD)" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah (IDR)" },
  { code: "EUR", symbol: "€", name: "Euro (EUR)" },
  { code: "GBP", symbol: "£", name: "British Pound (GBP)" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar (SGD)" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar (AUD)" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen (JPY)" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar (CAD)" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan (CNY)" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit (MYR)" },
  { code: "THB", symbol: "฿", name: "Thai Baht (THB)" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc (CHF)" },
];

export function getCurrencySymbol(currencyCode: string): string {
  const match = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode);
  return match ? match.symbol : currencyCode;
}
