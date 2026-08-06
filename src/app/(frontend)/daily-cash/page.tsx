import { headers } from 'next/headers'
import { DailySummaryTable } from '@/components/finance/daily-summary'
import { calculateAllDailySummaries } from '@/lib/finance/calculate-daily-summary'
import type { FinanceTransaction } from '@/lib/finance/types'

async function getData() {
  const h = await headers()
  const host = h.get('host') || 'localhost:3000'
  const proto = host.includes('localhost') ? 'http' : 'https'

  const res = await fetch(`${proto}://${host}/api/transactions?limit=5000`, {
    headers: { Cookie: h.get('cookie') || '' },
  })

  const data = res.ok ? await res.json() : { docs: [] }

  const transactions: FinanceTransaction[] = data.docs.map((tx: Record<string, unknown>) => ({
    id: tx.id as string,
    transactionDate: String(tx.transactionDate).substring(0, 10),
    type: tx.type as 'income' | 'expense' | 'transfer',
    description: tx.description as string,
    amountInCents: tx.amountInCents as number,
    account: (tx.account as { id?: string } | string | undefined)
      ? (typeof tx.account === 'object' ? (tx.account as { id: string }).id : (tx.account as string))
      : '',
    createdBy: (tx.createdBy as string) || '',
  }))

  return calculateAllDailySummaries(transactions)
}

export default async function DailyCashPage() {
  const summaries = await getData()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Caixa Diário</h1>
      <DailySummaryTable summaries={summaries} />
    </div>
  )
}
