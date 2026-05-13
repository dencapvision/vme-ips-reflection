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

        {/* New Section: Operational Roadmap Example */}
        <div style={{ marginTop: 32, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-500)", fontFamily: "var(--font-en)", marginBottom: 12 }}>
            OPERATIONAL ROADMAP · ตัวอย่างแผนการดำเนินงาน
          </div>
          
          <div className="card" style={{ padding: 20, background: "var(--white)", border: "1.5px dashed var(--saffron-200)" }}>
            <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
              <RoadmapItem 
                month="พฤษภาคม - มิถุนายน" 
                title="เตรียมความพร้อม & เข้าหาพื้นที่" 
                tasks={["รวบรวมรายชื่อ 12 โรงเรียนเป้าหมาย", "ลงพื้นที่ประสานงานครูแนะแนว", "คัดกรองรายชื่อนักเรียนกลุ่มเป้าหมาย"]} 
                status="doing"
              />
              <RoadmapItem 
                month="กรกฎาคม - กันยายน" 
                title="สร้างความสัมพันธ์ & กิจกรรมหลัก" 
                tasks={["จัดกิจกรรม Open House ที่ DCI (เดือนละครั้ง)", "ลงเยี่ยมบ้านนักเรียน 12 ครอบครัว", "เชิญชวนเข้าค่ายภาษาอังกฤษ + ธรรมะ"]} 
                status="pending"
              />
              <RoadmapItem 
                month="ตุลาคม - พฤศจิกายน" 
                title="คัดเลือก & ติดตามผล" 
                tasks={["นัดสนทนาธรรมแบบตัวต่อตัว", "AI Track ความสนใจและข้อกังวลรายบุคคล", "จัดทำสรุปยอดผู้สนใจบวชเรียน"]} 
                status="pending"
              />
              <RoadmapItem 
                month="ธันวาคม" 
                title="สรุปผล & บรรลุเป้าหมาย" 
                tasks={["พาผู้ปกครองเยี่ยมชมสถานที่จริง", "สรุปยอด 5 รูป ตามเป้าหมาย", "จัดพิธีมอบทุนการศึกษาเบื้องต้น"]} 
                status="pending"
              />
            </div>
          </div>
        </div>

        {/* Guideline for Team */}
        <div style={{ 
          background: "var(--ink-900)", borderRadius: "var(--r-lg)", 
          padding: 16, color: "var(--white)", marginTop: 24,
          display: "flex", gap: 12, alignItems: "flex-start"
        }}>
          <div style={{ background: "var(--saffron-500)", borderRadius: 8, padding: 8 }}>
            <Icons.spark size={20} stroke="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--saffron-400)", marginBottom: 4 }}>คำแนะนำสำหรับทีม VME</div>
            <div style={{ fontSize: 12, lineHeight: 1.6, opacity: 0.8 }}>
              เน้นการเก็บข้อมูลแบบ "ละเอียดรายคน" และใช้ AI ช่วยในการติดตามความสนใจ เพื่อให้เราสามารถตอบโจทย์ความต้องการของนักเรียนและผู้ปกครองได้อย่างตรงจุด
            </div>
          </div>
        </div>
      </div>

      <TabBar/>
    </>
  );
}

function RoadmapItem({ month, title, tasks, status }: { month: string; title: string; tasks: string[]; status: "done" | "doing" | "pending" }) {
  return (
    <div style={{ display: "flex", gap: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24 }}>
        <div style={{ 
          width: 20, height: 20, borderRadius: 10, 
          background: status === "doing" ? "var(--saffron-500)" : status === "done" ? "var(--green)" : "var(--ink-200)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {status === "done" && <Icons.check size={12} stroke="#fff" sw={3}/>}
          {status === "doing" && <div style={{ width: 6, height: 6, borderRadius: 3, background: "#fff" }}/>}
        </div>
        <div style={{ flex: 1, width: 2, background: "var(--ink-100)", marginTop: 4, marginBottom: 4 }}/>
      </div>
      <div style={{ flex: 1, paddingBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--saffron-600)", marginBottom: 2 }}>{month}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)", marginBottom: 8 }}>{title}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {tasks.map((t, i) => (
            <div key={i} style={{ fontSize: 12, color: "var(--ink-600)", display: "flex", gap: 6 }}>
              <span>•</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
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
