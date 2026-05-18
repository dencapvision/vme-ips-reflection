import { NextResponse } from 'next/server'
import { listLibraryVideos, addLibraryVideo, deleteLibraryVideo } from '@/lib/library'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function requireAdmin(req: Request) {
  const cookie = req.headers.get('cookie') ?? ''
  const token = cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1)

  const session = token ? await verifySession(decodeURIComponent(token)) : null
  return session?.type === 'admin'
}

export async function GET() {
  try {
    const videos = await listLibraryVideos()
    return NextResponse.json({ videos })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    if (!(await requireAdmin(req))) {
      return NextResponse.json({ error: 'Admin session required' }, { status: 401 })
    }
    const body = await req.json()
    const video = await addLibraryVideo(body)
    return NextResponse.json({ success: true, video })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    if (!(await requireAdmin(req))) {
      return NextResponse.json({ error: 'Admin session required' }, { status: 401 })
    }
    const { id } = await req.json()
    const result = await deleteLibraryVideo(id)
    return NextResponse.json({ success: true, result })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
