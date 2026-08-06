import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type DailySummary } from '@/lib/finance/calculate-daily-summary'
import { formatCurrency } from '@/lib/finance/money'

interface Props {
  summaries: DailySummary[]
}

export function DailySummaryTable({ summaries }: Props) {
  if (summaries.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhum dado para o período selecionado.
        </CardContent>
      </Card>
    )
  }

  let runningBalance = 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Caixa Diário</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Entradas</TableHead>
              <TableHead className="text-right">Saídas</TableHead>
              <TableHead className="text-right">Saldo do Dia</TableHead>
              <TableHead className="text-right">Saldo Acumulado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaries.map((day) => {
              runningBalance += day.netCashFlow
              return (
                <TableRow key={day.date}>
                  <TableCell className="tabular-nums whitespace-nowrap">
                    {new Date(day.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-green-600">
                    {formatCurrency(day.totalIncome)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-red-600">
                    {formatCurrency(day.totalExpense)}
                  </TableCell>
                  <TableCell
                    className={`text-right tabular-nums font-medium ${
                      day.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(day.netCashFlow)}
                  </TableCell>
                  <TableCell
                    className={`text-right tabular-nums ${
                      runningBalance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(runningBalance)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
