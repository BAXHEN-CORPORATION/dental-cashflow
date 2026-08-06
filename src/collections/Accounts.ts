import type { CollectionConfig } from 'payload'

export const Accounts: CollectionConfig = {
  slug: 'accounts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'active'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Dinheiro', value: 'cash' },
        { label: 'Banco', value: 'bank' },
        { label: 'Cartão', value: 'card' },
        { label: 'Outro', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'initialBalance',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Saldo inicial em centavos (ex: R$ 100,00 = 10000)',
      },
    },
    {
      name: 'openingDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString().split('T')[0],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  access: {
    create: ({ req: { user } }) => user?.role === 'admin',
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
}
