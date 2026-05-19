"use client";

import { useState, useEffect } from "react";
import { saveUserResponse, getUserResponse } from "@/app/actions/responses";
import { Icons } from "@/components/Icons";

interface ReflectionFormProps {
  category: string;
  fields: {
    id: string;
    label: string;
    placeholder: string;
    en: string;
    color: string;
    tint: string;
    border: string;
  }[];
  layout?: "grid" | "list";
}

export function ReflectionForm({ category, fields, layout = "grid" }: ReflectionFormProps) {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    async function loadData() {
      const response = await getUserResponse(category);
      if (response) {
        setData(response as Record<string, string>);
      }
      setLoading(false);
    }
    loadData();
  }, [category]);

  const handleChange = (id: string, value: string) => {
    setData(prev => ({ ...prev, [id]: value }));
  };

  const handleBlur = async () => {
    setSaving(true);
    await saveUserResponse(category, data);
    setSaving(false);
    setLastSaved(new Date());
  };

  if (loading) {
    return (
      <div style={{ padding: "40px 0", textAlign: "center", color: "var(--ink-400)" }}>
        <div className="animate-pulse">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  const containerStyle = layout === "grid" 
    ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }
    : { display: "flex", flexDirection: "column" as const, gap: 12 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={containerStyle}>
        {fields.map(f => (
          <div key={f.id} style={{ 
            background: f.tint, border: `1px solid ${f.border}`, 
            borderRadius: "var(--r-md)", padding: 12,
            display: "flex", flexDirection: "column"
          }}>
            <div style={{ marginBottom: 8 }}>
              <div style={{ 
                fontFamily: "var(--font-en)", fontSize: 9.5, fontWeight: 700,
                letterSpacing: "0.12em", color: f.color, opacity: 0.8 
              }}>{f.en}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: f.color }}>{f.label}</div>
            </div>
            <textarea
              value={data[f.id] || ""}
              onChange={(e) => handleChange(f.id, e.target.value)}
              onBlur={handleBlur}
              placeholder={f.placeholder}
              style={{
                width: "100%", minHeight: 100,
                background: "rgba(255,255,255,0.8)", borderRadius: 8, padding: "8px 10px",
                fontSize: 12, lineHeight: 1.5, color: "var(--ink-800)",
                border: "none", resize: "none", outline: "none",
                fontFamily: "inherit"
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ 
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 12px", background: "var(--white)", borderRadius: 12,
        border: "1px solid var(--ink-100)"
      }}>
        <div style={{ fontSize: 11, color: "var(--ink-500)", display: "flex", alignItems: "center", gap: 5 }}>
          {saving ? (
            <>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--saffron-400)", animation: "pulse 1s infinite" }} />
              <span>กำลังบันทึก...</span>
            </>
          ) : lastSaved ? (
            <>
              <Icons.check size={12} stroke="#10B981" />
              <span>บันทึกแล้วเมื่อ {lastSaved.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
            </>
          ) : (
            <span>ข้อมูลจะถูกบันทึกอัตโนมัติ</span>
          )}
        </div>
        <button 
          onClick={handleBlur}
          disabled={saving}
          style={{
            padding: "6px 12px", borderRadius: 8, background: "var(--ink-900)", color: "white",
            fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
            opacity: saving ? 0.5 : 1
          }}
        >
          บันทึกตอนนี้
        </button>
      </div>
    </div>
  );
}
