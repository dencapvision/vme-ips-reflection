import { Icons } from "@/components/Icons";
import { TopHeaderBack } from "@/components/AppHeader";
import { Chip, DualLabel } from "@/components/UI";

const items = [
  { letter: "S", en: "SPECIFIC",   th: "ชัดเจน",   v: "ชวนนักเรียนชาย ม.6 จบใหม่ ในจังหวัดอุบลราชธานี เข้าสู่โครงการ IPS10", state: "done" as const },
  { letter: "M", en: "MEASURABLE", th: "วัดผลได้",  v: "จำนวน 5 รูป (3 รายในเครือข่ายเดิม + 2 รายใหม่)", state: "active" as const },
  { letter: "A", en: "ACHIEVABLE", th: "ทำได้จริง",  v: "ใช้เครือข่ายผู้ปกครอง 8 ครอบครัว และ AI คัดกรองจาก 12 โรงเรียน", state: "todo" as const },
  { letter: "R", en: "RELEVANT",   th: "สอดคล้อง",  v: "", state: "todo" as const },
  { letter: "T", en: "TIME-BOUND", th: "มีเวลา",    v: "", state: "todo" as const },
];

export default function SmartPage() {
  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <TopHeaderBack title="SMART Goal · ปี 2569"/>
      </div>

      <div style={{ padding: "0 22px 30px" }}>
        <div style={{ marginBottom: 14 }}>
          <DualLabel en="SMART GOAL" th="แผนพิชิตเป้าหมายปี 2569"/>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
            <Chip variant="saffron">เป้าหมายที่ 1</Chip>
            <span style={{ fontSize: 11, color: "var(--ink-500)" }}>· ทำไปแล้ว 2/5</span>
          </div>
        </div>

        <div className="card" style={{
          padding: 16, marginBottom: 16,
          background: "linear-gradient(135deg, #FDF1E6 0%, var(--white) 100%)",
          borderColor: "var(--saffron-100)",
        }}>
          <div style={{
            fontSize: 11, color: "var(--saffron-700)", fontFamily: "var(--font-en)",
            fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4,
          }}>GOAL</div>
          <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.35 }}>
            ชวนนักเรียน ม.6 ในอุบลฯ บวชเรียน 5 รูป ภายในธันวาคม 2569
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((it) => {
            const active = it.state === "active";
            const done = it.state === "done";
            return (
              <div key={it.letter} style={{
                background: active ? "var(--white)" : "var(--white)",
                border: active ? "2px solid var(--saffron-400)" :
                        done   ? "1px solid var(--saffron-100)" : "1px solid var(--ink-200)",
                borderRadius: "var(--r-lg)", padding: 14,
                display: "flex", gap: 14,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 19,
                  background: done ? "var(--saffron-500)" : active ? "var(--saffron-100)" : "var(--ink-100)",
                  color: done ? "#fff" : active ? "var(--saffron-700)" : "var(--ink-500)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-en)", fontWeight: 700, fontSize: 16, flex: "0 0 auto",
                }}>{it.letter}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-en)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                                    color: active ? "var(--saffron-600)" : "var(--ink-500)" }}>{it.en}</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{it.th}</div>
                    </div>
                    {done && <Icons.check2 size={18} stroke="var(--saffron-500)" sw={2.5}/>}
                  </div>
                  {it.v ? (
                    <div style={{ fontSize: 13, color: "var(--ink-700)", marginTop: 6, lineHeight: 1.5 }}>{it.v}</div>
                  ) : active ? (
                    <div style={{
                      marginTop: 8, padding: "10px 12px",
                      border: "1.5px dashed var(--saffron-300)", borderRadius: 8,
                      fontSize: 12.5, color: "var(--saffron-600)", fontStyle: "italic",
                    }}>เขียนเป้าหมายของคุณตรงนี้…</div>
                  ) : (
                    <div style={{ fontSize: 12.5, color: "var(--ink-400)", marginTop: 6 }}>· ยังไม่กรอก</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
