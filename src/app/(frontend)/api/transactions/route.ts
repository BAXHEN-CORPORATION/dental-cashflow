import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()

    const transaction = await payload.create({
      collection: 'transactions',
      data: body,
      overrideAccess: false,
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : 'Erro ao criar movimentação' },
      { status: 400 },
    )
  }
}
