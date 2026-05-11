'use client'
import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{
    title: string
    file: string
    pages: string
  }>
}

export default function LibraryAI() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams?.get('q') || ''
  
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'สวัสดีค่ะ! น้องแก้วใสพร้อมช่วยค้นหาข้อมูลจากคลังความรู้ให้แล้วค่ะ มีเรื่องอะไรอยากให้ช่วยค้นไหมคะ? ✨'
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery)
      sendMessage(initialQuery)
    }
  }, [initialQuery])

  const sendMessage = async (text: string = input) => {
    if (!text.trim() || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          history: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })

      const data = await res.json()
      
      if (data.error) throw new Error(data.error)

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer,
        sources: data.sources
      }])
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'ขออภัยค่ะ น้องแก้วใสพบข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้งนะคะ 😢'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] bg-white rounded-3xl border border-[#E5D5F2] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E5D5F2] bg-gradient-to-r from-[#FDF9FF] to-[#FFF5F8] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B68FD6] to-[#F2A2C0] flex items-center justify-center text-white shadow-sm">
          ✨
        </div>
        <div>
          <h2 className="font-bold text-[#4A345E]">น้องแก้วใส AI</h2>
          <p className="text-xs text-[#8E6DA1]">ผู้ช่วยค้นหาความรู้ VME</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FDF9FF]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-gradient-to-r from-[#A67BCA] to-[#B68FD6] text-white rounded-tr-none' 
                : 'bg-white border border-[#E5D5F2] text-[#4A345E] rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
              
              {/* Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#E5D5F2] space-y-2">
                  <p className="text-xs font-bold text-[#B68FD6]">📚 อ้างอิงจาก:</p>
                  {msg.sources.map((src, j) => (
                    <div key={j} className="text-xs bg-[#F9F1FF] p-2 rounded-lg text-[#8E6DA1]">
                      <span className="font-semibold text-[#6A5A7A]">{src.title}</span>
                      <br/>
                      ({src.file} หน้า {src.pages})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#E5D5F2] rounded-2xl rounded-tl-none p-4 shadow-sm">
              <div className="flex gap-1.5 items-center h-5">
                <div className="w-2 h-2 rounded-full bg-[#B68FD6] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#F2A2C0] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#B68FD6] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-[#E5D5F2]">
        <form 
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ถามน้องแก้วใสได้เลยค่ะ..."
            disabled={loading}
            className="flex-1 bg-[#FDF9FF] border border-[#E5D5F2] rounded-full px-5 py-3 text-sm text-[#4A345E] focus:outline-none focus:border-[#B68FD6] focus:ring-1 focus:ring-[#B68FD6] transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-[#A67BCA] to-[#B68FD6] flex items-center justify-center text-white disabled:opacity-50 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  )
}
