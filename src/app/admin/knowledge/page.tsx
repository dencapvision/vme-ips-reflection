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

interface UserProfile {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string
    role: string
    created_at: string
}

export default function KnowledgeAdminPage() {
    const [activeTab, setActiveTab] = useState<'knowledge' | 'users'>('knowledge')
    
    // Knowledge State
    const [files, setFiles] = useState<File[]>([])
    const [category, setCategory] = useState('หลักสูตร IPS')
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentFile, setCurrentFile] = useState('')
    const [results, setResults] = useState<UploadResult[]>([])
    const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([])
    const [loadingFiles, setLoadingFiles] = useState(true)

    // Users State
    const [users, setUsers] = useState<UserProfile[]>([])
    const [loadingUsers, setLoadingUsers] = useState(true)
    const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' })
    const [creatingUser, setCreatingUser] = useState(false)

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

    const loadUsers = useCallback(async () => {
        setLoadingUsers(true)
        try {
            const res = await fetch('/api/admin/users')
            const data = await res.json()
            setUsers(data.profiles || [])
        } finally {
            setLoadingUsers(false)
        }
    }, [])

    useEffect(() => {
        if (activeTab === 'knowledge') loadFiles()
        else loadUsers()
    }, [activeTab, loadFiles, loadUsers])

    // --- Knowledge Handlers ---
    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(Array.from(e.target.files || []).filter(f => f.name.toLowerCase().endsWith('.pdf')))
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

    // --- User Handlers ---
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setCreatingUser(true)
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newUser, role: 'สมาชิก' })
            })
            const data = await res.json()
            if (!data.success) throw new Error(data.error)
            
            alert('สร้างสมาชิกสำเร็จ!')
            setNewUser({ firstName: '', lastName: '', email: '', password: '', phone: '' })
            loadUsers()
        } catch (err: any) {
            alert(`Error: ${err.message}`)
        } finally {
            setCreatingUser(false)
        }
    }

    const handleUpdateRole = async (id: string, role: string) => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, role })
            })
            if (res.ok) loadUsers()
        } catch (err) {
            alert('อัปเดตสถานะไม่สำเร็จ')
        }
    }

    return (
        <div className="min-h-screen bg-[#FDF9FF] p-6">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B68FD6] to-[#F2A2C0] flex items-center justify-center text-white text-2xl shadow-sm">
                        ⚙️
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#4A345E]">ระบบผู้ดูแล (Admin)</h1>
                        <p className="text-sm text-[#8E6DA1] mt-0.5">จัดการคลังความรู้ และสมาชิกของระบบ</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-[#E5D5F2] pb-px">
                    <button 
                        onClick={() => setActiveTab('knowledge')}
                        className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'knowledge' ? 'border-[#B68FD6] text-[#4A345E]' : 'border-transparent text-[#8E6DA1] hover:text-[#6A5A7A]'}`}
                    >
                        📚 จัดการคลังความรู้
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'users' ? 'border-[#B68FD6] text-[#4A345E]' : 'border-transparent text-[#8E6DA1] hover:text-[#6A5A7A]'}`}
                    >
                        👥 จัดการสมาชิก
                    </button>
                </div>

                {/* KNOWLEDGE TAB */}
                {activeTab === 'knowledge' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Upload Card */}
                        <div className="bg-white rounded-2xl border border-[#E5D5F2] p-6 shadow-sm h-fit">
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
                                    <div className="space-y-1 max-h-32 overflow-y-auto">
                                        {files.map((f, i) => (
                                            <div key={i} className="flex justify-between text-xs text-[#6A5A7A]">
                                                <span className="truncate pr-4">{f.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {uploading && (
                                <div className="mb-4">
                                    <p className="text-xs text-[#A67BCA] mb-1.5 font-medium">⏳ กำลังประมวลผล: {currentFile}</p>
                                    <div className="w-full bg-[#F0E9F1] rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-[#B68FD6] to-[#F2A2C0] h-full rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={uploadAll}
                                disabled={!files.length || uploading}
                                className="w-full bg-gradient-to-r from-[#A67BCA] to-[#B68FD6] hover:from-[#966BB1] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                            >
                                {uploading ? `กำลังประมวลผล ${progress}%...` : `🚀 เริ่มประมวลผล ${files.length || 0} ไฟล์`}
                            </button>
                        </div>

                        {/* List Card */}
                        <div className="bg-white rounded-2xl border border-[#E5D5F2] p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold text-[#4A345E]">ไฟล์ในคลัง ({knowledgeFiles.length})</h2>
                                <button onClick={loadFiles} className="text-xs text-[#F2A2C0] hover:underline">รีเฟรช</button>
                            </div>

                            {loadingFiles ? (
                                <p className="text-sm text-center py-4 text-[#8E6DA1]">กำลังโหลด...</p>
                            ) : (
                                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                    {knowledgeFiles.map((f, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-[#F9F1FF] rounded-xl border border-[#E5D5F2]">
                                            <div className="flex-1 min-w-0 mr-3">
                                                <p className="text-sm font-medium text-[#4A345E] truncate">{f.filename}</p>
                                                <p className="text-xs text-[#8E6DA1]">
                                                    {f.category} · {f.chunks} chunks
                                                </p>
                                            </div>
                                            <button onClick={() => deleteFile(f.filename)} className="text-xs text-red-400 hover:text-red-600">ลบ</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* USERS TAB */}
                {activeTab === 'users' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Create User Form */}
                        <div className="md:col-span-1 bg-white rounded-2xl border border-[#E5D5F2] p-6 shadow-sm h-fit">
                            <h2 className="font-semibold text-[#4A345E] mb-4">เพิ่มสมาชิกใหม่</h2>
                            <form onSubmit={handleCreateUser} className="space-y-3">
                                <div>
                                    <label className="text-xs text-[#8E6DA1] block mb-1">ชื่อ</label>
                                    <input required type="text" value={newUser.firstName} onChange={e=>setNewUser({...newUser, firstName: e.target.value})} className="w-full border border-[#E5D5F2] rounded-lg px-3 py-2 text-sm focus:border-[#B68FD6] outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs text-[#8E6DA1] block mb-1">นามสกุล</label>
                                    <input required type="text" value={newUser.lastName} onChange={e=>setNewUser({...newUser, lastName: e.target.value})} className="w-full border border-[#E5D5F2] rounded-lg px-3 py-2 text-sm focus:border-[#B68FD6] outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs text-[#8E6DA1] block mb-1">เบอร์โทรศัพท์</label>
                                    <input required type="text" value={newUser.phone} onChange={e=>setNewUser({...newUser, phone: e.target.value})} className="w-full border border-[#E5D5F2] rounded-lg px-3 py-2 text-sm focus:border-[#B68FD6] outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs text-[#8E6DA1] block mb-1">อีเมล (ใช้ล็อกอิน)</label>
                                    <input required type="email" value={newUser.email} onChange={e=>setNewUser({...newUser, email: e.target.value})} className="w-full border border-[#E5D5F2] rounded-lg px-3 py-2 text-sm focus:border-[#B68FD6] outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs text-[#8E6DA1] block mb-1">รหัสผ่าน</label>
                                    <input required type="password" value={newUser.password} onChange={e=>setNewUser({...newUser, password: e.target.value})} className="w-full border border-[#E5D5F2] rounded-lg px-3 py-2 text-sm focus:border-[#B68FD6] outline-none" />
                                </div>
                                <button type="submit" disabled={creatingUser} className="w-full mt-4 bg-gradient-to-r from-[#A67BCA] to-[#B68FD6] text-white py-2.5 rounded-lg font-bold text-sm shadow-md disabled:opacity-50">
                                    {creatingUser ? 'กำลังสร้าง...' : 'เพิ่มสมาชิก'}
                                </button>
                            </form>
                        </div>

                        {/* Users List */}
                        <div className="md:col-span-2 bg-white rounded-2xl border border-[#E5D5F2] p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold text-[#4A345E]">รายชื่อสมาชิก ({users.length})</h2>
                                <button onClick={loadUsers} className="text-xs text-[#F2A2C0] hover:underline">รีเฟรช</button>
                            </div>
                            
                            {loadingUsers ? (
                                <p className="text-sm text-center py-4 text-[#8E6DA1]">กำลังโหลด...</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-[#E5D5F2] text-[#8E6DA1]">
                                                <th className="pb-3 font-medium">ชื่อ-นามสกุล</th>
                                                <th className="pb-3 font-medium">ติดต่อ</th>
                                                <th className="pb-3 font-medium">สถานะ</th>
                                                <th className="pb-3 font-medium">จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#F0E9F1]">
                                            {users.map(user => (
                                                <tr key={user.id}>
                                                    <td className="py-3 text-[#4A345E] font-medium">
                                                        {user.first_name} {user.last_name}
                                                    </td>
                                                    <td className="py-3 text-[#6A5A7A] text-xs">
                                                        {user.email}<br/>{user.phone}
                                                    </td>
                                                    <td className="py-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                            user.role === 'Admin' ? 'bg-[#F2A2C0] text-white' : 
                                                            user.role === 'สมาชิก' ? 'bg-[#B68FD6] text-white' : 
                                                            'bg-[#F0E9F1] text-[#8E6DA1]'
                                                        }`}>
                                                            {user.role || 'ทั่วไป'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3">
                                                        <select 
                                                            value={user.role || 'ทั่วไป'} 
                                                            onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                                            className="text-xs border border-[#E5D5F2] rounded px-2 py-1 outline-none focus:border-[#B68FD6]"
                                                        >
                                                            <option value="ทั่วไป">ทั่วไป (รออนุมัติ)</option>
                                                            <option value="สมาชิก">สมาชิก (ใช้งานได้)</option>
                                                            <option value="Admin">แอดมิน</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}