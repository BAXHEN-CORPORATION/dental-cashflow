'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { transactionSchema, type TransactionInput } from '@/lib/finance/transaction-schema'

interface RelatedData {
  categories: { id: string; name: string; type: string; requiresGuide?: boolean }[]
  accounts: { id: string; name: string }[]
  paymentMethods: { id: string; name: string }[]
}

interface Props {
  defaultValues?: Partial<TransactionInput>
  relatedData: RelatedData
  isEdit?: boolean
  transactionId?: string
}

export function TransactionForm({ defaultValues, relatedData, isEdit, transactionId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transactionDate: new Date().toISOString().split('T')[0],
      type: 'expense',
      ...defaultValues,
    },
  })

  const type = watch('type')
  const categoryId = watch('category')

  const selectedCategory = relatedData.categories.find((c) => c.id === categoryId)
  const showGuideFields = selectedCategory?.requiresGuide ?? false

  // Reset conditional fields on type change
  useEffect(() => {
    if (type === 'transfer') {
      setValue('category', undefined)
      setValue('paymentMethod', undefined)
      setValue('guideNumber', undefined)
      setValue('guideAmountInCents', undefined)
    } else {
      setValue('destinationAccount', undefined)
    }
  }, [type, setValue])

  // Clear guide fields when category changes away from requiresGuide
  useEffect(() => {
    if (!showGuideFields) {
      setValue('guideNumber', undefined)
      setValue('guideAmountInCents', undefined)
    }
  }, [categoryId, showGuideFields, setValue])

  async function onSubmit(data: TransactionInput) {
    setLoading(true)
    try {
      const url = isEdit
        ? `/api/transactions/${transactionId}`
        : '/api/transactions'
      const method = isEdit ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Erro ao salvar')
      }

      toast.success(isEdit ? 'Movimentação atualizada' : 'Movimentação criada')
      router.push('/transactions')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  const incomeCategories = relatedData.categories.filter((c) => c.type === 'income')
  const expenseCategories = relatedData.categories.filter((c) => c.type === 'expense')
  const categories = type === 'income' ? incomeCategories : expenseCategories

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Editar Movimentação' : 'Nova Movimentação'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Row 1: Date + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transactionDate">Data</Label>
              <Input
                id="transactionDate"
                type="date"
                {...register('transactionDate')}
              />
              {errors.transactionDate && (
                <p className="text-xs text-destructive">{errors.transactionDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={type}
                onValueChange={(v) => setValue('type', v as TransactionInput['type'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Entrada</SelectItem>
                  <SelectItem value="expense">Saída</SelectItem>
                  <SelectItem value="transfer">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" {...register('description')} />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Row 3: Account + Destination Account (transfer) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account">
                {type === 'transfer' ? 'Conta de Origem' : 'Conta'}
              </Label>
              <Select
                value={watch('account')}
                onValueChange={(v) => setValue('account', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {relatedData.accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.account && (
                <p className="text-xs text-destructive">{errors.account.message}</p>
              )}
            </div>

            {type === 'transfer' && (
              <div className="space-y-2">
                <Label htmlFor="destinationAccount">Conta de Destino</Label>
                <Select
                  value={watch('destinationAccount')}
                  onValueChange={(v) => setValue('destinationAccount', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {relatedData.accounts
                      .filter((a) => a.id !== watch('account'))
                      .map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.destinationAccount && (
                  <p className="text-xs text-destructive">
                    {errors.destinationAccount.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Row 4: Amount */}
          <div className="space-y-2">
            <Label htmlFor="amountInCents">Valor (R$)</Label>
            <Input
              id="amountInCents"
              type="number"
              step="0.01"
              placeholder="0,00"
              onChange={(e) => {
                const reais = parseFloat(e.target.value)
                if (!isNaN(reais)) {
                  setValue('amountInCents', Math.round(reais * 100))
                }
              }}
              defaultValue={
                defaultValues?.amountInCents
                  ? (defaultValues.amountInCents / 100).toFixed(2)
                  : undefined
              }
            />
            {errors.amountInCents && (
              <p className="text-xs text-destructive">{errors.amountInCents.message}</p>
            )}
          </div>

          {/* Row 5: Category + Payment Method (non-transfer only) */}
          {type !== 'transfer' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={watch('category') ?? ''}
                  onValueChange={(v) => setValue('category', v || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                        {c.requiresGuide ? ' (guia)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                <Select
                  value={watch('paymentMethod') ?? ''}
                  onValueChange={(v) => setValue('paymentMethod', v || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {relatedData.paymentMethods.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Row 6: Guide fields (only when category requires guide) */}
          {showGuideFields && (
            <div className="grid grid-cols-2 gap-4 rounded-md border p-3">
              <div className="space-y-2">
                <Label htmlFor="guideNumber">Número da Guia</Label>
                <Input id="guideNumber" {...register('guideNumber')} />
                {errors.guideNumber && (
                  <p className="text-xs text-destructive">{errors.guideNumber.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="guideAmountInCents">Valor da Guia (R$)</Label>
                <Input
                  id="guideAmountInCents"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  onChange={(e) => {
                    const reais = parseFloat(e.target.value)
                    if (!isNaN(reais)) {
                      setValue('guideAmountInCents', Math.round(reais * 100))
                    }
                  }}
                  defaultValue={
                    defaultValues?.guideAmountInCents
                      ? (defaultValues.guideAmountInCents / 100).toFixed(2)
                      : undefined
                  }
                />
                {errors.guideAmountInCents && (
                  <p className="text-xs text-destructive">
                    {errors.guideAmountInCents.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Row 7: Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" rows={2} {...register('notes')} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
