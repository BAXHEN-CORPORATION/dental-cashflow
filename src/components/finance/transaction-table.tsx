'use client'

import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { useFinanceStore } from '@/lib/store'
import { formatCurrency } from '@/lib/finance/money'

interface Transaction {
  id: string
  transactionDate: string
  type: 'income' | 'expense' | 'transfer'
  description: string
  amountInCents: number
  category?: { id?: number; name?: string } | string | number
  account: { id?: number; name?: string } | string | number
  destinationAccount?: { id?: number; name?: string } | string | number
}

interface Props {
  transactions: Transaction[]
}

const typeLabel: Record<string, string> = {
  income: 'Entrada',
  expense: 'Saída',
  transfer: 'Transferência',
}

const typeVariant: Record<string, 'default' | 'destructive' | 'secondary'> = {
  income: 'default',
  expense: 'destructive',
  transfer: 'secondary',
}

const amountClass: Record<string, string> = {
  income: 'text-green-600 tabular-nums',
  expense: 'text-red-600 tabular-nums',
  transfer: 'text-muted-foreground tabular-nums',
}

function getCategoryName(category: Transaction['category']): string {
  if (!category) return '—'
  if (typeof category === 'object') return category.name ?? String(category.id ?? '')
  return String(category)
}

function getAccountName(account: Transaction['account']): string {
  if (typeof account === 'object') return account.name ?? String(account.id ?? '')
  return String(account)
}

export function TransactionTable({ transactions }: Props) {
  const { openDeleteDialog } = useFinanceStore()

  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Nenhuma movimentação encontrada.
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Data</TableHead>
            <TableHead className="w-24">Tipo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Conta</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="tabular-nums whitespace-nowrap">
                {new Date(String(tx.transactionDate).substring(0, 10) + 'T00:00:00').toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                <Badge variant={typeVariant[tx.type]}>
                  {typeLabel[tx.type]}
                </Badge>
              </TableCell>
              <TableCell className="max-w-48 truncate">{tx.description}</TableCell>
              <TableCell>{getCategoryName(tx.category)}</TableCell>
              <TableCell>{getAccountName(tx.account)}</TableCell>
              <TableCell className={`text-right ${amountClass[tx.type]}`}>
                {tx.type === 'income' ? '+' : tx.type === 'expense' ? '−' : '⇄'}{' '}
                {formatCurrency(tx.amountInCents)}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" render={<Link href={`/transactions/${tx.id}`} />} nativeButton={false}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(tx.id)}
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
