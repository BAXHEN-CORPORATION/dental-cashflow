'use client'

import { useFinanceStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  categories: { id: string; name: string }[]
  accounts: { id: string; name: string }[]
}

export function TransactionFilters({ categories, accounts }: Props) {
  const { filters, setFilters, resetFilters } = useFinanceStore()

  const hasFilters =
    filters.startDate || filters.endDate || filters.type || filters.category || filters.account || filters.search

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="filter-start" className="text-xs">Início</Label>
          <Input
            id="filter-start"
            type="date"
            className="w-36"
            value={filters.startDate ?? ''}
            onChange={(e) => setFilters({ startDate: e.target.value || undefined })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-end" className="text-xs">Fim</Label>
          <Input
            id="filter-end"
            type="date"
            className="w-36"
            value={filters.endDate ?? ''}
            onChange={(e) => setFilters({ endDate: e.target.value || undefined })}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Tipo</Label>
          <Select
            value={filters.type ?? ''}
            onValueChange={(v) => setFilters({ type: (v || undefined) as Props['categories'] extends (infer T)[] ? string : never })}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="income">Entrada</SelectItem>
              <SelectItem value="expense">Saída</SelectItem>
              <SelectItem value="transfer">Transferência</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Categoria</Label>
          <Select
            value={filters.category ?? ''}
            onValueChange={(v) => setFilters({ category: v || undefined })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Conta</Label>
          <Select
            value={filters.account ?? ''}
            onValueChange={(v) => setFilters({ account: v || undefined })}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-search" className="text-xs">Buscar</Label>
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
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
