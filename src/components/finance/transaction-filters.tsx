'use client'

import { useFinanceStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface Props {
  categories: { id: number | string; name: string }[]
  accounts: { id: number | string; name: string }[]
}

const typeItems = [
  { value: 'all', label: 'Todos' },
  { value: 'income', label: 'Entrada' },
  { value: 'expense', label: 'Saída' },
  { value: 'transfer', label: 'Transferência' },
]

function FilterLabel({ htmlFor, children }: { htmlFor?: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="block h-4 text-xs text-muted-foreground">
      {children}
    </label>
  )
}

export function TransactionFilters({ categories, accounts }: Props) {
  const { filters, setFilters, resetFilters } = useFinanceStore()

  const categoryItems = [
    { value: 'all', label: 'Todas' },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ]

  const accountItems = [
    { value: 'all', label: 'Todas' },
    ...accounts.map((a) => ({ value: String(a.id), label: a.name })),
  ]

  const hasFilters =
    filters.startDate || filters.endDate || filters.type || filters.category || filters.account || filters.search

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <FilterLabel htmlFor="filter-start">Início</FilterLabel>
        <Input
          id="filter-start"
          type="date"
          className="w-36"
          value={filters.startDate ?? ''}
          onChange={(e) => setFilters({ startDate: e.target.value || undefined })}
        />
      </div>

      <div>
        <FilterLabel htmlFor="filter-end">Fim</FilterLabel>
        <Input
          id="filter-end"
          type="date"
          className="w-36"
          value={filters.endDate ?? ''}
          onChange={(e) => setFilters({ endDate: e.target.value || undefined })}
        />
      </div>

      <div>
        <FilterLabel>Tipo</FilterLabel>
        <Select
          items={typeItems}
          value={filters.type ?? ''}
          onValueChange={(v) => setFilters({ type: (v || undefined) as 'income' | 'expense' | 'transfer' | undefined })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            {typeItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <FilterLabel>Categoria</FilterLabel>
        <Select
          items={categoryItems}
          value={filters.category ?? ''}
          onValueChange={(v) => setFilters({ category: v || undefined })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            {categoryItems.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <FilterLabel>Conta</FilterLabel>
        <Select
          items={accountItems}
          value={filters.account ?? ''}
          onValueChange={(v) => setFilters({ account: v || undefined })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            {accountItems.map((a) => (
              <SelectItem key={a.value} value={a.value}>
                {a.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <FilterLabel htmlFor="filter-search">Buscar</FilterLabel>
        <Input
          id="filter-search"
          placeholder="Descrição..."
          className="w-44"
          value={filters.search ?? ''}
          onChange={(e) => setFilters({ search: e.target.value || undefined })}
        />
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="icon"
          onClick={resetFilters}
          title="Limpar filtros"
          className="shrink-0"
        >
          <X />
        </Button>
      )}
    </div>
  )
}
