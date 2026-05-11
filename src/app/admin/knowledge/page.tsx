'use client'
import { useState, useEffect, useCallback } from 'react'

const CATEGORIES = [
    'หลักสูตร IPS', 'คู่มือผู้ชวน', 'บทเรียน VME',
    'คุณครูไม่ใหญ่', 'คุณครูไม่เล็ก', 'Flow Learning',
    'กรณีศึกษา', 'แผนยุทธศาสตร์', 'ทั่วไป',
]

interface KnowledgeFile {
    filename: string
    category: string
    chunks: number
    uploadedAt: string
}

interface UploadResult {
    filename: string
    pages: number
    chunks: number
    category: string
    status: 'success' | 'error'
    error?: string
}

export default function KnowledgeAdminPage() {
    const [files, setFiles] = useState<File[]>([])
    const [category, setCategory] = useState('หลักสูตร IPS')
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentFile, setCurrentFile] = useState('')
    const [results, setResults] = useState<UploadResult[]>([])
    const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([])
    const [loadingFiles, setLoadingFiles] = useState(true)

    const loadFiles = useCallback(async () => {
        setLoadingFiles(true)
        try {
            const res = await fetch('/api/knowledge/list')
            const data = await res.json()
            setKnowledgeFiles(data.files || [])
        } finally {
            setLoadingFiles(false)
        }
    }, [])

    useEffect(() => { loadFiles() }, [loadFiles])

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(Array.from(e.target.files || []).filter(f =>
            f.name.toLowerCase().endsWith('.pdf')
        ))
    }

    const uploadAll = async () => {
        if (!files.length || uploading) return
        setUploading(true)
        setResults([])

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            setCurrentFile(file.name)
            setProgress(Math.round((i / files.length) * 100))
            try {
                const form = new FormData()
                form.append('file', file)
                form.append('category', category)
                const res = await fetch('/api/knowledge/upload', { method: 'POST', body: form })
                const data = await res.json()
                setResults(prev => [...prev, {
                    ...(data.result || {}),
                    filename: file.name,
                    status: data.success ? 'success' : 'error',
                    error: data.error,
                }])
            } catch (err: any) {
                setResults(prev => [...prev, {
                    filename: file.name, pages: 0, chunks: 0, category,
                    status: 'error', error: err.message,
                }])
            }
            await new Promise(r => setTimeout(r, 1000))
        }

        setProgress(100)
        setCurrentFile('')
        setUploading(false)
        loadFiles()
    }

    const deleteFile = async (filename: string) => {
        if (!confirm(`ลบ "${filename}" ออกจากคลัง?`)) return
        await fetch('/api/knowledge/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename }),
        })
        loadFiles()
    }

    return (
        <div className="min-h-screen bg-[#FDF9FF] p-6">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B68FD6] to-[#F2A2C0] flex items-center justify-center text-white text-2xl shadow-sm">
                        📚
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#4A345E]">จัดการคลังความรู้</h1>
                        <p className="text-sm text-[#8E6DA1] mt-0.5">
                            อัปโหลด PDF เพื่อฝึกฝน <span className="font-semibold text-[#A67BCA]">น้องแก้วใส</span> ให้ฉลาดขึ้น
                        </p>
                    </div>
                </div>

                {/* Upload Card */}
                <div className="bg-white rounded-2xl border border-[#E5D5F2] p-6 shadow-sm">
                    <h2 className="font-semibold text-[#4A345E] mb-4">อัปโหลด PDF ใหม่</h2>

                    <div className="mb-4">
                        <label className="text-sm text-[#8E6DA1] block mb-1">หมวดหมู่หนังสือ</label>
                        <select
                            className="w-full border border-[#E5D5F2] rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-[#B68FD6] focus:border-transparent outline-none transition-all"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <label
                        htmlFor="pdf-input"
                        className="flex flex-col items-center justify-center border-2 border-dashed
                       border-[#E5D5F2] rounded-xl p-8 cursor-pointer hover:border-[#B68FD6]
                       hover:bg-[#F9F1FF] transition-all mb-4"
                    >
                        <span className="text-3xl mb-2">📄</span>
                        <span className="text-sm text-[#6A5A7A] font-medium">คลิกเพื่อเลือกไฟล์ PDF</span>
                        <span className="text-xs text-[#8E6DA1] mt-1">เลือกได้หลายไฟล์พร้อมกัน</span>
                        <input
                            id="pdf-input" type="file" accept=".pdf"
                            multiple className="hidden" onChange={handleSelect}
                        />
                    </label>

                    {files.length > 0 && (
                        <div className="mb-4 bg-[#F9F1FF] rounded-xl p-3 border border-[#E5D5F2]">
                            <p className="text-xs font-semibold text-[#8E6DA1] mb-2 uppercase tracking-wider">เลือกแล้ว {files.length} ไฟล์</p>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                {files.map((f, i) => (
                                    <div key={i} className="flex justify-between text-xs text-[#6A5A7A]">
                                        <span className="truncate pr-4">{f.name}</span>
                                        <span className="ml-2 shrink-0 font-medium">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {uploading && (
                        <div className="mb-4">
                            <p className="text-xs text-[#A67BCA] mb-1.5 font-medium truncate italic">⏳ กำลังประมวลผล: {currentFile}</p>
                            <div className="w-full bg-[#F0E9F1] rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-[#B68FD6] to-[#F2A2C0] h-full rounded-full transition-all duration-500 shadow-sm"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={uploadAll}
                        disabled={!files.length || uploading}
                        className="w-full bg-gradient-to-r from-[#A67BCA] to-[#B68FD6] hover:from-[#966BB1] hover:to-[#A67BCA] disabled:from-gray-300 disabled:to-gray-400
                       text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.98]"
                    >
                        {uploading ? `กำลังประมวลผล ${progress}%...` : `🚀 เริ่มประมวลผล ${files.length || 0} ไฟล์`}
                    </button>
                </div>

                {/* Results */}
                {results.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="font-semibold text-gray-800 mb-3">ผลลัพธ์</h2>
                        <div className="space-y-2">
                            {results.map((r, i) => (
                                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl text-sm ${r.status === 'success' ? 'bg-green-50' : 'bg-red-50'
                                    }`}>
                                    <span>{r.status === 'success' ? '✅' : '❌'}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{r.filename}</p>
                                        {r.status === 'success'
                                            ? <p className="text-xs text-gray-500">{r.pages} หน้า · {r.chunks} chunks · {r.category}</p>
                                            : <p className="text-xs text-red-600">{r.error}</p>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-3 pt-3 border-t">
                            สำเร็จ {results.filter(r => r.status === 'success').length}/{results.length} ไฟล์ ·{' '}
                            รวม {results.reduce((s, r) => s + (r.chunks || 0), 0)} chunks
                        </p>
                    </div>
                )}

                {/* Knowledge Files List */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-gray-800">ไฟล์ในคลัง ({knowledgeFiles.length})</h2>
                        <button onClick={loadFiles} className="text-xs text-orange-500 hover:underline">รีเฟรช</button>
                    </div>

                    {loadingFiles ? (
                        <p className="text-sm text-gray-400 text-center py-4">กำลังโหลด...</p>
                    ) : knowledgeFiles.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">ยังไม่มีไฟล์ในคลัง</p>
                    ) : (
                        <div className="space-y-2">
                            {knowledgeFiles.map((f, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex-1 min-w-0 mr-3">
                                        <p className="text-sm font-medium text-gray-800 truncate">📄 {f.filename}</p>
                                        <p className="text-xs text-gray-400">
                                            {f.category} · {f.chunks} chunks ·{' '}
                                            {new Date(f.uploadedAt).toLocaleDateString('th-TH')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => deleteFile(f.filename)}
                                        className="text-xs text-red-400 hover:text-red-600 shrink-0"
                                    >
                                        ลบ
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}