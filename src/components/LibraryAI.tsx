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
    content: 'สวัสดีค่ะ! น้องแก้วใสพร้อมช่วยสืบค้นข้อมูลจากคลังความรู้ให้แล้วค่ะ มีเรื่องอะไรที่อยากให้น้องแก้วใสช่วยค้นหาไหมคะ? ✨'
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingText])

  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery)
      sendMessage(initialQuery)
    }
  }, [initialQuery])

  useEffect(() => {
    const handleSetPrompt = (e: Event) => {
      const customEvent = e as CustomEvent<{ prompt: string; autoSubmit?: boolean }>
      if (customEvent.detail?.prompt) {
        const textPrompt = customEvent.detail.prompt
        setInput(textPrompt)
        
        // Focus the input field
        setTimeout(() => {
          inputRef.current?.focus()
        }, 100)

        if (customEvent.detail.autoSubmit) {
          sendMessage(textPrompt)
        }
      }
    }
    window.addEventListener('set-ai-prompt', handleSetPrompt)
    return () => window.removeEventListener('set-ai-prompt', handleSetPrompt)
  }, [messages, loading])

  const sendMessage = async (text: string = input) => {
    if (!text.trim() || loading) return

    const userMsg: Message = { role: 'user', content: text }
    const newMessages: Message[] = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setStreamingText('')

    try {
      // Call the unified Nong Kaew Sai API
      const res = await fetch('/api/kaewsai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server Error (${res.status})`);
      }

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.error) throw new Error(data.error);
      }

      if (!res.body) throw new Error('การเชื่อมต่อกับ AI ขัดข้อง (No stream body)');

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setStreamingText(fullText)
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fullText
      }])
      setStreamingText('')
    } catch (err: any) {
      console.error("LibraryAI Error:", err);
      const isQuota = err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('QUOTA_ERROR');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isQuota
          ? 'ขออภัยค่ะ ขณะนี้ระบบ AI มีผู้ใช้งานเกินโควต้ารายวันค่ะ กรุณาลองใหม่ในอีก 1-2 นาที หรือรอพรุ่งนี้เพื่อให้โควต้ารีเซ็ตนะคะ 🙏'
          : `ขออภัยค่ะ น้องแก้วใสพบข้อผิดพลาด: ${err.message || 'สัญญาณขัดข้อง'} กรุณาลองใหม่อีกครั้งนะคะ 🙏`
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
          <span style={{ fontSize: '18px' }}>🙏</span>
        </div>
        <div>
          <h2 className="font-bold text-[#4A345E]">น้องแก้วใส AI</h2>
          <p className="text-xs text-[#8E6DA1]">กัลยาณมิตรประจำคลังความรู้</p>
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
            </div>
          </div>
        ))}
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-white border border-[#E5D5F2] rounded-2xl rounded-tl-none p-4 shadow-sm text-[#4A345E]">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{streamingText}</div>
            </div>
          </div>
        )}
        {loading && !streamingText && (
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
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="สอบถามข้อมูลจากคลังความรู้ได้ที่นี่ค่ะ..."
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
