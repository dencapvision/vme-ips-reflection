"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import { AppHeader } from "@/components/AppHeader";
import { TabBar } from "@/components/TabBar";
import { supabase, timeAgo, categoryColor, type ForumPost, type ForumCategory } from "@/lib/supabase";

export default function CommunityPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: ps }, { data: cms }] = await Promise.all([
        supabase.from("forum_categories").select("*").order("created_at"),
        supabase
          .from("forum_posts")
          .select("*, forum_categories(id,title,slug,color)")
          .order("created_at", { ascending: false }),
        supabase.from("forum_comments").select("post_id"),
      ]);
      setCategories(cats ?? []);
      setPosts(ps ?? []);
      const counts: Record<string, number> = {};
      for (const c of cms ?? []) {
        if (c.post_id) counts[c.post_id] = (counts[c.post_id] ?? 0) + 1;
      }
      setCommentCounts(counts);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = activeCategory
    ? posts.filter((p) => p.category_id === activeCategory)
    : posts;

  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <AppHeader
          large
          title="ชุมชน VME"
          subtitle="COMMUNITY · แลกเปลี่ยนเรียนรู้"
          trailing={
            <Link
              href="/community/new"
              style={{
                width: 38, height: 38, borderRadius: 19,
                background: "var(--saffron-500)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Icons.plus size={20} stroke="#fff" sw={2.2} />
            </Link>
          }
        />
      </div>

      {/* Category filter */}
      <div style={{ padding: "4px 22px 14px", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
        <button
          onClick={() => setActiveCategory(null)}
          className={`chip${!activeCategory ? " chip-saffron" : ""}`}
          style={{ fontWeight: !activeCategory ? 600 : 500, whiteSpace: "nowrap" }}
        >
          ทั้งหมด · {posts.length}
        </button>
        {categories.map((cat) => {
          const count = posts.filter((p) => p.category_id === cat.id).length;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(isActive ? null : cat.id)}
              className={`chip${isActive ? " chip-saffron" : ""}`}
              style={{ fontWeight: isActive ? 600 : 500, whiteSpace: "nowrap" }}
            >
              {cat.title} · {count}
            </button>
          );
        })}
      </div>

      {/* Posts */}
      <div style={{ padding: "0 22px 30px", display: "flex", flexDirection: "column", gap: 10 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--ink-500)", fontSize: 14 }}>
            กำลังโหลด...
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((post) => (
            <PostCard key={post.id} post={post} commentsCount={commentCounts[post.id] ?? 0} />
          ))
        )}
      </div>

      <TabBar />
    </>
  );
}

function PostCard({ post, commentsCount }: { post: ForumPost; commentsCount: number }) {
  const cat = post.forum_categories;
  const col = categoryColor(cat?.color);
  return (
    <Link href={`/community/${post.id}`} className="card" style={{ padding: 16, display: "block", textDecoration: "none" }}>
      {cat && (
        <span style={{
          display: "inline-block", marginBottom: 8,
          padding: "3px 10px", borderRadius: "var(--r-pill)",
          fontSize: 11, fontWeight: 600,
          background: col.bg, color: col.fg, border: `1px solid ${col.br}`,
        }}>
          {cat.title}
        </span>
      )}
      <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35, marginBottom: 6, color: "var(--ink-900)" }}>
        {post.title}
      </div>
      <div style={{
        fontSize: 12.5, color: "var(--ink-600)", lineHeight: 1.5,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        marginBottom: 12,
      }}>
        {post.content}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 12,
            background: "var(--saffron-100)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 600, color: "var(--saffron-700)",
          }}>
            {post.author_name.charAt(0)}
          </div>
          <span style={{ fontSize: 12, color: "var(--ink-600)", fontWeight: 500 }}>{post.author_name}</span>
          <span style={{ fontSize: 11, color: "var(--ink-400)" }}>·</span>
          <span style={{ fontSize: 11, color: "var(--ink-400)" }}>{timeAgo(post.created_at)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3, color: "var(--ink-500)" }}>
            <Icons.spark size={13} stroke="var(--saffron-500)" />
            <span style={{ fontSize: 12 }}>{post.sparks_count}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 3, color: "var(--ink-500)" }}>
            <Icons.chat size={13} stroke="var(--ink-500)" />
            <span style={{ fontSize: 12 }}>{commentsCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div style={{ 
      textAlign: "center", padding: "64px 22px", 
      background: "var(--white)", borderRadius: "var(--r-xl)",
      border: "1.5px dashed var(--ink-100)",
      marginTop: 20
    }}>
      <div style={{ marginBottom: 20, display: "inline-flex", padding: 20, background: "var(--saffron-50)", borderRadius: "50%" }}>
        <Icons.chat size={40} stroke="var(--saffron-400)" sw={1.5} />
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: "var(--ink-800)", marginBottom: 8 }}>เริ่มต้นบทสนทนาแรก</div>
      <div style={{ fontSize: 13, color: "var(--ink-500)", maxWidth: 240, margin: "0 auto 24px", lineHeight: 1.6 }}>
        แชร์ความรู้ เทคนิค หรือตั้งคำถามเพื่อพัฒนาศีลธรรมไปด้วยกันในชุมชน VME
      </div>
      <Link href="/community/new" className="btn-saffron" style={{ display: "inline-flex", padding: "12px 24px" }}>
        <Icons.plus size={18} stroke="#fff" sw={2.5} style={{ marginRight: 6 }} />
        ตั้งกระทู้สนทนา
      </Link>
    </div>
  );
}
