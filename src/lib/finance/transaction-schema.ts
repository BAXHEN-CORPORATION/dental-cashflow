import { z } from 'zod'

export const transactionSchema = z
  .object({
    transactionDate: z.string().min(1, 'Informe a data'),
    type: z.enum(['income', 'expense', 'transfer']),
    description: z.string().trim().min(3, 'Mínimo 3 caracteres').max(250, 'Máximo 250 caracteres'),
    category: z.string().optional(),
    amountInCents: z.number().int('Deve ser inteiro').positive('Deve ser positivo'),
    paymentMethod: z.string().optional(),
    account: z.string().min(1, 'Informe a conta'),
    destinationAccount: z.string().optional(),
    guideNumber: z.string().trim().optional(),
    guideAmountInCents: z.number().int().positive().optional(),
    notes: z.string().trim().max(1000, 'Máximo 1000 caracteres').optional(),
  })
  .superRefine((data, ctx) => {
    // Income/Expense: category required
    if (data.type !== 'transfer' && !data.category) {
      ctx.addIssue({
        code: 'custom',
        path: ['category'],
        message: 'Informe a categoria',
      })
    }

    // Transfer: destinationAccount required
    if (data.type === 'transfer' && !data.destinationAccount) {
      ctx.addIssue({
        code: 'custom',
        path: ['destinationAccount'],
        message: 'Informe a conta de destino',
      })
    }

    // Transfer: accounts must differ
    if (
      data.type === 'transfer' &&
      data.account &&
      data.destinationAccount &&
      data.account === data.destinationAccount
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['destinationAccount'],
        message: 'A conta de destino deve ser diferente',
      })
    }

    // Guide number requires category "convenio" (by name or slug)
    // Validated in Payload hook since we need to resolve the relationship
    if (data.guideNumber && !data.category) {
      ctx.addIssue({
        code: 'custom',
        path: ['guideNumber'],
        message: 'Número da guia requer categoria',
      })
    }

    // Guide amount requires guide number
    if (data.guideAmountInCents && !data.guideNumber) {
      ctx.addIssue({
        code: 'custom',
        path: ['guideAmountInCents'],
        message: 'Valor da guia requer número da guia',
      })
    }
  })

export type TransactionInput = z.infer<typeof transactionSchema>
