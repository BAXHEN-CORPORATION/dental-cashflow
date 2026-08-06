import { headers } from 'next/headers'
import { DRETable } from '@/components/finance/dre-table'
import { ExportButton } from '@/components/finance/export-button'
import { calculateDRE } from '@/lib/finance/calculate-dre'
import type { FinanceTransaction } from '@/lib/finance/types'

async function getData() {
  const h = await headers()
  const host = h.get('host') || 'localhost:3000'
  const proto = host.includes('localhost') ? 'http' : 'https'

  const [txRes, catRes] = await Promise.all([
    fetch(`${proto}://${host}/api/transactions?limit=5000`, {
      headers: { Cookie: h.get('cookie') || '' },
    }),
    fetch(`${proto}://${host}/api/categories?limit=50`, {
      headers: { Cookie: h.get('cookie') || '' },
    }),
  ])

  const txData = txRes.ok ? await txRes.json() : { docs: [] }
  const catData = catRes.ok ? await catRes.json() : { docs: [] }

  const categoryMap = new Map<string, string>()
  for (const c of catData.docs) {
    categoryMap.set(c.id as string, c.name as string)
  }

  const transactions: FinanceTransaction[] = txData.docs.map((tx: Record<string, unknown>) => ({
    id: tx.id as string,
    transactionDate: String(tx.transactionDate).substring(0, 10),
    type: tx.type as 'income' | 'expense' | 'transfer',
    description: tx.description as string,
    category: (tx.category as { id?: string } | string | undefined)
      ? (typeof tx.category === 'object' ? (tx.category as { id: string }).id : (tx.category as string))
      : undefined,
    categoryLabel: (tx.category as { name?: string } | string | undefined)
      ? (typeof tx.category === 'object' ? (tx.category as { name: string }).name : undefined)
      : undefined,
    amountInCents: tx.amountInCents as number,
    account: (tx.account as { id?: string } | string | undefined)
      ? (typeof tx.account === 'object' ? (tx.account as { id: string }).id : (tx.account as string))
      : '',
    createdBy: (tx.createdBy as string) || '',
  }))

  const today = new Date().toISOString().split('T')[0]
  const firstOfMonth = today.substring(0, 8) + '01'

  const dre = calculateDRE(transactions, firstOfMonth, today)

  return { dre, startDate: firstOfMonth, endDate: today }
}

export default async function ReportsPage() {
  const { dre, startDate, endDate } = await getData()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <ExportButton startDate={startDate} endDate={endDate} />
      </div>
      <DRETable dre={dre} />
    </div>
  )
}
