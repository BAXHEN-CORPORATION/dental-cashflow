import React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import './styles.css'
import { AppShell } from '@/components/layout/app-shell'
import { Toaster } from '@/components/ui/sonner'
import configPromise from '@payload-config'

export const metadata = {
  description: 'Dental Cashflow — Gestão financeira para clínicas',
  title: 'Dental Cashflow',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  // Auth check
  try {
    const h = await headers()
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: h })

    if (!user) {
      redirect('/admin/login')
    }
  } catch {
    redirect('/admin/login')
  }

  return (
    <html lang="pt-BR">
      <body>
        <AppShell>{children}</AppShell>
        <Toaster richColors closeButton />
      </body>
    </html>
  )
}
