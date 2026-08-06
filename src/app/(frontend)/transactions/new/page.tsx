import { headers } from 'next/headers'
import { TransactionForm } from '@/components/finance/transaction-form'

async function getRelatedData() {
  const h = await headers()
  const host = h.get('host') || 'localhost:3000'
  const proto = host.includes('localhost') ? 'http' : 'https'

  const [catRes, accRes, pmRes] = await Promise.all([
    fetch(`${proto}://${host}/api/categories?where[active][equals]=true&limit=50`, {
      headers: { Cookie: h.get('cookie') || '' },
    }),
    fetch(`${proto}://${host}/api/accounts?where[active][equals]=true&limit=20`, {
      headers: { Cookie: h.get('cookie') || '' },
    }),
    fetch(`${proto}://${host}/api/payment-methods?where[active][equals]=true&limit=20`, {
      headers: { Cookie: h.get('cookie') || '' },
    }),
  ])

  const catData = catRes.ok ? await catRes.json() : { docs: [] }
  const accData = accRes.ok ? await accRes.json() : { docs: [] }
  const pmData = pmRes.ok ? await pmRes.json() : { docs: [] }

  return {
    categories: catData.docs.map((c: Record<string, unknown>) => ({
      id: String(c.id),
      name: c.name as string,
      type: c.type as string,
      requiresGuide: c.requiresGuide as boolean,
    })),
    accounts: accData.docs.map((a: Record<string, unknown>) => ({
      id: String(a.id),
      name: a.name as string,
    })),
    paymentMethods: pmData.docs.map((p: Record<string, unknown>) => ({
      id: String(p.id),
      name: p.name as string,
    })),
  }
}

export default async function NewTransactionPage() {
  const relatedData = await getRelatedData()

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Nova Movimentação</h1>
      <TransactionForm relatedData={relatedData} />
    </div>
  )
}
