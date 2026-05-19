'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const PROMPTS = [
  '🙏 กำลังใจจากหลวงพ่อ',
  '✨ คำพูดเพิ่มพลังบวก',
  '🌟 ความดีสากล',
  '🤝 หน้าที่กัลยาณมิตร',
  '🧘 ฝึกสติ และสมาธิ'
]

export default function GuidedPrompts() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  if (pathname?.startsWith('/card/')) {
    return null
  }

  const handlePromptClick = (prompt: string) => {
    const cleanPrompt = prompt.replace(/^[^\s]+\s/, '') // Remove emoji for the query
    router.push(`/library?q=${encodeURIComponent(cleanPrompt)}`)
    setIsOpen(false)
  }

  return (
    <div 
      className="guided-prompts-container"
      style={{
        position: 'fixed',
        bottom: '96px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      }}
    >
      {isOpen && (
        <div className="mb-4 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-5 w-72 border border-[#E5D5F2] animate-fade-in-up">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[#B68FD6] text-lg">🙏</span>
              <h3 className="text-sm font-bold text-[#4A345E]">คุยกับน้องแก้วใส</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#FDF9FF] text-[#8E6DA1] transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2.5">
            {PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handlePromptClick(prompt)}
                className="w-full text-left px-4 py-3 text-xs bg-[#FDF9FF] hover:bg-[#F3E8FF] text-[#4A345E] rounded-2xl transition-all border border-[#E5D5F2] hover:border-[#B68FD6] hover:translate-x-1"
              >
                {prompt}
              </button>
            ))}
          </div>
          <p className="mt-4 text-[10px] text-center text-[#8E6DA1] opacity-70">
            น้องแก้วใสยินดีต้อนรับทุกท่านค่ะ 🙏
          </p>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #B68FD6 0%, #F2A2C0 100%)',
          borderRadius: '50%',
          boxShadow: '0 12px 24px rgba(182, 143, 214, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '28px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        className="hover:scale-110 active:scale-95 group relative"
        title="คุยกับน้องแก้วใส"
      >
        <span className="group-hover:rotate-12 transition-transform">🙏</span>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  )
}
