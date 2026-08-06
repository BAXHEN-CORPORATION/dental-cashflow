import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()

    const transaction = await payload.update({
      collection: 'transactions',
      id,
      data: body,
      overrideAccess: false,
    })

    return NextResponse.json(transaction)
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : 'Erro ao atualizar' },
      { status: 400 },
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config: configPromise })

    await payload.delete({
      collection: 'transactions',
      id,
      overrideAccess: false,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : 'Erro ao excluir' },
      { status: 400 },
    )
  }
}
