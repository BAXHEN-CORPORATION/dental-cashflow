import type { Payload } from 'payload'

/**
 * Seed initial data for the cashflow MVP.
 * Uses upsert pattern — safe to run multiple times.
 */
export async function seed(payload: Payload): Promise<void> {
  console.log('🌱 Seeding initial data...')

  // ── Categories ────────────────────────────────────────────────
  const categories = [
    { name: 'Procedimentos', type: 'income' as const, requiresGuide: false, active: true, sortOrder: 1 },
    { name: 'Convênios', type: 'income' as const, requiresGuide: true, active: true, sortOrder: 2 },
    { name: 'Outras receitas', type: 'income' as const, requiresGuide: false, active: true, sortOrder: 3 },
    { name: 'Salários', type: 'expense' as const, requiresGuide: false, active: true, sortOrder: 1 },
    { name: 'Aluguel', type: 'expense' as const, requiresGuide: false, active: true, sortOrder: 2 },
    { name: 'Materiais', type: 'expense' as const, requiresGuide: false, active: true, sortOrder: 3 },
    { name: 'Água', type: 'expense' as const, requiresGuide: false, active: true, sortOrder: 4 },
    { name: 'Energia', type: 'expense' as const, requiresGuide: false, active: true, sortOrder: 5 },
    { name: 'Impostos', type: 'expense' as const, requiresGuide: false, active: true, sortOrder: 6 },
    { name: 'Outras despesas', type: 'expense' as const, requiresGuide: false, active: true, sortOrder: 7 },
  ]

  for (const cat of categories) {
    const existing = await payload.find({
      collection: 'categories',
      where: { name: { equals: cat.name } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'categories',
        id: existing.docs[0].id,
        data: cat,
      })
    } else {
      await payload.create({ collection: 'categories', data: cat })
    }
  }

  // ── Accounts ──────────────────────────────────────────────────
  const accounts = [
    { name: 'Caixa', type: 'cash' as const, initialBalance: 0, openingDate: new Date().toISOString().split('T')[0], active: true },
    { name: 'Banco', type: 'bank' as const, initialBalance: 0, openingDate: new Date().toISOString().split('T')[0], active: true },
    { name: 'Cartão', type: 'card' as const, initialBalance: 0, openingDate: new Date().toISOString().split('T')[0], active: true },
  ]

  for (const acc of accounts) {
    const existing = await payload.find({
      collection: 'accounts',
      where: { name: { equals: acc.name } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'accounts',
        id: existing.docs[0].id,
        data: acc,
      })
    } else {
      await payload.create({ collection: 'accounts', data: acc })
    }
  }

  // ── Payment Methods ───────────────────────────────────────────
  const methods = [
    { name: 'Dinheiro', active: true, sortOrder: 1 },
    { name: 'PIX', active: true, sortOrder: 2 },
    { name: 'Cartão de débito', active: true, sortOrder: 3 },
    { name: 'Cartão de crédito', active: true, sortOrder: 4 },
    { name: 'Transferência', active: true, sortOrder: 5 },
    { name: 'Boleto', active: true, sortOrder: 6 },
    { name: 'Convênio', active: true, sortOrder: 7 },
    { name: 'Outro', active: true, sortOrder: 8 },
  ]

  for (const method of methods) {
    const existing = await payload.find({
      collection: 'payment-methods',
      where: { name: { equals: method.name } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'payment-methods',
        id: existing.docs[0].id,
        data: method,
      })
    } else {
      await payload.create({ collection: 'payment-methods', data: method })
    }
  }

  console.log('✅ Seed complete:', {
    categories: categories.length,
    accounts: accounts.length,
    paymentMethods: methods.length,
  })
}
