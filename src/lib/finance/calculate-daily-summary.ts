import type { FinanceTransaction } from './types'
import { calculateNetCashFlow } from './calculate-balance'

export interface DailySummary {
  date: string
  totalIncome: number
  totalExpense: number
  netCashFlow: number
  transactionCount: number
}

/**
 * Calculate daily cash summary for a specific date.
 */
export function calculateDailySummary(
  transactions: FinanceTransaction[],
  date: string, // YYYY-MM-DD
): DailySummary {
  const dayTx = transactions.filter((tx) => tx.transactionDate === date)

  const income = dayTx
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amountInCents, 0)

  const expense = dayTx
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amountInCents, 0)

  return {
    date,
    totalIncome: income,
    totalExpense: expense,
    netCashFlow: calculateNetCashFlow(dayTx),
    transactionCount: dayTx.length,
  }
}

/**
 * Group transactions by day and calculate daily summaries.
 */
export function calculateAllDailySummaries(
  transactions: FinanceTransaction[],
): DailySummary[] {
  const days = new Map<string, FinanceTransaction[]>()

  for (const tx of transactions) {
    const existing = days.get(tx.transactionDate) || []
    existing.push(tx)
    days.set(tx.transactionDate, existing)
  }

  return Array.from(days.entries())
    .map(([date, txs]) => calculateDailySummary(txs, date))
    .sort((a, b) => a.date.localeCompare(b.date))
}
