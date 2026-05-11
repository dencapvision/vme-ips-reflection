'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PROMPTS = [
  'กำลังใจจากหลวงพ่อ',
  'ขอคำพูดพลังบวก',
  'คำเชิญชวน',
  'บทเรียน VME ที่น่าสนใจ'
]

export default function GuidedPrompts() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handlePromptClick = (prompt: string) => {
    // You could navigate to library chat with pre-filled query, 
    // or open a global modal. For now, navigate to library:
    router.push(`/library?q=${encodeURIComponent(prompt)}`)
    setIsOpen(false)
  }

  return (
    <div 
      className="guided-prompts-container"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      }}
    >
      {isOpen && (
        <div className="mb-4 bg-white rounded-2xl shadow-xl p-4 w-64 border border-amber-100 animate-fade-in-up">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-amber-900">💬 คุยกับน้องแก้วใส</h3>
            <button onClick={() => setIsOpen(false)} className="text-amber-400 hover:text-amber-600">✕</button>
          </div>
          <div className="space-y-2">
            {PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handlePromptClick(prompt)}
                className="w-full text-left px-4 py-2 text-sm bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl transition-colors border border-transparent hover:border-amber-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          borderRadius: '50%',
          boxShadow: '0 10px 25px rgba(217, 119, 6, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        className="hover:scale-105 active:scale-95"
        title="คุยกับน้องแก้วใส"
      >
        ✨
      </button>
    </div>
  )
}
