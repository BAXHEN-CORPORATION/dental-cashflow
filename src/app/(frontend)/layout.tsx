import React from 'react'
import './styles.css'
import { AppShell } from '@/components/layout/app-shell'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  description: 'Dental Cashflow — Gestão financeira para clínicas',
  title: 'Dental Cashflow',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="pt-BR">
      <body>
        <AppShell>{children}</AppShell>
        <Toaster richColors closeButton />
      </body>
    </html>
  )
}
