'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface Props {
  startDate?: string
  endDate?: string
}

export function ExportButton({ startDate, endDate }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)

      const res = await fetch(`/api/export?${params.toString()}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Erro ao gerar exportação' }))
        throw new Error(err.message)
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cashflow-export-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Exportação concluída')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao exportar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleExport} disabled={loading} variant="outline">
      <Download className="mr-2 size-4" />
      {loading ? 'Gerando...' : 'Exportar Excel'}
    </Button>
  )
}
