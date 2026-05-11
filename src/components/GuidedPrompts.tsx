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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 bg-white rounded-2xl shadow-xl p-4 w-64 border border-[#E5D5F2] animate-fade-in-up">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-[#4A345E]">💬 คุยกับน้องแก้วใส</h3>
            <button onClick={() => setIsOpen(false)} className="text-[#8E6DA1] hover:text-[#4A345E]">✕</button>
          </div>
          <div className="space-y-2">
            {PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handlePromptClick(prompt)}
                className="w-full text-left px-4 py-2 text-sm bg-[#F9F1FF] hover:bg-[#F0E9F1] text-[#4A345E] rounded-xl transition-colors border border-transparent hover:border-[#E5D5F2]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-[#B68FD6] to-[#F2A2C0] rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-105 transition-transform active:scale-95"
        title="คุยกับน้องแก้วใส"
      >
        ✨
      </button>
    </div>
  )
}
