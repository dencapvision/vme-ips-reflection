"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { TopHeaderBack } from "@/components/AppHeader";
import { Icons } from "@/components/Icons";
import { supabase, timeAgo, categoryColor, type ForumPost, type ForumComment } from "@/lib/supabase";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sparking, setSparking] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [posting, setPosting] = useState(false);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function load() {
      const [{ data: p }, { data: cms }] = await Promise.all([
        supabase
          .from("forum_posts")
          .select("*, forum_categories(id,title,slug,color)")
          .eq("id", id)
          .single(),
        supabase
          .from("forum_comments")
          .select("*")
          .eq("post_id", id)
          .order("created_at", { ascending: true }),
      ]);
      setPost(p ?? null);
      setComments(cms ?? []);
      setLoading(false);
      // increment views
      if (p) {
        supabase
          .from("forum_posts")
          .update({ views_count: (p.views_count ?? 0) + 1 })
          .eq("id", id)
          .then(() => {});
      }
    }
    load();
  }, [id]);

  async function handleSpark() {
    if (!post || sparking) return;
    setSparking(true);
    const newCount = (post.sparks_count ?? 0) + 1;
    await supabase.from("forum_posts").update({ sparks_count: newCount }).eq("id", id);
    setPost({ ...post, sparks_count: newCount });
    setSparking(false);
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || !post) return;
    setPosting(true);
    const { data: newComment } = await supabase
      .from("forum_comments")
      .insert({
        post_id: id,
        content: commentText.trim(),
        author_name: authorName.trim() || "ผู้ใช้งาน VME",
      })
      .select()
      .single();
    if (newComment) {
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    }
    setPosting(false);
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-500)", fontSize: 14 }}>
        กำลังโหลด...
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-500)", fontSize: 14 }}>
        ไม่พบกระทู้นี้
      </div>
    );
  }

  const cat = post.forum_categories;
  const col = categoryColor(cat?.color);

  return (
    <>
      <div style={{ paddingTop: 10 }}>
        <TopHeaderBack title="กระทู้" href="/community" />
      </div>

      <div style={{ padding: "0 22px 16px" }}>
        {/* Category badge */}
        {cat && (
          <span style={{
            display: "inline-block", marginBottom: 10,
            padding: "4px 12px", borderRadius: "var(--r-pill)",
            fontSize: 11, fontWeight: 600,
            background: col.bg, color: col.fg, border: `1px solid ${col.br}`,
          }}>
            {cat.title}
          </span>
        )}

        {/* Title */}
        <h1 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.35, marginBottom: 10, color: "var(--ink-900)" }}>
          {post.title}
        </h1>

        {/* Author + time */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 15,
            background: "var(--saffron-100)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "var(--saffron-700)",
          }}>
            {post.author_name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-800)" }}>{post.author_name}</div>
            <div style={{ fontSize: 11, color: "var(--ink-400)" }}>
              {timeAgo(post.created_at)} · {post.views_count} ครั้ง
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--ink-100)", marginBottom: 16 }} />

        {/* Content */}
        <div style={{ fontSize: 15, lineHeight: 1.8, color: "var(--ink-800)", whiteSpace: "pre-wrap", marginBottom: 20 }}>
          {post.content}
        </div>

        {/* Spark button */}
        <button
          onClick={handleSpark}
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "9px 18px", borderRadius: "var(--r-pill)",
            background: sparking ? "var(--saffron-100)" : "var(--saffron-50)",
            border: "1.5px solid var(--saffron-200)",
            color: "var(--saffron-700)", fontSize: 13.5, fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Icons.spark size={16} stroke="var(--saffron-600)" />
          ให้ Spark · {post.sparks_count}
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 8, background: "var(--ink-100)" }} />

      {/* Comments section */}
      <div style={{ padding: "16px 22px 0" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-700)", marginBottom: 14 }}>
          ความคิดเห็น · {comments.length}
        </div>

        {comments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0 16px", color: "var(--ink-400)", fontSize: 13 }}>
            ยังไม่มีความคิดเห็น — เป็นคนแรก!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {comments.map((c) => (
              <CommentItem key={c.id} comment={c} />
            ))}
          </div>
        )}
      </div>

      {/* Add comment form */}
      <div style={{ padding: "20px 22px 120px" }}>
        <div style={{ height: 1, background: "var(--ink-100)", marginBottom: 16 }} />
        <form onSubmit={handleComment} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="ชื่อของคุณ (ไม่บังคับ)"
            style={inputStyle}
          />
          <textarea
            ref={commentRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="เขียนความคิดเห็น..."
            rows={3}
            style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
          />
          <button
            type="submit"
            disabled={posting || !commentText.trim()}
            className="btn-saffron"
            style={{ opacity: posting || !commentText.trim() ? 0.5 : 1 }}
          >
            {posting ? "กำลังโพสต์..." : "ส่งความคิดเห็น"}
          </button>
        </form>
      </div>
    </>
  );
}

function CommentItem({ comment }: { comment: ForumComment }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div style={{
        width: 28, height: 28, borderRadius: 14, flexShrink: 0,
        background: "var(--ink-100)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700, color: "var(--ink-600)",
      }}>
        {comment.author_name.charAt(0)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-800)" }}>{comment.author_name}</span>
          <span style={{ fontSize: 11, color: "var(--ink-400)" }}>{timeAgo(comment.created_at)}</span>
        </div>
        <div style={{
          fontSize: 14, lineHeight: 1.6, color: "var(--ink-800)", whiteSpace: "pre-wrap",
          background: "var(--ink-50)", borderRadius: "var(--r-md)",
          padding: "10px 14px",
        }}>
          {comment.content}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "var(--r-md)",
  border: "1.5px solid var(--ink-200)",
  background: "var(--white)",
  fontSize: 14,
  fontFamily: "var(--font-th)",
  color: "var(--ink-900)",
  outline: "none",
};
