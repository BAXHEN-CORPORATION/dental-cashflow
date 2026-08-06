import { headers } from 'next/headers'
import { BalanceCard } from '@/components/finance/balance-card'
import { DailySummaryTable } from '@/components/finance/daily-summary'
import { MonthlySummaryTable } from '@/components/finance/monthly-summary'
import { calculateAllDailySummaries } from '@/lib/finance/calculate-daily-summary'
import { calculateAllMonthlySummaries } from '@/lib/finance/calculate-monthly-summary'
import { calculateAccountBalance } from '@/lib/finance/calculate-balance'
import { calculateNetCashFlow } from '@/lib/finance/calculate-balance'
import type { FinanceTransaction } from '@/lib/finance/types'

async function getData() {
  const h = await headers()
  const host = h.get('host') || 'localhost:3000'
  const proto = host.includes('localhost') ? 'http' : 'https'

  // Fetch all data from Payload API
  const [txRes, accountsRes] = await Promise.all([
    fetch(`${proto}://${host}/api/transactions?limit=5000`, {
      headers: { Cookie: h.get('cookie') || '' },
    }),
    fetch(`${proto}://${host}/api/accounts`, {
      headers: { Cookie: h.get('cookie') || '' },
    }),
  ])

  const txData = txRes.ok ? await txRes.json() : { docs: [] }
  const accountsData = accountsRes.ok ? await accountsRes.json() : { docs: [] }

  const transactions: FinanceTransaction[] = txData.docs.map((tx: Record<string, unknown>) => ({
    id: tx.id as string,
    transactionDate: String(tx.transactionDate).substring(0, 10), // normalize to YYYY-MM-DD
    type: tx.type as 'income' | 'expense' | 'transfer',
    description: tx.description as string,
    category: (tx.category as { name?: string } | string | undefined)
      ? (typeof tx.category === 'object' ? (tx.category as { name: string }).name : (tx.category as string))
      : undefined,
    amountInCents: tx.amountInCents as number,
    account: (tx.account as { id?: string } | string | undefined)
      ? (typeof tx.account === 'object' ? (tx.account as { id: string }).id : (tx.account as string))
      : '',
    destinationAccount: (tx.destinationAccount as { id?: string } | undefined)
      ? (tx.destinationAccount as { id: string }).id
      : undefined,
    createdBy: (tx.createdBy as string) || '',
  }))

  const accounts = accountsData.docs.map((a: Record<string, unknown>) => ({
    id: a.id as string,
    name: a.name as string,
    balanceInCents: calculateAccountBalance(transactions, a.id as string, (a.initialBalance as number) || 0),
  }))

  const overallBalance = calculateNetCashFlow(transactions)
  const dailySummaries = calculateAllDailySummaries(transactions).slice(-30)
  const monthlySummaries = calculateAllMonthlySummaries(transactions).slice(-12)

  return { accounts, overallBalance, dailySummaries, monthlySummaries }
}

export default async function DashboardPage() {
  const { accounts, overallBalance, dailySummaries, monthlySummaries } = await getData()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <BalanceCard accounts={accounts} overallBalance={overallBalance} />

      <div className="grid gap-6 lg:grid-cols-2">
        <DailySummaryTable summaries={dailySummaries} />
        <MonthlySummaryTable summaries={monthlySummaries} />
      </div>
    </div>
  )
}
