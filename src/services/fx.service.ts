export interface FxRatesResponse {
  result: string;
  provider: string;
  time_last_update_utc: string;
  base_code: string;
  rates: Record<string, number>;
}

export const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  IDR: 17740,
  EUR: 0.87,
  GBP: 0.74,
  SGD: 1.28,
  AUD: 1.48,
  JPY: 153.5,
  CNY: 7.15,
};

/**
 * Calculates converted amount between two currencies using base rates (standardized against USD)
 * Includes optional percentage buffer for hedging bank spread (e.g. +1.5%)
 */
export function convertAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number> = FALLBACK_RATES,
  bufferPct: number = 0
): {
  convertedAmount: number;
  rateUsed: number;
  effectiveRate: number;
} {
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;

  // Rate from base currency (from) to target currency (to)
  // 1 unit of fromCurrency = (toRate / fromRate) units of toCurrency
  const rawRate = toRate / fromRate;

  // Apply buffer (e.g. +1% cushion on foreign exchange)
  const bufferMultiplier = 1 + bufferPct / 100;
  const effectiveRate = rawRate * bufferMultiplier;
  const convertedAmount = amount * effectiveRate;

  return {
    convertedAmount,
    rateUsed: rawRate,
    effectiveRate,
  };
}
