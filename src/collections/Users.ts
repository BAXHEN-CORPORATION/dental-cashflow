import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Operator', value: 'operator' },
      ],
      defaultValue: 'operator',
      required: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  access: {
    // Only admin can create users
    create: ({ req: { user } }) => user?.role === 'admin',
    // Admin sees all, operator sees self
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { id: { equals: user?.id } }
    },
    // Only admin can update users
    update: ({ req: { user } }) => user?.role === 'admin',
    // Prevent hard delete — use active: false instead
    delete: () => false,
  },
}
