import type { FinanceTransaction } from './types'
import { calculateNetCashFlow } from './calculate-balance'

export interface MonthlySummary {
  year: number
  month: number // 1-12
  totalIncome: number
  totalExpense: number
  netCashFlow: number
  transactionCount: number
}

/**
 * Calculate monthly cash summary from transactions in a given month.
 * Month format: YYYY-MM
 */
export function calculateMonthlySummary(
  transactions: FinanceTransaction[],
  year: number,
  month: number,
): MonthlySummary {
  const monthTx = transactions.filter((tx) => {
    const d = tx.transactionDate
    const [y, m] = d.split('-').map(Number)
    return y === year && m === month
  })

  const income = monthTx
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amountInCents, 0)

  const expense = monthTx
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amountInCents, 0)

  return {
    year,
    month,
    totalIncome: income,
    totalExpense: expense,
    netCashFlow: calculateNetCashFlow(monthTx),
    transactionCount: monthTx.length,
  }
}

/**
 * Group transactions by month and calculate monthly summaries.
 */
export function calculateAllMonthlySummaries(
  transactions: FinanceTransaction[],
): MonthlySummary[] {
  const months = new Map<string, FinanceTransaction[]>()

  for (const tx of transactions) {
    const key = tx.transactionDate.substring(0, 7) // YYYY-MM
    const existing = months.get(key) || []
    existing.push(tx)
    months.set(key, existing)
  }

  return Array.from(months.entries())
    .map(([key, txs]) => {
      const [y, m] = key.split('-').map(Number)
      return calculateMonthlySummary(txs, y, m)
    })
    .sort((a, b) => a.year - b.year || a.month - b.month)
}
