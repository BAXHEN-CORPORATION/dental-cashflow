import type { CollectionConfig } from 'payload'

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  admin: {
    useAsTitle: 'description',
    defaultColumns: ['transactionDate', 'type', 'description', 'amountInCents', 'account'],
  },
  fields: [
    {
      name: 'transactionDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Entrada', value: 'income' },
        { label: 'Saída', value: 'expense' },
        { label: 'Transferência', value: 'transfer' },
      ],
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      minLength: 3,
      maxLength: 250,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        condition: (data) => data?.type !== 'transfer',
      },
    },
    {
      name: 'amountInCents',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        description: 'Valor em centavos (ex: R$ 350,75 = 35075)',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (typeof value === 'number' && !Number.isInteger(value)) {
              return Math.round(value)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'paymentMethod',
      type: 'relationship',
      relationTo: 'payment-methods',
      admin: {
        condition: (data) => data?.type !== 'transfer',
      },
    },
    {
      name: 'account',
      type: 'relationship',
      relationTo: 'accounts',
      required: true,
    },
    {
      name: 'destinationAccount',
      type: 'relationship',
      relationTo: 'accounts',
      admin: {
        condition: (data) => data?.type === 'transfer',
      },
    },
    {
      name: 'guideNumber',
      type: 'text',
      admin: {
        description: 'Número da guia (apenas para categoria Convênio)',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (typeof value === 'string') return value.trim()
            return value
          },
        ],
      },
    },
    {
      name: 'guideAmountInCents',
      type: 'number',
      min: 1,
      admin: {
        description: 'Valor da guia em centavos',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      maxLength: 1000,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ req, operation }) => {
            if (operation === 'create' && req?.user) {
              return req.user.id
            }
          },
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // Transfer: clear category, paymentMethod, guide fields
        if (data.type === 'transfer') {
          data.category = null
          data.paymentMethod = null
          data.guideNumber = null
          data.guideAmountInCents = null
        } else {
          // Non-transfer: clear destinationAccount
          data.destinationAccount = null
        }

        // If category is set, check requiresGuide constraint
        if (data.category) {
          try {
            const category = await req.payload.findByID({
              collection: 'categories',
              id: data.category,
            })

            if (category?.requiresGuide && !data.guideNumber) {
              throw new Error(
                `A categoria "${category.name}" exige número da guia.`,
              )
            }

            // If category doesn't require guide, clear guide fields
            if (!category?.requiresGuide) {
              data.guideNumber = null
              data.guideAmountInCents = null
            }
          } catch (err) {
            if (err instanceof Error && err.message.includes('exige número da guia')) {
              throw err
            }
            // If category not found or other error, let validation handle it
          }
        } else {
          // No category: clear guide fields
          data.guideNumber = null
          data.guideAmountInCents = null
        }

        // Transfer: validate accounts differ
        if (
          data.type === 'transfer' &&
          data.account &&
          data.destinationAccount &&
          data.account === data.destinationAccount
        ) {
          throw new Error('A conta de destino deve ser diferente da conta de origem.')
        }

        return data
      },
    ],
  },
  access: {
    create: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin' || user.role === 'operator'
    },
    read: ({ req: { user } }) => {
      if (!user) return false
      return true // All authenticated users can read
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin' || user.role === 'operator'
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin'
    },
  },
}
