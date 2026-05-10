import Link from "next/link";
import { notFound } from "next/navigation";
import { Icons } from "@/components/Icons";
import { TopHeaderBack } from "@/components/AppHeader";
import { Chip } from "@/components/UI";
import { getTopic, TOPICS } from "@/lib/topics";

export function generateStaticParams() {
  return TOPICS.map(t => ({ id: t.id }));
}

export default function TopicNotePage({ params }: { params: { id: string } }) {
  const topic = getTopic(params.id);
  if (!topic) return notFound();

  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <TopHeaderBack title={`หัวข้อ ${topic.idx}`}/>
      </div>

      <div style={{ padding: "4px 22px 30px" }}>
        <div style={{ marginBottom: 16 }}>
          <Chip variant="saffron">หัวข้อ {topic.idx} · ฟังบรรยาย</Chip>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 10, lineHeight: 1.25, letterSpacing: "-0.005em" }}>
            {topic.title}
          </h2>
          {topic.description && (
            <p style={{ fontSize: 13.5, color: "var(--ink-600)", marginTop: 6, lineHeight: 1.55 }}>
              {topic.description}
            </p>
          )}
        </div>

        {/* Sub-tabs */}
        <div style={{
          display: "flex", gap: 4, padding: 4, background: "var(--ink-100)",
          borderRadius: 99, marginBottom: 14,
        }}>
          {["สรุป", "ถอดบทเรียน", "แผนต่อ"].map((t, i) => (
            <div key={t} style={{
              flex: 1, textAlign: "center", padding: "8px 10px", borderRadius: 99,
              fontSize: 13, fontWeight: 600,
              background: i === 0 ? "var(--white)" : "transparent",
              color: i === 0 ? "var(--ink-900)" : "var(--ink-600)",
              boxShadow: i === 0 ? "var(--shadow-sm)" : "none",
            }}>{t}</div>
          ))}
        </div>

        {topic.takeaways && (
          <>
            <SectionLabel>KEY TAKEAWAYS · ประเด็นสำคัญ</SectionLabel>
            <div className="card" style={{ padding: 16, marginBottom: 16 }}>
              {topic.takeaways.map((line, i, arr) => (
                <div key={i} style={{
                  display: "flex", gap: 10, padding: "8px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--ink-100)" : "none",
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: 3, background: "var(--saffron-500)",
                    marginTop: 8, flex: "0 0 auto",
                  }}/>
                  <div style={{ fontSize: 13.5, lineHeight: 1.55 }}>{line}</div>
                </div>
              ))}
            </div>
          </>
        )}

        <SectionLabel>MY NOTE · บันทึกของฉัน</SectionLabel>
        <div style={{
          background: "var(--saffron-50)", border: "1px solid var(--saffron-100)",
          borderRadius: "var(--r-lg)", padding: 16, marginBottom: 16,
        }}>
          <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-800)", minHeight: 80 }}>
            (เริ่มเขียนบันทึกของคุณที่นี่…)
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
            <div style={{ fontSize: 11, color: "var(--ink-500)" }}>ยังไม่ได้บันทึก</div>
            <button style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--saffron-700)", fontWeight: 600 }}>
              <Icons.edit size={14}/> เริ่มเขียน
            </button>
          </div>
        </div>

        <Link href="/reflect" className="btn-saffron" style={{ width: "100%", padding: "15px 18px", textDecoration: "none" }}>
          เริ่มถอดบทเรียนหัวข้อนี้ <Icons.arrow size={18} sw={2}/>
        </Link>
      </div>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-500)",
      fontFamily: "var(--font-en)", marginBottom: 8,
    }}>{children}</div>
  );
}
