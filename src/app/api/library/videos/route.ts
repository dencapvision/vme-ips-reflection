import { NextResponse } from 'next/server'
import { listLibraryVideos, addLibraryVideo, deleteLibraryVideo } from '@/lib/library'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    const body = await req.json()
    const video = await addLibraryVideo(body)
    return NextResponse.json({ success: true, video })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const result = await deleteLibraryVideo(id)
    return NextResponse.json({ success: true, result })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
