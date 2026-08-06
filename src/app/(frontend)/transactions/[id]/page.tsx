import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { TransactionForm } from '@/components/finance/transaction-form'

interface Props {
  params: Promise<{ id: string }>
}

async function getData(id: string) {
  const h = await headers()
  const host = h.get('host') || 'localhost:3000'
  const proto = host.includes('localhost') ? 'http' : 'https'

  const [txRes, catRes, accRes, pmRes] = await Promise.all([
    fetch(`${proto}://${host}/api/transactions/${id}`, {
      headers: { Cookie: h.get('cookie') || '' },
    }),
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

  if (!txRes.ok) notFound()

  const tx = await txRes.json()
  const catData = catRes.ok ? await catRes.json() : { docs: [] }
  const accData = accRes.ok ? await accRes.json() : { docs: [] }
  const pmData = pmRes.ok ? await pmRes.json() : { docs: [] }

  return {
    transaction: tx,
    relatedData: {
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
    },
  }
}

export default async function EditTransactionPage({ params }: Props) {
  const { id } = await params
  const { transaction, relatedData } = await getData(id)

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Editar Movimentação</h1>
      <TransactionForm
        relatedData={relatedData}
        defaultValues={{
          transactionDate: transaction.transactionDate,
          type: transaction.type,
          description: transaction.description,
          category: transaction.category,
          amountInCents: transaction.amountInCents,
          paymentMethod: transaction.paymentMethod,
          account: typeof transaction.account === 'object' ? transaction.account.id : transaction.account,
          destinationAccount: transaction.destinationAccount
            ? (typeof transaction.destinationAccount === 'object'
              ? transaction.destinationAccount.id
              : transaction.destinationAccount)
            : undefined,
          guideNumber: transaction.guideNumber,
          guideAmountInCents: transaction.guideAmountInCents,
          notes: transaction.notes,
        }}
        isEdit
        transactionId={id}
      />
    </div>
  )
}
