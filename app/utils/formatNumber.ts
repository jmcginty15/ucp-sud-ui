import { shortenLargeNumber } from "./shortenLargeNumber";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

export function formatNumber(x: number) {
  if (isLargeNumber(x)) {
    return shortenLargeNumber(x);
  }
  return numberFormatter.format(x);
}

export function isLargeNumber(x: number) {
  return Math.abs(x) >= 1000;
}
