import type { FinanceTransaction } from './types'

/**
 * Calculate net cash flow: total income - total expense.
 * Transfers are excluded (they don't affect overall balance).
 */
export function calculateNetCashFlow(transactions: FinanceTransaction[]): number {
  return transactions.reduce((total, tx) => {
    if (tx.type === 'income') return total + tx.amountInCents
    if (tx.type === 'expense') return total - tx.amountInCents
    // Transfer: no effect on net cash flow
    return total
  }, 0)
}

/**
 * Calculate balance for a specific account.
 * Includes transfers in/out of the account.
 */
export function calculateAccountBalance(
  transactions: FinanceTransaction[],
  accountId: string,
  initialBalanceInCents: number = 0,
): number {
  return transactions.reduce((balance, tx) => {
    // Income to this account
    if (tx.type === 'income' && tx.account === accountId) {
      return balance + tx.amountInCents
    }
    // Expense from this account
    if (tx.type === 'expense' && tx.account === accountId) {
      return balance - tx.amountInCents
    }
    // Transfer out
    if (tx.type === 'transfer' && tx.account === accountId) {
      return balance - tx.amountInCents
    }
    // Transfer in
    if (tx.type === 'transfer' && tx.destinationAccount === accountId) {
      return balance + tx.amountInCents
    }
    return balance
  }, initialBalanceInCents)
}
