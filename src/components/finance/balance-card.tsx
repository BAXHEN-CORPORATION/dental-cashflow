import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/finance/money'

interface AccountBalance {
  id: string
  name: string
  balanceInCents: number
}

interface Props {
  accounts: AccountBalance[]
  overallBalance: number
}

export function BalanceCard({ accounts, overallBalance }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Saldo Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold tabular-nums ${
              overallBalance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(overallBalance)}
          </p>
        </CardContent>
      </Card>

      {accounts.map((account) => (
        <Card key={account.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {account.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold tabular-nums ${
                account.balanceInCents >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(account.balanceInCents)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
