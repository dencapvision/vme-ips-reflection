import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _supabase;
}

// backward-compat proxy so existing `supabase.from(...)` calls still work
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  },
});

export type ForumCategory = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  color: string | null;
};

export type ForumPost = {
  id: string;
  category_id: string | null;
  author_name: string;
  title: string;
  content: string;
  tag: string | null;
  views_count: number;
  sparks_count: number;
  created_at: string;
  forum_categories?: ForumCategory | null;
};

export type ForumComment = {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  created_at: string;
};

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "เมื่อกี้";
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ชั่วโมงที่แล้ว`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "เมื่อวาน";
  if (days < 7) return `${days} วันที่แล้ว`;
  return new Date(dateStr).toLocaleDateString("th-TH", { day: "numeric", month: "short" });
}

export function categoryColor(color: string | null | undefined): { bg: string; fg: string; br: string } {
  switch (color) {
    case "gold":       return { bg: "#F8F1DD", fg: "#6E5418", br: "#E8DBB1" };
    case "sage":       return { bg: "#EEF3ED", fg: "#3D5C3B", br: "#D6E1D4" };
    case "plum":       return { bg: "#F0E9F1", fg: "#4A2D4D", br: "#DDD0DE" };
    case "royal-blue": return { bg: "#E8EDF8", fg: "#1E3A6E", br: "#C8D4EE" };
    default:           return { bg: "var(--saffron-50)", fg: "var(--saffron-700)", br: "var(--saffron-100)" };
  }
}
