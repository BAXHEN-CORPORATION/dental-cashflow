'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
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
import { useFinanceStore } from '@/lib/store'

export function DeleteTransactionDialog() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { deleteDialogOpen, transactionToDelete, closeDeleteDialog } = useFinanceStore()

  async function handleDelete() {
    if (!transactionToDelete) return
    setLoading(true)
    try {
      const res = await fetch(`/api/transactions/${transactionToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Erro ao excluir')
      }
      toast.success('Movimentação excluída')
      closeDeleteDialog()
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => !open && closeDeleteDialog()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir movimentação?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Apenas administradores podem excluir
            movimentações.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
