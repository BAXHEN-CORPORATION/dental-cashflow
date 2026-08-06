import { describe, it, expect } from 'vitest'
import { calculateDRE } from '../calculate-dre'
import type { FinanceTransaction } from '../types'

function tx(overrides: Partial<FinanceTransaction> = {}): FinanceTransaction {
  return {
    id: '1',
    transactionDate: '2026-06-15',
    type: 'income',
    description: 'Test',
    amountInCents: 10000,
    account: 'acc-1',
    createdBy: 'user-1',
    ...overrides,
  }
}

describe('calculateDRE', () => {
  it('groups revenue by category', () => {
    const dre = calculateDRE(
      [
        tx({ category: 'cat-procedimentos', categoryLabel: 'Procedimentos', amountInCents: 50000 }),
        tx({ category: 'cat-convenios', categoryLabel: 'Convênios', amountInCents: 30000 }),
        tx({ category: 'cat-procedimentos', categoryLabel: 'Procedimentos', amountInCents: 20000 }),
      ],
      '2026-01-01',
      '2026-12-31',
    )

    expect(dre.revenue.totalInCents).toBe(100000)
    expect(dre.revenue.items).toHaveLength(2)
    expect(dre.revenue.items[0].amountInCents).toBe(70000) // sorted desc: 50k+20k = 70k
  })

  it('groups expenses by category', () => {
    const dre = calculateDRE(
      [
        tx({ type: 'expense', category: 'cat-salarios', categoryLabel: 'Salários', amountInCents: 80000 }),
        tx({ type: 'expense', category: 'cat-aluguel', categoryLabel: 'Aluguel', amountInCents: 20000 }),
      ],
      '2026-01-01',
      '2026-12-31',
    )

    expect(dre.expenses.totalInCents).toBe(100000)
    expect(dre.expenses.items).toHaveLength(2)
  })

  it('ignores transfers', () => {
    const dre = calculateDRE(
      [
        tx({ type: 'transfer', category: undefined, amountInCents: 99999 }),
      ],
      '2026-01-01',
      '2026-12-31',
    )

    expect(dre.revenue.totalInCents).toBe(0)
    expect(dre.expenses.totalInCents).toBe(0)
  })

  it('filters by date range', () => {
    const dre = calculateDRE(
      [
        tx({ transactionDate: '2026-01-10', amountInCents: 10000 }),
        tx({ transactionDate: '2026-06-15', amountInCents: 20000 }),
        tx({ transactionDate: '2026-12-20', amountInCents: 30000 }),
      ],
      '2026-06-01',
      '2026-06-30',
    )

    expect(dre.revenue.totalInCents).toBe(20000)
  })

  it('calculates net result', () => {
    const dre = calculateDRE(
      [
        tx({ category: 'cat-1', categoryLabel: 'Receita', amountInCents: 100000 }),
        tx({ type: 'expense', category: 'cat-2', categoryLabel: 'Despesa', amountInCents: 60000 }),
      ],
      '2026-01-01',
      '2026-12-31',
    )

    expect(dre.netResultInCents).toBe(40000)
  })

  it('handles empty transactions', () => {
    const dre = calculateDRE([], '2026-01-01', '2026-12-31')

    expect(dre.revenue.totalInCents).toBe(0)
    expect(dre.expenses.totalInCents).toBe(0)
    expect(dre.netResultInCents).toBe(0)
  })
})
