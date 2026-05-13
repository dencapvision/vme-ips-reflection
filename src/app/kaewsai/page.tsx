"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icons } from "@/components/Icons";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  { icon: "🙏", text: "แนะนำโครงการ IPS ให้ท่านผู้สูงอายุเข้าใจง่าย" },
  { icon: "✨", text: "ขอกำลังใจและธรรมะเป็นพลังใจในวันนี้" },
  { icon: "📖", text: "หลักสูตร NESE มีความสำคัญต่อการสร้างเยาวชนอย่างไร?" },
  { icon: "🤝", text: "วิธีการร่วมเป็นจิตอาสาเพื่อสนับสนุนงานศาสนา" },
  { icon: "📣", text: "ร่างข้อความเชิญชวนกัลยาณมิตรมาร่วมงานบุญ" },
  { icon: "💡", text: "แนวทางสื่อสารกับครอบครัวเรื่องการเข้าวัดปฏิบัติธรรม" },
];

export default function KaewSaiPage() {
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
      const res = await fetch("/api/kaewsai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `ขออภัยค่ะ ระบบขัดข้อง (${res.status})`);
      }
      
      if (!res.body) throw new Error("การเชื่อมต่อสัญญาณขาดหายไปค่ะ");

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
    } catch (err: any) {
      console.error("KaewSai Page Error:", err);
      setError(`น้องแก้วใสขออภัยค่ะ พอดีสัญญาณขัดข้อง (${err.message}) ลองใหม่อีกครั้งนะคะ 🙏`);
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
      height: "100dvh", background: "#FCF8FF",
      maxWidth: 480, margin: "0 auto",
    }}>

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #F9F1FF 0%, #FFF5F9 100%)",
        borderBottom: "1px solid #E5D5F2",
        padding: "10px 16px 12px",
        flexShrink: 0,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href="/" style={{
          width: 34, height: 34, borderRadius: 17,
          background: "rgba(255,255,255,0.8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#7C5D99", flexShrink: 0,
        }}>
          <Icons.back size={20} />
        </Link>

        <KaewSaiAvatar size={42} pulse={streaming} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#4A345E" }}>น้องแก้วใส</div>
          <div style={{ fontSize: 11, color: streaming ? "#B36699" : "#8E7DA0", fontWeight: 500 }}>
            {streaming ? "กำลังพิมพ์คำแนะนำ..." : "ยอดกัลยาณมิตร AI Facilitator"}
          </div>
        </div>

        <div style={{
          padding: "4px 10px", borderRadius: "var(--r-pill)",
          background: "rgba(182,143,214,0.15)", border: "1px solid #DBC7ED",
        }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: "#6A4A8E", letterSpacing: "0.04em" }}>IPS FACILITATOR</span>
        </div>
      </div>

      {/* ── Messages area ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>

        {showWelcome && <WelcomeScreen onSuggest={send} />}

        {messages.map((m, i) => (
          <ChatBubble key={i} message={m} />
        ))}

        {streaming && streamingText && (
          <ChatBubble message={{ role: "assistant", content: streamingText }} isStreaming />
        )}
        {streaming && !streamingText && <TypingDots />}

        {error && (
          <div style={{
            margin: "8px 0", padding: "10px 14px",
            background: "#FFF0F0", borderRadius: "var(--r-md)",
            fontSize: 13, color: "#D32F2F", textAlign: "center",
          }}>
            {error}
          </div>
        )}

        <div ref={endRef} style={{ height: 8 }} />
      </div>

      {/* ── Input area ── */}
      <div style={{
        borderTop: "1px solid #E5D5F2",
        background: "#FFF",
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
            placeholder="คุยกับน้องแก้วใสได้เลยนะคะ..."
            rows={1}
            style={{
              flex: 1, padding: "11px 16px",
              borderRadius: 22,
              border: "1.5px solid #E2D1F0",
              background: "#F9F6FC",
              fontSize: 14.5,
              fontFamily: "var(--font-th)",
              color: "#332640",
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
              background: streaming || !input.trim() ? "#E0D5E8" : "#A67BCA",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              cursor: streaming || !input.trim() ? "default" : "pointer",
            }}
          >
            <Icons.arrow size={20} stroke={streaming || !input.trim() ? "#A698B5" : "#fff"} sw={2.2} />
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 6, fontSize: 10.5, color: "#A698B5" }}>
          น้องแก้วใส ยินดีรับฟังด้วยใจที่นิ่งและนุ่มค่ะ 🙏
        </div>
      </div>
    </div>
  );
}

function KaewSaiAvatar({ size = 42, pulse = false }: { size?: number; pulse?: boolean }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {pulse && (
        <div style={{
          position: "absolute", inset: -3, borderRadius: "50%",
          border: "2px solid #E2D1F0",
          animation: "kaewsai-pulse 1.4s ease-in-out infinite",
        }} />
      )}
      <div style={{
        width: size, height: size, borderRadius: size / 2,
        background: "linear-gradient(135deg, #B68FD6 0%, #F2A2C0 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 8px rgba(182,143,214,0.3)",
      }}>
        <Icons.lotus size={Math.round(size * 0.55)} stroke="#fff" sw={1.5} />
      </div>
      <style>{`
        @keyframes kaewsai-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

function WelcomeScreen({ onSuggest }: { onSuggest: (t: string) => void }) {
  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{
        background: "linear-gradient(135deg, #F9F1FF 0%, #FFF5F9 100%)",
        borderRadius: "var(--r-xl)", padding: 24, marginBottom: 24,
        border: "1px solid #E5D5F2", textAlign: "center",
        boxShadow: "0 4px 15px rgba(182,143,214,0.1)",
      }}>
        <KaewSaiAvatar size={72} />
        <div style={{ marginTop: 14, fontSize: 20, fontWeight: 700, color: "#4A345E" }}>
          กราบสวัสดีท่านกัลยาณมิตรค่ะ 🙏
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: "#8E6DA1", marginTop: 4 }}>
          น้องแก้วใส ยินดีรับใช้และเป็นกัลยาณมิตรค่ะ
        </div>
        <div style={{
          marginTop: 12, fontSize: 13.5, color: "#6A5A7A", lineHeight: 1.7,
        }}>
          น้องแก้วใสพร้อมเป็นที่ปรึกษาและกัลยาณมิตรในโครงการ IPS
          เพื่อสนับสนุนการสืบค้นข้อมูลด้านการศึกษา และงานจิตอาสา
          ท่านมีเรื่องใดที่ประสงค์ให้น้องแก้วใสช่วยอำนวยความสะดวกในวันนี้คะ?
        </div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: "#8E7DA0", letterSpacing: "0.08em", marginBottom: 12 }}>
        ✨ ลองถามน้องแก้วใสเรื่องเหล่านี้ดูนะคะ
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggest(s.text)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 18px", borderRadius: "16px",
              background: "#FFF", border: "1.5px solid #F0E6F7",
              textAlign: "left", cursor: "pointer",
              fontSize: 14, color: "#5A4A6E", fontFamily: "var(--font-th)",
              fontWeight: 500, boxShadow: "0 2px 6px rgba(182,143,214,0.05)",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
            <span style={{ flex: 1 }}>{s.text}</span>
            <Icons.arrow size={14} stroke="#C4B4D1" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatBubble({ message, isStreaming }: { message: Message; isStreaming?: boolean }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <div style={{
          maxWidth: "82%",
          padding: "12px 18px",
          borderRadius: "22px 22px 4px 22px",
          background: "#A67BCA",
          color: "#fff",
          fontSize: 15, lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          boxShadow: "0 4px 10px rgba(166,123,202,0.25)",
        }}>
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "flex-start" }}>
      <KaewSaiAvatar size={34} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          padding: "14px 18px",
          borderRadius: "4px 22px 22px 22px",
          background: "#FFF",
          border: "1px solid #F0E6F7",
          fontSize: 15, lineHeight: 1.7,
          color: "#4A3A5E",
          whiteSpace: "pre-wrap",
          boxShadow: "0 2px 8px rgba(182,143,214,0.08)",
        }}>
          <FormattedText text={message.content} />
          {isStreaming && (
            <span style={{
              display: "inline-block", width: 8, height: 16,
              background: "#B68FD6",
              marginLeft: 2, borderRadius: 2,
              animation: "blink 0.8s step-end infinite",
            }} />
          )}
        </div>
      </div>
    </div>
  );
}

function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} style={{ color: "#7C5D99" }}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "flex-start" }}>
      <KaewSaiAvatar size={34} pulse />
      <div style={{
        padding: "14px 20px",
        borderRadius: "4px 22px 22px 22px",
        background: "#FFF", border: "1px solid #F0E6F7",
        display: "flex", gap: 6, alignItems: "center",
        boxShadow: "0 2px 8px rgba(182,143,214,0.08)",
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#DBC7ED",
            animation: `dots 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}
