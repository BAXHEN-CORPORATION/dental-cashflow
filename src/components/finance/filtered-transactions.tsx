'use client'

import { useMemo } from 'react'
import { useFinanceStore } from '@/lib/store'
import { TransactionTable } from './transaction-table'
import { TransactionFilters } from './transaction-filters'
import { DeleteTransactionDialog } from './delete-dialog'

interface Transaction {
  id: string
  transactionDate: string
  type: 'income' | 'expense' | 'transfer'
  description: string
  amountInCents: number
  category?: { name: string } | string | number
  account: { name: string } | string | number
  destinationAccount?: { name: string } | string | number
}

interface Props {
  transactions: Transaction[]
  categories: { id: number; name: string }[]
  accounts: { id: number; name: string }[]
}

export function FilteredTransactions({ transactions, categories, accounts }: Props) {
  const { filters } = useFinanceStore()

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      // Date range
      if (filters.startDate && tx.transactionDate < filters.startDate) return false
      if (filters.endDate && tx.transactionDate > filters.endDate) return false

      // Type
      if (filters.type && filters.type !== 'all' && tx.type !== filters.type) return false

      // Category
      if (filters.category && filters.category !== 'all') {
        const catId = typeof tx.category === 'object' ? (tx.category as { id: number }).id : tx.category
        if (String(catId) !== filters.category) return false
      }

      // Account
      if (filters.account && filters.account !== 'all') {
        const accId = typeof tx.account === 'object' ? (tx.account as { id: number }).id : tx.account
        if (String(accId) !== filters.account) return false
      }

      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!tx.description.toLowerCase().includes(q)) return false
      }

      return true
    })
  }, [transactions, filters])

  return (
    <>
      <TransactionFilters categories={categories} accounts={accounts} />
      <TransactionTable transactions={filtered} />
      <DeleteTransactionDialog />
    </>
  )
}
