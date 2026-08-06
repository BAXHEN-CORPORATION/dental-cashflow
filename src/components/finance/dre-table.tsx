import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { type DRE } from '@/lib/finance/calculate-dre'
import { formatCurrency } from '@/lib/finance/money'

interface Props {
  dre: DRE | null
}

export function DRETable({ dre }: Props) {
  if (!dre) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Selecione um período para visualizar o DRE.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>DRE — {dre.period}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Receitas */}
        <div>
          <h3 className="mb-2 font-medium text-green-600">Receitas</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dre.revenue.items.map((item) => (
                <TableRow key={item.label}>
                  <TableCell>{item.label}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(item.amountInCents)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-medium">
                <TableCell>Total Receitas</TableCell>
                <TableCell className="text-right tabular-nums text-green-600">
                  {formatCurrency(dre.revenue.totalInCents)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Separator />

        {/* Despesas */}
        <div>
          <h3 className="mb-2 font-medium text-red-600">Despesas</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dre.expenses.items.map((item) => (
                <TableRow key={item.label}>
                  <TableCell>{item.label}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(item.amountInCents)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-medium">
                <TableCell>Total Despesas</TableCell>
                <TableCell className="text-right tabular-nums text-red-600">
                  {formatCurrency(dre.expenses.totalInCents)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Separator />

        {/* Resultado */}
        <div className="flex items-center justify-between rounded-md bg-muted p-4">
          <span className="font-semibold">Resultado Líquido</span>
          <span
            className={`text-xl font-bold tabular-nums ${
              dre.netResultInCents >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(dre.netResultInCents)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
