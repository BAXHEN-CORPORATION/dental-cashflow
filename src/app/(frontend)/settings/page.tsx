import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Tags, Wallet, CreditCard } from 'lucide-react'

const sections = [
  {
    href: '/admin/collections/categories',
    title: 'Categorias',
    description: 'Gerencie categorias de receitas e despesas',
    icon: Tags,
  },
  {
    href: '/admin/collections/accounts',
    title: 'Contas',
    description: 'Gerencie contas (caixa, banco, cartão)',
    icon: Wallet,
  },
  {
    href: '/admin/collections/payment-methods',
    title: 'Formas de Pagamento',
    description: 'Gerencie métodos de pagamento',
    icon: CreditCard,
  },
]

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">{section.title}</CardTitle>
                <ArrowRight className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <section.icon className="size-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
