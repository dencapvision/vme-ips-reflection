import * as React from "react";
import { Icons } from "@/components/Icons";
import { TopHeaderBack } from "@/components/AppHeader";
import { DualLabel } from "@/components/UI";

export default function ReflectionPage() {
  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <TopHeaderBack title="ถอดบทเรียน · ขั้นที่ 2/3"/>
      </div>

      <div style={{ padding: "0 22px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          {[
            { en: "WHAT",     th: "ทำอะไรมา",     state: "done" },
            { en: "SO WHAT",  th: "เห็นอะไรบ้าง",   state: "active" },
            { en: "NOW WHAT", th: "จะทำอะไรต่อ",  state: "todo" },
          ].map((s, i) => (
            <React.Fragment key={s.en}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{
                  width: 28, height: 28, margin: "0 auto", borderRadius: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: s.state === "done" ? "var(--saffron-500)" :
                              s.state === "active" ? "var(--saffron-100)" : "var(--ink-100)",
                  border: s.state === "active" ? "2px solid var(--saffron-500)" : "none",
                  color: s.state === "done" ? "#fff" :
                         s.state === "active" ? "var(--saffron-700)" : "var(--ink-500)",
                  fontSize: 12, fontWeight: 600, fontFamily: "var(--font-en)",
                }}>
                  {s.state === "done" ? <Icons.check size={14} sw={2.5} stroke="#fff"/> : i + 1}
                </div>
                <div style={{
                  fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", marginTop: 4,
                  color: s.state === "todo" ? "var(--ink-500)" : "var(--saffron-700)",
                  fontFamily: "var(--font-en)",
                }}>{s.en}</div>
                <div style={{ fontSize: 10, color: "var(--ink-600)", marginTop: 1 }}>{s.th}</div>
              </div>
              {i < 2 && <div style={{ flex: "0 0 22px", height: 1.5,
                background: i === 0 ? "var(--saffron-500)" : "var(--ink-200)", marginTop: -22 }}/>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 22px 130px" }}>
        <div style={{ marginBottom: 16 }}>
          <DualLabel en="SO WHAT" th="เห็นอะไรบ้าง?"/>
          <p style={{ fontSize: 13, color: "var(--ink-600)", marginTop: 8, lineHeight: 1.55 }}>
            สังเกตเห็นอะไรจากการทำหน้าที่ปีที่ผ่านมาบ้าง
            ทั้งจุดอ่อน อุปสรรค จุดแข็ง โอกาส ผลลัพธ์ ผลกระทบ และผลบุญ
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ReflectCard
            label="ความท้าทาย" sub="จุดอ่อน · อุปสรรค"
            color="#B14A4A" tint="#FBEBEB" border="#F4D5D5"
            text="ทีมงานในจังหวัดยังน้อย เด็กๆ สนใจมือถือมากกว่าธรรมะ พ่อแม่บางบ้านยังไม่เข้าใจการบวชเรียน 4 ปี"
          />
          <ReflectCard
            label="สิ่งดีๆและโอกาสใหม่" sub="จุดแข็ง · โอกาส"
            color="#3D5C3B" tint="#EEF3ED" border="#D6E1D4"
            text="โรงเรียนเตรียมพุทธในพื้นที่ให้ความร่วมมือดี ผู้ปกครองในกลุ่มกัลยาณมิตรชวนต่อๆ กันได้"
          />
          <ReflectCard
            label="ผลลัพธ์ที่เกิดขึ้น" sub="ผลกระทบ · ผลบุญ"
            color="var(--saffron-700)" tint="var(--saffron-50)" border="var(--saffron-100)"
            text="ปีที่แล้วชวนได้ 3 รูป ครอบครัวของเณรเกิดศรัทธา ตามมาทำบุญที่วัดทุกอาทิตย์ เกิดเครือข่ายเล็กๆ ในชุมชน"
          />
        </div>

        <button style={{
          width: "100%", padding: "13px", marginTop: 14,
          background: "var(--white)", border: "1.5px dashed var(--saffron-300)",
          borderRadius: "var(--r-md)", color: "var(--saffron-700)",
          fontSize: 14, fontWeight: 600,
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <Icons.plus size={16} sw={2}/> เพิ่มประเด็นใหม่
        </button>

        <div style={{
          marginTop: 16, padding: 14,
          background: "linear-gradient(135deg, #F0E9F1 0%, #FDF1E6 100%)",
          borderRadius: "var(--r-lg)", border: "1px solid #DDD0DE",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12, background: "var(--white)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icons.ai size={20} stroke="#6B4A6E"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>ให้ AI ช่วยตั้งคำถามสะท้อนต่อไหม?</div>
            <div style={{ fontSize: 11, color: "var(--ink-600)" }}>เพื่อให้คุณคิดได้ลึกขึ้น</div>
          </div>
          <button style={{ padding: "8px 14px", borderRadius: 99, background: "var(--white)",
            fontSize: 12, fontWeight: 600, color: "#6B4A6E", border: "1px solid #DDD0DE" }}>ถามเลย</button>
        </div>
      </div>
    </>
  );
}

function ReflectCard({
  label, sub, color, tint, border, text,
}: { label: string; sub: string; color: string; tint: string; border: string; text: string }) {
  return (
    <div style={{
      background: tint, border: `1px solid ${border}`, borderRadius: "var(--r-lg)", padding: 14,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color }}>{label}</div>
          <div style={{ fontSize: 11, color: "var(--ink-600)", marginTop: 1 }}>{sub}</div>
        </div>
        <Icons.edit size={14} stroke="var(--ink-500)"/>
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-800)" }}>{text}</div>
    </div>
  );
}
