'use client'

import { Icons } from '@/components/Icons'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function WelcomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#FBF7F1] font-['Sarabun',sans-serif] overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-100/40 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-32 flex flex-col items-center text-center">
        {/* Hero Section */}
        <div className="animate-fade-in-up">
          <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold tracking-wide uppercase">
            Platform การสรุปบทเรียนและทบทวนความรู้
          </div>
          
          <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-10 group">
            {/* Animated Glow effect */}
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-[60px] group-hover:bg-amber-400/40 transition-all duration-1000 animate-pulse"></div>
            
            {/* Logo Container */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl transition-transform duration-700 group-hover:scale-105">
              <img 
                src="/logo.png" 
                alt="IPS Reflection Logo" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/10 via-transparent to-white/20"></div>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 tracking-tight leading-tight">
            <span className="text-[#1B365D]">VME</span> · <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 animate-gradient">IPS Reflection</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-14 leading-relaxed font-light">
            ยกระดับการเรียนรู้ด้วยระบบสรุปบทเรียนอัจฉริยะ 
            ที่จะเปลี่ยน <span className="font-semibold text-gray-900 italic">"ความรู้"</span> ให้เป็น <span className="font-semibold text-gray-900 italic">"ความสำเร็จ"</span> ที่จับต้องได้จริง
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/login" 
              className="px-12 py-5 bg-gradient-to-r from-[#1B365D] to-[#0F2042] text-white rounded-2xl font-bold text-xl shadow-[0_20px_50px_rgba(27,54,93,0.2)] hover:shadow-[0_20px_60px_rgba(27,54,93,0.3)] hover:-translate-y-1.5 transition-all active:scale-95 flex items-center justify-center gap-3 group"
            >
              เริ่มต้นใช้งาน
              <Icons.arrow className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <Link 
              href="/login?mode=email" 
              className="px-12 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold text-xl shadow-xl hover:bg-gray-50 hover:border-amber-200 hover:-translate-y-1.5 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              แผงควบคุมระบบ
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {[
            { icon: <Icons.book />, title: 'บันทึกบทเรียน', desc: 'สรุปหัวใจสำคัญจาก VME ในแบบของคุณ' },
            { icon: <Icons.target />, title: 'วางแผนปฏิบัติ', desc: 'เปลี่ยนความเข้าใจให้เป็น Action Plan ที่ชัดเจน' },
            { icon: <Icons.spark />, title: 'AI ผู้ช่วย', desc: 'คุยกับ "น้องแก้วใส" เพื่อต่อยอดไอเดียของคุณ' }
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-amber-100/30 to-transparent pointer-events-none"></div>
    </div>
  )
}
