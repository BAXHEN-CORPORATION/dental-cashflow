import { create } from 'zustand'

export interface FinanceFilters {
  startDate?: string
  endDate?: string
  type?: 'income' | 'expense' | 'transfer'
  category?: string
  account?: string
  search?: string
}

interface FinanceStore {
  filters: FinanceFilters
  setFilters: (filters: Partial<FinanceFilters>) => void
  resetFilters: () => void

  // Modal state
  deleteDialogOpen: boolean
  transactionToDelete: string | null
  openDeleteDialog: (id: string) => void
  closeDeleteDialog: () => void
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  filters: {},
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: {} }),

  deleteDialogOpen: false,
  transactionToDelete: null,
  openDeleteDialog: (id) => set({ deleteDialogOpen: true, transactionToDelete: id }),
  closeDeleteDialog: () => set({ deleteDialogOpen: false, transactionToDelete: null }),
}))
