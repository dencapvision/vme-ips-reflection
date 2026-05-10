import { Icons } from "@/components/Icons";
import { TopHeaderBack } from "@/components/AppHeader";
import { Chip, DualLabel } from "@/components/UI";

export default function SwotPage() {
  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <TopHeaderBack title="SWOT · กลุ่มที่ 4"/>
      </div>

      <div style={{ padding: "0 22px 30px" }}>
        <div style={{ marginBottom: 14 }}>
          <DualLabel en="SWOT ANALYSIS" th="วิเคราะห์สถานการณ์การชวนบวชเรียน"/>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <Chip variant="saffron">ปีที่ผ่านมา</Chip>
            <Chip>กลุ่มที่ 4 · อุบลฯ</Chip>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Q label="จุดแข็ง" en="STRENGTHS" color="#3D5C3B" tint="#EEF3ED" border="#D6E1D4"
             items={["เครือข่ายผู้ปกครอง", "พระผู้ใหญ่ในวัดสนับสนุน", "มีฐานข้อมูลเด็ก ม.ปลาย"]}/>
          <Q label="จุดอ่อน" en="WEAKNESSES" color="#B14A4A" tint="#FBEBEB" border="#F4D5D5"
             items={["ทีมงานยังน้อย", "สื่อโซเชียลยังไม่ครบ", "งบจำกัด"]}/>
          <Q label="โอกาส" en="OPPORTUNITIES" color="var(--saffron-700)" tint="var(--saffron-50)" border="var(--saffron-100)"
             items={["400+ โรงเรียนเตรียมพุทธ", "AI ช่วยคัดกรอง", "นักเรียนสนใจธรรมะมากขึ้น"]}/>
          <Q label="อุปสรรค" en="THREATS" color="#6E5418" tint="#F8F1DD" border="#E8DBB1"
             items={["คู่แข่ง — มหาวิทยาลัยทั่วไป", "พ่อแม่ยังไม่เข้าใจ", "เด็กติดมือถือ"]}/>
        </div>

        <div className="card" style={{ marginTop: 16, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Icons.bolt size={16} stroke="var(--saffron-600)" fill="var(--saffron-100)"/>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
              color: "var(--saffron-600)", fontFamily: "var(--font-en)" }}>INSIGHT</span>
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-800)" }}>
            ใช้ <b>เครือข่ายผู้ปกครอง</b> + <b>AI คัดกรอง</b> เจาะกลุ่ม ม.6 ใน 12 โรงเรียนเตรียมพุทธ
            ในจังหวัด เพื่อชดเชย<b>ทีมงานน้อย</b> และเข้าถึง<b>400+ โรงเรียน</b>ทั่วประเทศได้
          </div>
        </div>
      </div>
    </>
  );
}

function Q({ label, en, color, tint, border, items }: {
  label: string; en: string; color: string; tint: string; border: string; items: string[];
}) {
  return (
    <div style={{ background: tint, border: `1px solid ${border}`, borderRadius: "var(--r-md)", padding: 12 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontFamily: "var(--font-en)", fontSize: 9.5, fontWeight: 700,
          letterSpacing: "0.12em", color, opacity: 0.8 }}>{en}</div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color }}>{label}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.8)", borderRadius: 8, padding: "6px 8px",
            fontSize: 11, lineHeight: 1.4, color: "var(--ink-800)",
          }}>{it}</div>
        ))}
      </div>
    </div>
  );
}
