import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import ExcelJS from 'exceljs'
import { formatCurrency } from '@/lib/finance/money'

function formatDate(d: string): string {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const url = new URL(req.url)
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')

    const where: Record<string, unknown> = {}
    if (startDate) where.transactionDate = { greater_than_equal: startDate }
    if (endDate) {
      where.transactionDate = { ...(where.transactionDate as object), less_than_equal: endDate }
    }

    const result = await payload.find({
      collection: 'transactions',
      where,
      limit: 10000,
      sort: 'transactionDate',
      req,
    })

    const transactions = result.docs
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Dental Cashflow'

    // Sheet 1: Resumo
    const summary = workbook.addWorksheet('Resumo')
    summary.columns = [
      { header: 'Métrica', key: 'label', width: 25 },
      { header: 'Valor', key: 'value', width: 20 },
    ]
    const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amountInCents, 0)
    const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amountInCents, 0)

    summary.addRow({ label: 'Período', value: `${startDate || '—'} a ${endDate || '—'}` })
    summary.addRow({ label: 'Gerado em', value: new Date().toLocaleDateString('pt-BR') })
    summary.addRow({})
    summary.addRow({ label: 'Total de Entradas', value: formatCurrency(income) })
    summary.addRow({ label: 'Total de Saídas', value: formatCurrency(expense) })
    summary.addRow({ label: 'Saldo', value: formatCurrency(income - expense) })

    // Sheet 2: Movimentações
    const txSheet = workbook.addWorksheet('Movimentações')
    txSheet.columns = [
      { header: 'Data', key: 'date', width: 12 },
      { header: 'Tipo', key: 'type', width: 14 },
      { header: 'Descrição', key: 'description', width: 35 },
      { header: 'Categoria', key: 'category', width: 20 },
      { header: 'Conta', key: 'account', width: 12 },
      { header: 'Forma de Pagamento', key: 'paymentMethod', width: 18 },
      { header: 'Valor', key: 'amount', width: 15 },
      { header: 'Nº Guia', key: 'guideNumber', width: 12 },
      { header: 'Observações', key: 'notes', width: 25 },
    ]

    for (const tx of transactions) {
      const row = txSheet.addRow({
        date: formatDate(tx.transactionDate),
        type: tx.type === 'income' ? 'Entrada' : tx.type === 'expense' ? 'Saída' : 'Transferência',
        description: tx.description,
        category: typeof tx.category === 'object' ? tx.category?.name : '',
        account: typeof tx.account === 'object' ? tx.account?.name : '',
        paymentMethod: typeof tx.paymentMethod === 'object' ? tx.paymentMethod?.name : '',
        amount: tx.amountInCents / 100,
        guideNumber: tx.guideNumber || '',
        notes: tx.notes || '',
      })
      row.getCell('amount').numFmt = 'R$ #,##0.00'
    }
    txSheet.views = [{ state: 'frozen', ySplit: 1 }]
    txSheet.autoFilter = { from: 'A1', to: `I${transactions.length + 1}` }

    // Sheet 3: Receitas
    const inSheet = workbook.addWorksheet('Receitas')
    inSheet.columns = [
      { header: 'Data', key: 'date', width: 12 },
      { header: 'Descrição', key: 'description', width: 40 },
      { header: 'Categoria', key: 'category', width: 20 },
      { header: 'Valor', key: 'amount', width: 15 },
    ]
    for (const tx of transactions.filter((t) => t.type === 'income')) {
      const row = inSheet.addRow({
        date: formatDate(tx.transactionDate),
        description: tx.description,
        category: typeof tx.category === 'object' ? tx.category?.name : '',
        amount: tx.amountInCents / 100,
      })
      row.getCell('amount').numFmt = 'R$ #,##0.00'
    }
    inSheet.views = [{ state: 'frozen', ySplit: 1 }]

    // Sheet 4: Despesas
    const outSheet = workbook.addWorksheet('Despesas')
    outSheet.columns = [
      { header: 'Data', key: 'date', width: 12 },
      { header: 'Descrição', key: 'description', width: 40 },
      { header: 'Categoria', key: 'category', width: 20 },
      { header: 'Valor', key: 'amount', width: 15 },
    ]
    for (const tx of transactions.filter((t) => t.type === 'expense')) {
      const row = outSheet.addRow({
        date: formatDate(tx.transactionDate),
        description: tx.description,
        category: typeof tx.category === 'object' ? tx.category?.name : '',
        amount: tx.amountInCents / 100,
      })
      row.getCell('amount').numFmt = 'R$ #,##0.00'
    }
    outSheet.views = [{ state: 'frozen', ySplit: 1 }]

    const buffer = await workbook.xlsx.writeBuffer()
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="cashflow-${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : 'Erro ao gerar exportação' },
      { status: 500 },
    )
  }
}
