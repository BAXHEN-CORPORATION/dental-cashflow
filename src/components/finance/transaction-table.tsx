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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Transaction {
  id: string
  transactionDate: string
  type: 'income' | 'expense' | 'transfer'
  description: string
  amountInCents: number
  category?: { name: string } | string
  account: { name: string } | string
  destinationAccount?: { name: string } | string
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
  return typeof category === 'object' ? category.name : category
}

function getAccountName(account: Transaction['account']): string {
  return typeof account === 'object' ? account.name : account
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
                {new Date(tx.transactionDate + 'T00:00:00').toLocaleDateString('pt-BR')}
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
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/transactions/${tx.id}`}>
                      <Pencil className="size-3.5" />
                    </Link>
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
