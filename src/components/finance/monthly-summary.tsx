import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type MonthlySummary } from '@/lib/finance/calculate-monthly-summary'
import { formatCurrency } from '@/lib/finance/money'

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

interface Props {
  summaries: MonthlySummary[]
}

export function MonthlySummaryTable({ summaries }: Props) {
  if (summaries.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhum dado para o período selecionado.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Caixa Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mês</TableHead>
              <TableHead className="text-right">Entradas</TableHead>
              <TableHead className="text-right">Saídas</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
              <TableHead className="text-right">Movimentações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaries.map((m) => (
              <TableRow key={`${m.year}-${m.month}`}>
                <TableCell>
                  {MONTHS[m.month - 1]} / {m.year}
                </TableCell>
                <TableCell className="text-right tabular-nums text-green-600">
                  {formatCurrency(m.totalIncome)}
                </TableCell>
                <TableCell className="text-right tabular-nums text-red-600">
                  {formatCurrency(m.totalExpense)}
                </TableCell>
                <TableCell
                  className={`text-right tabular-nums font-medium ${
                    m.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(m.netCashFlow)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {m.transactionCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
