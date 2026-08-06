import { describe, it, expect } from 'vitest'
import { calculateNetCashFlow, calculateAccountBalance } from '../calculate-balance'
import type { FinanceTransaction } from '../types'

function tx(overrides: Partial<FinanceTransaction> = {}): FinanceTransaction {
  return {
    id: '1',
    transactionDate: '2026-01-15',
    type: 'income',
    description: 'Test',
    amountInCents: 10000, // R$ 100,00
    account: 'account-1',
    createdBy: 'user-1',
    ...overrides,
  }
}

describe('calculateNetCashFlow', () => {
  it('sums income', () => {
    const result = calculateNetCashFlow([
      tx({ amountInCents: 10000 }),
      tx({ amountInCents: 5000 }),
    ])
    expect(result).toBe(15000)
  })

  it('subtracts expense', () => {
    const result = calculateNetCashFlow([
      tx({ type: 'expense', amountInCents: 3000 }),
    ])
    expect(result).toBe(-3000)
  })

  it('ignores transfers', () => {
    const result = calculateNetCashFlow([
      tx({ amountInCents: 10000 }),
      tx({ type: 'transfer', amountInCents: 5000 }),
    ])
    expect(result).toBe(10000)
  })

  it('handles mixed transactions', () => {
    const result = calculateNetCashFlow([
      tx({ amountInCents: 50000 }),
      tx({ type: 'expense', amountInCents: 20000 }),
      tx({ amountInCents: 15000 }),
    ])
    expect(result).toBe(45000)
  })

  it('returns 0 for empty array', () => {
    expect(calculateNetCashFlow([])).toBe(0)
  })
})

describe('calculateAccountBalance', () => {
  it('starts with initial balance', () => {
    const result = calculateAccountBalance([], 'acc-1', 50000)
    expect(result).toBe(50000)
  })

  it('adds income for the account', () => {
    const result = calculateAccountBalance(
      [tx({ account: 'acc-1', amountInCents: 10000 })],
      'acc-1',
    )
    expect(result).toBe(10000)
  })

  it('subtracts expense for the account', () => {
    const result = calculateAccountBalance(
      [tx({ type: 'expense', account: 'acc-1', amountInCents: 3000 })],
      'acc-1',
    )
    expect(result).toBe(-3000)
  })

  it('handles transfer out', () => {
    const result = calculateAccountBalance(
      [tx({ type: 'transfer', account: 'acc-1', amountInCents: 10000 })],
      'acc-1',
      50000,
    )
    expect(result).toBe(40000)
  })

  it('handles transfer in', () => {
    const result = calculateAccountBalance(
      [tx({ type: 'transfer', account: 'acc-2', destinationAccount: 'acc-1', amountInCents: 10000 })],
      'acc-1',
    )
    expect(result).toBe(10000)
  })

  it('ignores transactions for other accounts', () => {
    const result = calculateAccountBalance(
      [tx({ account: 'acc-2', amountInCents: 99999 })],
      'acc-1',
      10000,
    )
    expect(result).toBe(10000)
  })

  it('handles complex account scenario', () => {
    const txs: FinanceTransaction[] = [
      tx({ account: 'bank', amountInCents: 100000, type: 'income' }),          // +1000
      tx({ account: 'bank', amountInCents: 30000, type: 'expense' }),          // -300
      tx({ account: 'bank', amountInCents: 20000, type: 'transfer', destinationAccount: 'cash' }), // -200 from bank
      tx({ account: 'cash', amountInCents: 20000, type: 'transfer', destinationAccount: 'bank' }), // this is transfer OUT from cash, -200
    ]
    expect(calculateAccountBalance(txs, 'bank', 50000)).toBe(50000 + 100000 - 30000 - 20000 + 20000) // = 120000
    expect(calculateAccountBalance(txs, 'cash', 0)).toBe(0) // +20000 in from bank, -20000 out to bank
  })
})
