"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopHeaderBack } from "@/components/AppHeader";
import { supabase, categoryColor, type ForumCategory } from "@/lib/supabase";

export default function NewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.from("forum_categories").select("*").order("created_at").then(({ data }) => {
      setCategories(data ?? []);
      if (data && data.length > 0) setCategoryId(data[0].id);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("กรุณากรอกชื่อกระทู้และเนื้อหา");
      return;
    }
    setSubmitting(true);
    setError("");
    const { data, error: err } = await supabase
      .from("forum_posts")
      .insert({
        title: title.trim(),
        content: content.trim(),
        author_name: authorName.trim() || "ผู้ใช้งาน VME",
        category_id: categoryId || null,
      })
      .select("id")
      .single();

    if (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      setSubmitting(false);
      return;
    }
    router.push(`/community/${data.id}`);
  }

  return (
    <>
      <div style={{ paddingTop: 10 }}>
        <TopHeaderBack title="สร้างกระทู้ใหม่" href="/community" />
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "8px 22px 40px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Author name */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-600)", display: "block", marginBottom: 6 }}>
            ชื่อของคุณ (ไม่บังคับ)
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="ผู้ใช้งาน VME"
            style={inputStyle}
          />
        </div>

        {/* Category */}
        {categories.length > 0 && (
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-600)", display: "block", marginBottom: 8 }}>
              หมวดหมู่
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {categories.map((cat) => {
                const col = categoryColor(cat.color);
                const selected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    style={{
                      padding: "7px 14px", borderRadius: "var(--r-pill)",
                      fontSize: 12.5, fontWeight: selected ? 700 : 500,
                      background: selected ? col.fg : col.bg,
                      color: selected ? "#fff" : col.fg,
                      border: `1.5px solid ${selected ? col.fg : col.br}`,
                      cursor: "pointer",
                    }}
                  >
                    {cat.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-600)", display: "block", marginBottom: 6 }}>
            ชื่อกระทู้ <span style={{ color: "var(--red)" }}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ตั้งชื่อกระทู้ให้ชัดเจน..."
            maxLength={120}
            style={inputStyle}
          />
          <div style={{ fontSize: 11, color: "var(--ink-400)", marginTop: 4, textAlign: "right" }}>
            {title.length}/120
          </div>
        </div>

        {/* Content */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-600)", display: "block", marginBottom: 6 }}>
            เนื้อหา <span style={{ color: "var(--red)" }}>*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="แชร์ความรู้ ประสบการณ์ หรือตั้งคำถามให้ชุมชน..."
            rows={7}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          />
        </div>

        {error && (
          <div style={{
            padding: "10px 14px", borderRadius: "var(--r-md)",
            background: "#FDE8E8", color: "var(--red)",
            fontSize: 13, fontWeight: 500,
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-saffron"
          style={{ width: "100%", opacity: submitting ? 0.6 : 1 }}
        >
          {submitting ? "กำลังโพสต์..." : "โพสต์กระทู้"}
        </button>
      </form>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "var(--r-md)",
  border: "1.5px solid var(--ink-200)",
  background: "var(--white)",
  fontSize: 14.5,
  fontFamily: "var(--font-th)",
  color: "var(--ink-900)",
  outline: "none",
};
