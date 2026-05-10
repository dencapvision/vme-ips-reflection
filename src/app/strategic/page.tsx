import { AppHeader } from "@/components/AppHeader";
import { Icons } from "@/components/Icons";
import { TabBar } from "@/components/TabBar";

export default function StrategicPage() {
  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <AppHeader large title="แผนกลยุทธ์ปี 2569" subtitle="STRATEGIC PLAN"
          trailing={<button style={{ width: 38, height: 38, borderRadius: 19, background: "var(--white)", border: "1px solid var(--ink-200)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icons.share size={17} stroke="var(--ink-700)"/>
          </button>}/>
      </div>

      <div style={{ padding: "4px 22px 30px" }}>
        <div style={{
          background: "linear-gradient(140deg, var(--saffron-500) 0%, var(--saffron-600) 100%)",
          borderRadius: "var(--r-xl)", padding: 18, color: "#fff", marginBottom: 18,
          position: "relative", overflow: "hidden",
        }}>
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: "absolute", right: -40, top: -40, opacity: 0.15 }}>
            <circle cx="90" cy="90" r="80" fill="none" stroke="#fff" strokeWidth="1"/>
            <circle cx="90" cy="90" r="55" fill="none" stroke="#fff" strokeWidth="1"/>
            <circle cx="90" cy="90" r="30" fill="none" stroke="#fff" strokeWidth="1"/>
          </svg>
          <div style={{ position: "relative" }}>
            <div style={{ fontFamily: "var(--font-en)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", opacity: 0.85 }}>TARGET 2569</div>
            <div style={{ fontSize: 30, fontWeight: 600, marginTop: 4, fontFamily: "var(--font-en)" }}>5 รูป</div>
            <div style={{ fontSize: 13, opacity: 0.92, marginTop: 2, lineHeight: 1.5 }}>
              ชวนบวชเรียน IPS10 จากนักเรียน ม.6 ในจังหวัดอุบลราชธานี
            </div>
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-500)", fontFamily: "var(--font-en)", marginBottom: 10 }}>
          4 PILLARS · 4 มิติของแผน
        </div>

        <Pillar n="01" color="saffron" title="กลุ่มเป้าหมาย & พื้นที่" en="WHO & WHERE"
          items={["นักเรียน ม.6 ชาย · อายุ 18 ปี · 5 รูป", "12 โรงเรียนในเขต อ.เมือง / วารินฯ / เดชอุดม", "8 ครอบครัวกัลยาณมิตรเดิม"]}/>
        <Pillar n="02" color="sage" title="บริบท & ข้อมูลสำคัญ" en="CONTEXT"
          items={["ผู้ปกครอง 65% ทำบุญที่วัดประจำเดือน", "นักเรียนกลุ่มเป้าหมาย 70% สนใจธรรมะอยู่บ้าง", "งบประมาณกิจกรรม 25,000 บาท / ปี"]}/>
        <Pillar n="03" color="gold" title="กิจกรรม & ช่องทาง" en="ACTIVITIES"
          items={["4 กิจกรรมเปิดบ้าน DCI · ก.ค. – ต.ค.", "12 ครั้งเยี่ยมครอบครัวรายตัว", "1 ค่ายภาษาอังกฤษ + ธรรมะ · ส.ค."]}/>
        <Pillar n="04" color="plum" title="การเก็บข้อมูล & สัมพันธ์" en="RELATIONSHIP"
          items={["แชทไลน์กลุ่มผู้ปกครอง (อาทิตย์ละครั้ง)", "AI track ความสนใจรายบุคคล", "นัดเจอตัวต่อตัวก่อนตัดสินใจ"]}/>
      </div>

      <TabBar/>
    </>
  );
}

function Pillar({ n, color, title, en, items }: {
  n: string; color: "saffron" | "sage" | "gold" | "plum"; title: string; en: string; items: string[];
}) {
  const map = {
    saffron: { bg: "var(--saffron-50)",  fg: "var(--saffron-700)", br: "var(--saffron-100)" },
    sage:    { bg: "#EEF3ED",            fg: "#3D5C3B",            br: "#D6E1D4" },
    gold:    { bg: "#F8F1DD",            fg: "#6E5418",            br: "#E8DBB1" },
    plum:    { bg: "#F0E9F1",            fg: "#4A2D4D",            br: "#DDD0DE" },
  }[color];
  return (
    <div style={{
      background: map.bg, border: `1px solid ${map.br}`, borderRadius: "var(--r-lg)",
      padding: 14, marginBottom: 10,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
        <div style={{ fontFamily: "var(--font-en)", fontSize: 22, fontWeight: 700, color: map.fg, opacity: 0.85 }}>{n}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-en)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", color: map.fg, opacity: 0.7 }}>{en}</div>
          <div style={{ fontSize: 14.5, fontWeight: 600 }}>{title}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.65)", borderRadius: 8, padding: "8px 10px",
            fontSize: 12.5, color: "var(--ink-800)", display: "flex", gap: 8,
          }}>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: map.fg, marginTop: 8, flex: "0 0 auto" }}/>
            <span style={{ flex: 1 }}>{it}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
