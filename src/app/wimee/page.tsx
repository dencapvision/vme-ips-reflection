"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icons } from "@/components/Icons";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  { icon: "📖", text: "อธิบายโครงการ IPS ให้เข้าใจง่ายหน่อย" },
  { icon: "💬", text: "ช่วยร่างข้อความชวนน้องทาง LINE" },
  { icon: "🤝", text: "น้องบอกว่าไม่พร้อม จะพูดยังไงดี?" },
  { icon: "👨‍👩‍👧", text: "ผู้ปกครองกังวลเรื่องอนาคตลูก จะตอบอย่างไร?" },
  { icon: "💡", text: "หลักกัลยาณมิตรคืออะไร ใช้กับงานนี้ยังไง?" },
  { icon: "🔥", text: "รู้สึกท้อ ให้กำลังใจหน่อย" },
];

export default function WimeePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    setError("");

    const userMsg: Message = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setStreaming(true);
    setStreamingText("");

    try {
      const res = await fetch("/api/wimee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      if (!res.body) throw new Error("No stream body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setStreamingText(full);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: full }]);
      setStreamingText("");
    } catch {
      setError("วีมี่เชื่อมต่อไม่ได้ตอนนี้ค่ะ ลองใหม่อีกครั้งนะคะ 🙏");
    } finally {
      setStreaming(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const showWelcome = messages.length === 0 && !streaming;

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100dvh", background: "var(--cream)",
      maxWidth: 480, margin: "0 auto",
    }}>

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #F0E9F1 0%, #FBF0E2 100%)",
        borderBottom: "1px solid #DDD0DE",
        padding: "10px 16px 12px",
        flexShrink: 0,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href="/" style={{
          width: 34, height: 34, borderRadius: 17,
          background: "rgba(255,255,255,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--ink-700)", flexShrink: 0,
        }}>
          <Icons.back size={20} />
        </Link>

        <WimeeAvatar size={42} pulse={streaming} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-900)" }}>น้องวีมี่</div>
          <div style={{ fontSize: 11, color: streaming ? "var(--saffron-600)" : "var(--ink-500)", fontWeight: 500 }}>
            {streaming ? "กำลังพิมพ์..." : "AI Facilitator · VME · IPS"}
          </div>
        </div>

        <div style={{
          padding: "4px 10px", borderRadius: "var(--r-pill)",
          background: "rgba(110,139,107,0.12)", border: "1px solid #D6E1D4",
        }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: "#3D5C3B", letterSpacing: "0.04em" }}>กัลยาณมิตร</span>
        </div>
      </div>

      {/* ── Messages area ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>

        {showWelcome && <WelcomeScreen onSuggest={send} />}

        {messages.map((m, i) => (
          <ChatBubble key={i} message={m} />
        ))}

        {/* Streaming bubble */}
        {streaming && streamingText && (
          <ChatBubble message={{ role: "assistant", content: streamingText }} isStreaming />
        )}
        {streaming && !streamingText && <TypingDots />}

        {error && (
          <div style={{
            margin: "8px 0", padding: "10px 14px",
            background: "#FDE8E8", borderRadius: "var(--r-md)",
            fontSize: 13, color: "var(--red)", textAlign: "center",
          }}>
            {error}
          </div>
        )}

        <div ref={endRef} style={{ height: 8 }} />
      </div>

      {/* ── Input area ── */}
      <div style={{
        borderTop: "1px solid var(--ink-200)",
        background: "var(--cream)",
        padding: "10px 14px",
        paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="ถามวีมี่ได้เลยนะคะ พี่..."
            rows={1}
            style={{
              flex: 1, padding: "11px 16px",
              borderRadius: 22,
              border: "1.5px solid var(--ink-200)",
              background: "var(--white)",
              fontSize: 14.5,
              fontFamily: "var(--font-th)",
              color: "var(--ink-900)",
              resize: "none",
              outline: "none",
              lineHeight: 1.5,
              overflowY: "auto",
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={streaming || !input.trim()}
            style={{
              width: 44, height: 44, borderRadius: 22, flexShrink: 0,
              background: streaming || !input.trim() ? "var(--ink-200)" : "var(--saffron-500)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
              cursor: streaming || !input.trim() ? "default" : "pointer",
            }}
          >
            <Icons.arrow size={20} stroke={streaming || !input.trim() ? "var(--ink-500)" : "#fff"} sw={2} />
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 6, fontSize: 10.5, color: "var(--ink-400)" }}>
          น้องวีมี่ ให้คำแนะนำด้วยหัวใจกัลยาณมิตร 🙏
        </div>
      </div>
    </div>
  );
}

/* ─── Wimee Avatar ─── */
function WimeeAvatar({ size = 42, pulse = false }: { size?: number; pulse?: boolean }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {pulse && (
        <div style={{
          position: "absolute", inset: -3, borderRadius: "50%",
          border: "2px solid var(--saffron-300)",
          animation: "wimee-pulse 1.4s ease-in-out infinite",
        }} />
      )}
      <div style={{
        width: size, height: size, borderRadius: size / 2,
        background: "linear-gradient(135deg, #C084AB 0%, #D45F1C 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 8px rgba(180,80,30,0.3)",
      }}>
        <Icons.lotus size={Math.round(size * 0.52)} stroke="#fff" sw={1.6} />
      </div>
      <style>{`
        @keyframes wimee-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

/* ─── Welcome screen ─── */
function WelcomeScreen({ onSuggest }: { onSuggest: (t: string) => void }) {
  return (
    <div style={{ paddingBottom: 8 }}>
      {/* Intro card */}
      <div style={{
        background: "linear-gradient(135deg, #F0E9F1 0%, #FBF0E2 100%)",
        borderRadius: "var(--r-xl)", padding: 20, marginBottom: 20,
        border: "1px solid #DDD0DE", textAlign: "center",
      }}>
        <WimeeAvatar size={64} />
        <div style={{ marginTop: 12, fontSize: 20, fontWeight: 700, color: "var(--ink-900)" }}>
          สวัสดีค่ะ พี่ 🙏
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: "#6B4A6E", marginTop: 2 }}>
          หนูคือน้องวีมี่ AI Facilitator ของ VME
        </div>
        <div style={{
          marginTop: 10, fontSize: 13.5, color: "var(--ink-600)", lineHeight: 1.65,
        }}>
          หนูพร้อมช่วยพี่ในทุกเรื่องเกี่ยวกับการ
          <strong> ชวนบวชเรียนด้วยหัวใจกัลยาณมิตร</strong>
          {" "}ไม่ว่าจะเป็นข้อมูลโครงการ สคริปต์คำชวน
          วิธีรับมือข้อโต้แย้ง หรือแม้แต่ให้กำลังใจพี่ค่ะ
        </div>
      </div>

      {/* Suggestions */}
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-500)", letterSpacing: "0.08em", marginBottom: 10, fontFamily: "var(--font-en)" }}>
        QUICK START · เริ่มจากตรงนี้ได้เลย
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggest(s.text)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 16px", borderRadius: "var(--r-md)",
              background: "var(--white)", border: "1.5px solid var(--ink-200)",
              textAlign: "left", cursor: "pointer",
              fontSize: 13.5, color: "var(--ink-800)", fontFamily: "var(--font-th)",
              fontWeight: 500,
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
            <span>{s.text}</span>
            <Icons.arrow size={14} stroke="var(--ink-400)" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Chat bubble ─── */
function ChatBubble({ message, isStreaming }: { message: Message; isStreaming?: boolean }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <div style={{
          maxWidth: "78%",
          padding: "11px 16px",
          borderRadius: "20px 20px 6px 20px",
          background: "var(--saffron-500)",
          color: "#fff",
          fontSize: 14.5, lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          boxShadow: "0 2px 6px rgba(212,95,28,0.25)",
        }}>
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-start" }}>
      <WimeeAvatar size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          padding: "12px 16px",
          borderRadius: "6px 20px 20px 20px",
          background: "var(--white)",
          border: "1px solid var(--ink-200)",
          fontSize: 14.5, lineHeight: 1.7,
          color: "var(--ink-800)",
          whiteSpace: "pre-wrap",
          boxShadow: "var(--shadow-sm)",
        }}>
          <FormattedText text={message.content} />
          {isStreaming && (
            <span style={{
              display: "inline-block", width: 8, height: 16,
              background: "var(--saffron-400)",
              marginLeft: 2, borderRadius: 2,
              animation: "blink 0.8s step-end infinite",
            }} />
          )}
        </div>
      </div>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ─── Formatted text (bold for **text**) ─── */
function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/* ─── Typing dots ─── */
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-start" }}>
      <WimeeAvatar size={32} pulse />
      <div style={{
        padding: "14px 18px",
        borderRadius: "6px 20px 20px 20px",
        background: "var(--white)", border: "1px solid var(--ink-200)",
        display: "flex", gap: 5, alignItems: "center",
        boxShadow: "var(--shadow-sm)",
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "var(--saffron-300)",
            animation: `dots 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
        <style>{`
          @keyframes dots {
            0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
