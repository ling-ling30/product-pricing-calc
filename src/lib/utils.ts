import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  
  if (currency === "IDR") {
    return `Rp ${Math.round(safeAmount).toLocaleString("id-ID")}`;
  }

  if (currency === "JPY") {
    return `¥${Math.round(safeAmount).toLocaleString("ja-JP")}`;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return `${currency} ${safeAmount.toFixed(2)}`;
  }
}

export function formatPercent(value: number): string {
  const safeVal = Number.isFinite(value) ? value : 0;
  return `${Number(safeVal.toFixed(2))}%`;
}
