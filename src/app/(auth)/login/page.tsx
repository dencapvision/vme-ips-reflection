'use client'

import { Icons } from '@/components/Icons'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { loginWithEmail } from '@/app/actions/auth'

import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fafafa] font-['Sarabun',sans-serif] p-4">กำลังโหลด...</div>}>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const message = searchParams.get('message')
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(message || '')

  useEffect(() => {
    if (message) setError(message)
  }, [message])

  const handleNameLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login-by-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, phone }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
      }

      window.location.href = '/'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] font-['Sarabun',sans-serif] p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-10 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-200/50 mb-6">
            <Icons.lotus size={32} stroke="white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IPS Reflection</h1>
          <p className="text-gray-500">สมุดสรุปบทเรียนและเครื่องมือช่วยสอน VME</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg flex items-start gap-3 animate-shake">
            <span className="font-bold">❌</span>
            <p>{error}</p>
          </div>
        )}

        {mode === 'email' ? (
          <form action={loginWithEmail} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">อีเมล</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                   <Icons.mail size={20} stroke="#9ca3af" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="admin@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">รหัสผ่าน</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                   <Icons.key size={20} stroke="#9ca3af" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-200/50 hover:-translate-y-0.5 transition-all active:scale-[0.98] mt-4"
            >
              เข้าสู่ระบบ
            </button>

            <Link
              href="/login"
              className="block text-center text-sm font-medium text-gray-500 hover:text-amber-600 transition-colors"
            >
              เข้าใช้งานด้วยชื่อ-นามสกุล
            </Link>
          </form>
        ) : (
          <form onSubmit={handleNameLogin} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">ชื่อ</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  required
                  placeholder="ชื่อ"
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">นามสกุล</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  required
                  placeholder="นามสกุล"
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">เบอร์โทรศัพท์ (ถ้ามี)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                   <Icons.phone size={20} stroke="#9ca3af" />
                </div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="08x-xxx-xxxx"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-200/50 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:translate-y-0 mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                'เข้าสู่ระบบ'
              )}
            </button>

            <Link
              href="/login?mode=email"
              className="block text-center text-sm font-medium text-gray-500 hover:text-amber-600 transition-colors"
            >
              สำหรับผู้ดูแลระบบ (อีเมล)
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}
