import { NextResponse } from 'next/server'
import { listLibraryLinks, addLibraryLink, deleteLibraryLink } from '@/lib/library'

export async function GET() {
  try {
    const links = await listLibraryLinks()
    return NextResponse.json({ links })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const link = await addLibraryLink(body)
    return NextResponse.json({ success: true, link })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const result = await deleteLibraryLink(id)
    return NextResponse.json({ success: true, result })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
