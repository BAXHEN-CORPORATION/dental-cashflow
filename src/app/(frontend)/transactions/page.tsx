import Link from 'next/link'
import { headers } from 'next/headers'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TransactionTable } from '@/components/finance/transaction-table'
import { TransactionFilters } from '@/components/finance/transaction-filters'

async function getData() {
  const h = await headers()
  const host = h.get('host') || 'localhost:3000'
  const proto = host.includes('localhost') ? 'http' : 'https'

  const [txRes, catRes, accRes] = await Promise.all([
    fetch(`${proto}://${host}/api/transactions?limit=100&sort=-createdAt`, {
      headers: { Cookie: h.get('cookie') || '' },
    }),
    fetch(`${proto}://${host}/api/categories?limit=50`, {
      headers: { Cookie: h.get('cookie') || '' },
    }),
    fetch(`${proto}://${host}/api/accounts?limit=20`, {
      headers: { Cookie: h.get('cookie') || '' },
    }),
  ])

  const txData = txRes.ok ? await txRes.json() : { docs: [] }
  const catData = catRes.ok ? await catRes.json() : { docs: [] }
  const accData = accRes.ok ? await accRes.json() : { docs: [] }

  return {
    transactions: txData.docs,
    categories: catData.docs,
    accounts: accData.docs,
  }
}

export default async function TransactionsPage() {
  const { transactions, categories, accounts } = await getData()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Movimentações</h1>
        <Button asChild>
          <Link href="/transactions/new">
            <Plus className="mr-2 size-4" />
            Nova
          </Link>
        </Button>
      </div>

      <TransactionFilters categories={categories} accounts={accounts} />
      <TransactionTable transactions={transactions} />
    </div>
  )
}
