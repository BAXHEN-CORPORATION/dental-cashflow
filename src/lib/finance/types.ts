/**
 * Core finance types used across calculation functions.
 * All monetary values are in integer cents.
 */
export interface FinanceTransaction {
  id: string
  transactionDate: string // YYYY-MM-DD
  type: 'income' | 'expense' | 'transfer'
  description: string
  category?: string
  categoryLabel?: string // Resolved category name for reports
  amountInCents: number
  paymentMethod?: string
  account: string
  destinationAccount?: string
  guideNumber?: string
  guideAmountInCents?: number
  notes?: string
  createdBy: string
}
