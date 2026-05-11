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
          
          <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 group cursor-pointer">
            {/* Golden Sphere Background with animated glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600 rounded-full shadow-[0_0_80px_rgba(245,158,11,0.4)] group-hover:shadow-[0_0_100px_rgba(245,158,11,0.6)] transition-all duration-700"></div>
            
            {/* Inner glass layer */}
            <div className="absolute inset-2 bg-white/20 backdrop-blur-md rounded-full border border-white/40 flex items-center justify-center overflow-hidden">
              <Icons.lotus size={64} stroke="white" fill="white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            VME · <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">IPS Reflection</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            ยกระดับการเรียนรู้ด้วยระบบสรุปบทเรียนอัจฉริยะ 
            พร้อมเครื่องมือที่จะเปลี่ยนความรู้ให้เป็นผลลัพธ์ที่จับต้องได้
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/login" 
              className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-2xl hover:bg-gray-800 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 group"
            >
              เริ่มต้นใช้งาน
              <Icons.arrow className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/login?mode=email" 
              className="px-10 py-5 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold text-lg shadow-lg hover:bg-gray-50 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              สำหรับผู้ดูแลระบบ
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
