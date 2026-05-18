'use client'
import { useState, useRef, useEffect } from 'react'

type UploadJob = {
  id:     string
  name:   string
  type:   'pdf' | 'drive' | 'youtube'
  pct:    number
  stage:  string
  detail: string
  status: 'uploading' | 'processing' | 'done' | 'error'
  docId?: string
}

type KnowledgeDoc = {
  id:          string
  title:       string
  filename:    string
  chunk_count: number
  status:      string
  category:    string
  source_type: string
  created_at:  string
}

const CATEGORIES = ['ทั่วไป', 'รวมหนังสือคำสอนหลวงพ่อคุณครูไม่ใหญ่', 'รวมหนังสือคำสอนหลวงพ่อคุณครูไม่เล็ก', 'หลักสูตร IPS', 'นโยบายองค์กร', 'คู่มือการใช้งาน', 'วิดีโอ YouTube', 'Google Drive']

export default function AdminKnowledgePage() {
  const [tab,       setTab]       = useState<'upload' | 'list'>('upload')
  const [uploadTab, setUploadTab] = useState<'pdf' | 'drive' | 'youtube'>('pdf')
  const [jobs,      setJobs]      = useState<UploadJob[]>([])
  const [docs,      setDocs]      = useState<KnowledgeDoc[]>([])
  const [loading,   setLoading]   = useState(false)
  const [dragOver,  setDragOver]  = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title,      setTitle]      = useState('')
  const [category,   setCategory]   = useState('ทั่วไป')
  const [driveUrl,   setDriveUrl]   = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [files,      setFiles]      = useState<File[]>([])

  useEffect(() => { fetchDocs() }, [])

  async function fetchDocs() {
    try {
      const res = await fetch('/api/knowledge/list', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) {
        console.error('[fetchDocs] API error:', data)
        alert(`โหลดรายการไม่สำเร็จ: ${data.message || data.error}\n\nตรวจสอบ: ต้อง run SQL migration 002_knowledge_documents.sql ใน Supabase ก่อน`)
        return
      }
      console.log('[fetchDocs]', data.total ?? data.documents?.length ?? 0, 'docs')
      setDocs(data.documents || [])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[fetchDocs] network error:', msg)
    }
  }

  async function uploadPDFs() {
    if (!files.length) return
    setLoading(true)

    for (const file of files) {
      const jobId = crypto.randomUUID()
      setJobs(prev => [...prev, {
        id: jobId, name: file.name, type: 'pdf',
        pct: 0, stage: 'uploading', detail: 'กำลังส่งไฟล์...',
        status: 'uploading'
      }])

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const result = reader.result as string
            resolve(result.split(',')[1]) // Extract base64 part
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        const res = await fetch('/api/knowledge/upload', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64,
            filename: file.name,
            title: title || file.name.replace(/\.pdf$/i, ''),
            category
          })
        })

        if (!res.ok) {
          const err = await res.json()
          updateJob(jobId, { status: 'error', detail: err.message, pct: 0 })
          continue
        }

        await streamProgress(res, jobId)
      } catch (err: any) {
        updateJob(jobId, { status: 'error', detail: err.message, pct: 0 })
      }
    }

    setFiles([])
    setTitle('')
    setLoading(false)
  }

  async function uploadDrive() {
    if (!driveUrl) return
    setLoading(true)
    const jobId = crypto.randomUUID()

    setJobs(prev => [...prev, {
      id: jobId, name: title || 'Google Drive PDF', type: 'drive',
      pct: 0, stage: 'downloading', detail: 'กำลังดาวน์โหลดจาก Drive...',
      status: 'uploading'
    }])

    const res = await fetch('/api/knowledge/drive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driveUrl, title, category })
    })

    if (!res.ok) {
      const err = await res.json()
      updateJob(jobId, { status: 'error', detail: err.message })
      setLoading(false)
      return
    }

    await streamProgress(res, jobId)
    setDriveUrl('')
    setTitle('')
    setLoading(false)
  }

  async function uploadYoutube() {
    if (!youtubeUrl) return
    setLoading(true)
    const jobId = crypto.randomUUID()

    setJobs(prev => [...prev, {
      id: jobId, name: title || 'YouTube Video', type: 'youtube',
      pct: 0, stage: 'transcript', detail: 'กำลังดึง transcript...',
      status: 'uploading'
    }])

    const res = await fetch('/api/knowledge/youtube', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ youtubeUrl, title, category })
    })

    if (!res.ok) {
      const err = await res.json()
      updateJob(jobId, { status: 'error', detail: err.message })
      setLoading(false)
      return
    }

    await streamProgress(res, jobId)
    setYoutubeUrl('')
    setTitle('')
    setLoading(false)
  }

  async function streamProgress(res: Response, jobId: string) {
    const reader  = res.body!.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const lines = decoder.decode(value).split('\n')
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        try {
          const event = JSON.parse(line.slice(6))
          if (event.stage === 'complete' || event.stage === 'done') {
            updateJob(jobId, { pct: 100, status: 'done', detail: event.detail || '✅ พร้อมใช้งาน', docId: event.documentId })
            // รอ 800ms แล้ว refresh + สลับ tab
            setTimeout(() => {
              fetchDocs()
              setTab('list')
            }, 800)
          } else if (event.stage === 'error') {
            updateJob(jobId, { status: 'error', detail: event.detail || 'เกิดข้อผิดพลาด', pct: 0 })
            fetchDocs() // refresh แม้ error — document ยังอยู่ใน DB (status=error)
          } else if (event.stage === 'queued') {
            updateJob(jobId, { pct: event.pct || 3, stage: event.stage, detail: event.detail || '', status: 'processing' })
            // Document ถูก insert แล้ว — refresh ทันทีให้ tab แสดงจำนวนถูกต้อง
            setTimeout(() => fetchDocs(), 500)
          } else {
            updateJob(jobId, { pct: event.pct || 0, stage: event.stage, detail: event.detail || '', status: 'processing' })
          }
        } catch {}
      }
    }
  }

  function updateJob(id: string, patch: Partial<UploadJob>) {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...patch } : j))
  }

  async function deleteDoc(id: string) {
    if (!confirm('ลบเอกสารนี้? จะลบ chunks ทั้งหมดออกจากฐานความรู้')) return
    await fetch('/api/knowledge/list', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    fetchDocs()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf')
    if (dropped.length) setFiles(prev => [...prev, ...dropped])
  }

  const statusColor = (s: UploadJob['status']) =>
    s === 'done' ? '#1D9E75' : s === 'error' ? '#E24B4A' : '#378ADD'

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-bold">จัดการคลังความรู้</h1>
          <p className="text-slate-400 text-sm mt-1">น้องแก้วใส RAG — VME-IPS Knowledge Base</p>
        </div>

        {/* Main Tab */}
        <div className="flex gap-1 bg-slate-800 p-1 rounded-xl mb-6 w-fit">
          {(['upload', 'list'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              {t === 'upload' ? '+ เพิ่มความรู้' : `📚 ไฟล์ในคลัง (${docs.length})`}
            </button>
          ))}
        </div>

        {/* ── UPLOAD TAB ── */}
        {tab === 'upload' && (
          <div className="space-y-5">
            {/* Source type tabs */}
            <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700">
              {[
                { key: 'pdf',     label: '📄 อัปโหลด PDF' },
                { key: 'drive',   label: '🔗 ลิงก์ Drive' },
                { key: 'youtube', label: '▶️ วิดีโอ YouTube' }
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setUploadTab(key as 'pdf' | 'drive' | 'youtube')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${uploadTab === key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Common fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">ชื่อเอกสาร (ไม่บังคับ)</label>
                <input value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="ใส่ชื่อ หรือใช้ชื่อไฟล์อัตโนมัติ"
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">หมวดหมู่</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* PDF Upload */}
            {uploadTab === 'pdf' && (
              <div>
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${dragOver ? 'border-blue-400 bg-blue-500/10' : 'border-slate-600 hover:border-slate-400'}`}>
                  <div className="text-4xl mb-3">📄</div>
                  <p className="text-white font-medium">คลิกเพื่อเลือก หรือลาก PDF มาวางที่นี่</p>
                  <p className="text-slate-400 text-sm mt-1">เลือกได้หลายไฟล์พร้อมกัน (สูงสุด 30MB/ไฟล์)</p>
                  <input ref={fileInputRef} type="file" accept=".pdf" multiple className="hidden"
                    onChange={e => { if (e.target.files) setFiles(Array.from(e.target.files)) }} />
                </div>

                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-800 rounded-xl px-4 py-2">
                        <span className="text-sm text-white">📄 {f.name}</span>
                        <span className="text-xs text-slate-400">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                      </div>
                    ))}
                    <button onClick={uploadPDFs} disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all mt-2">
                      {loading ? 'กำลังประมวลผล...' : `⚡ เริ่มประมวลผล ${files.length} ไฟล์`}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Drive */}
            {uploadTab === 'drive' && (
              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">ลิงก์ Google Drive (ต้องตั้งเป็น Anyone with link)</label>
                  <input value={driveUrl} onChange={e => setDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
                <button onClick={uploadDrive} disabled={loading || !driveUrl}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all">
                  {loading ? 'กำลังดาวน์โหลด...' : '🔗 นำเข้าจาก Google Drive'}
                </button>
              </div>
            )}

            {/* YouTube */}
            {uploadTab === 'youtube' && (
              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">YouTube URL (วิดีโอต้องมี subtitle/caption)</label>
                  <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
                <button onClick={uploadYoutube} disabled={loading || !youtubeUrl}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all">
                  {loading ? 'กำลังดึง transcript...' : '▶️ นำเข้า YouTube Transcript'}
                </button>
              </div>
            )}

            {/* Progress Jobs */}
            {jobs.length > 0 && (
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-300">สถานะการประมวลผล</h3>
                  <button onClick={() => setJobs(jobs.filter(j => j.status !== 'done' && j.status !== 'error'))}
                    className="text-xs text-slate-500 hover:text-slate-300">ล้างที่เสร็จแล้ว</button>
                </div>
                {jobs.map(job => (
                  <div key={job.id} className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-white truncate max-w-xs">{job.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{job.detail}</p>
                      </div>
                      <span className="text-sm font-bold" style={{ color: statusColor(job.status) }}>
                        {job.status === 'done' ? '✅' : job.status === 'error' ? '❌' : `${job.pct}%`}
                      </span>
                    </div>
                    {job.status !== 'done' && job.status !== 'error' && (
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all duration-300"
                          style={{ width: `${job.pct}%`, backgroundColor: statusColor(job.status) }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── LIST TAB ── */}
        {tab === 'list' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-slate-400 text-sm">{docs.length} เอกสารในคลัง</p>
              <button onClick={fetchDocs} className="text-blue-400 text-sm hover:text-blue-300">🔄 รีเฟรช</button>
            </div>
            {docs.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <div className="text-5xl mb-3">📭</div>
                <p>ยังไม่มีเอกสารในคลัง</p>
              </div>
            ) : (
              <div className="space-y-3">
                {docs.map(doc => (
                  <div key={doc.id} className="bg-slate-800 rounded-2xl p-4 border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-2xl flex-shrink-0">
                        {doc.source_type === 'youtube' ? '▶️' : doc.source_type === 'google_drive' ? '🔗' : '📄'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{doc.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{doc.category}</span>
                          <span className="text-xs text-slate-400">{doc.chunk_count ?? 0} chunks</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            doc.status === 'ready'      ? 'bg-green-900/50 text-green-400' :
                            doc.status === 'error'      ? 'bg-red-900/50 text-red-400' :
                                                          'bg-blue-900/50 text-blue-400'
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deleteDoc(doc.id)}
                      className="text-slate-500 hover:text-red-400 ml-3 flex-shrink-0 transition-colors text-lg">🗑</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
