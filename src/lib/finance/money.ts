/**
 * Money utilities — all calculations use integer cents.
 * Display formatting uses Brazilian locale (R$).
 */

/** Format cents to display string: 35075 → "R$ 350,75" */
export function formatCurrency(cents: number): string {
  const real = cents / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(real)
}

/** Convert reais (decimal) to cents (integer): 350.75 → 35075 */
export function toCents(reais: number): number {
  return Math.round(reais * 100)
}

/** Convert cents (integer) to reais (decimal): 35075 → 350.75 */
export function toReais(cents: number): number {
  return cents / 100
}

/** Sum an array of cent values */
export function sumCents(values: number[]): number {
  return values.reduce((total, v) => total + v, 0)
}
