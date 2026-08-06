import type { FinanceTransaction } from './types'

export interface DRE {
  period: string
  revenue: {
    items: { label: string; amountInCents: number }[]
    totalInCents: number
  }
  expenses: {
    items: { label: string; amountInCents: number }[]
    totalInCents: number
  }
  netResultInCents: number
}

/**
 * Calculate basic DRE (Demonstrativo de Resultado do Exercício).
 * Groups income and expenses by category.
 * Transfers are excluded.
 */
export function calculateDRE(
  transactions: FinanceTransaction[],
  startDate: string,
  endDate: string,
): DRE {
  const periodTx = transactions.filter((tx) => {
    return tx.transactionDate >= startDate && tx.transactionDate <= endDate
  })

  const incomeByCategory = new Map<string, number>()
  const expenseByCategory = new Map<string, number>()

  for (const tx of periodTx) {
    if (tx.type === 'income') {
      const label = tx.categoryLabel || tx.category || 'Sem categoria'
      incomeByCategory.set(label, (incomeByCategory.get(label) || 0) + tx.amountInCents)
    }
    if (tx.type === 'expense') {
      const label = tx.categoryLabel || tx.category || 'Sem categoria'
      expenseByCategory.set(label, (expenseByCategory.get(label) || 0) + tx.amountInCents)
    }
  }

  const revenueItems = Array.from(incomeByCategory.entries())
    .map(([label, amountInCents]) => ({ label, amountInCents }))
    .sort((a, b) => b.amountInCents - a.amountInCents)

  const expenseItems = Array.from(expenseByCategory.entries())
    .map(([label, amountInCents]) => ({ label, amountInCents }))
    .sort((a, b) => b.amountInCents - a.amountInCents)

  const totalRevenue = revenueItems.reduce((s, i) => s + i.amountInCents, 0)
  const totalExpenses = expenseItems.reduce((s, i) => s + i.amountInCents, 0)

  return {
    period: `${startDate} a ${endDate}`,
    revenue: { items: revenueItems, totalInCents: totalRevenue },
    expenses: { items: expenseItems, totalInCents: totalExpenses },
    netResultInCents: totalRevenue - totalExpenses,
  }
}
