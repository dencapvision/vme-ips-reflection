'use client'

import { Icons } from '@/components/Icons'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] font-['Sarabun',sans-serif]">
        กำลังโหลด...
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}

type Tab = 'member' | 'admin'

function LoginContent() {
  const searchParams = useSearchParams()
  const initialTab: Tab = searchParams.get('tab') === 'admin' ? 'admin' : 'member'

  const [tab, setTab]             = useState<Tab>(initialTab)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(searchParams.get('message') ?? '')

  useEffect(() => {
    setError('')
  }, [tab])

  // ── Member login ──────────────────────────────────────────────────────────
  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/member-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'เกิดข้อผิดพลาด')
      window.location.href = '/'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Admin login ───────────────────────────────────────────────────────────
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'เกิดข้อผิดพลาด')
      window.location.href = data.redirect ?? '/admin/users'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] font-['Sarabun',sans-serif] p-4 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-10 relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white shadow-xl">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">IPS Reflection</h1>
          <p className="text-gray-400 text-sm">อาสาสมัครการศึกษาเพื่อศีลธรรม (Volunteers for Moral Education : VME)</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-7 gap-1">
          {(['member', 'admin'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                tab === t
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'member' ? 'สมาชิก' : 'ผู้ดูแลระบบ'}
            </button>
          ))}
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded-r-xl flex items-start gap-2">
            <span className="shrink-0 mt-0.5">❌</span>
            <p>{error}</p>
          </div>
        )}

        {/* ── Member Form ────────────────────────────────────────────────────── */}
        {tab === 'member' && (
          <form onSubmit={handleMemberLogin} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">ชื่อ</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  required
                  placeholder="ชื่อจริง"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none text-sm transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">นามสกุล</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  required
                  placeholder="นามสกุล"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none text-sm transition-all"
                />
              </div>
            </div>

            <SubmitButton loading={loading} />

            <p className="text-center text-xs text-gray-400">
              ใช้ชื่อ-นามสกุลที่ลงทะเบียนกับเจ้าหน้าที่เท่านั้น
            </p>
          </form>
        )}

        {/* ── Admin Form ─────────────────────────────────────────────────────── */}
        {tab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">อีเมล</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icons.mail size={18} stroke="#9ca3af" />
                </span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">รหัสผ่าน</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icons.key size={18} stroke="#9ca3af" />
                </span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none text-sm transition-all"
                />
              </div>
            </div>

            <SubmitButton loading={loading} />
          </form>
        )}
      </div>
    </div>
  )
}

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-200/50 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          กำลังเข้าสู่ระบบ...
        </>
      ) : (
        'เข้าสู่ระบบ'
      )}
    </button>
  )
}
