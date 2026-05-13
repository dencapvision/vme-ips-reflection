import { Icons } from "@/components/Icons";
import { TopHeaderBack } from "@/components/AppHeader";
import { Chip, DualLabel } from "@/components/UI";
import { ReflectionForm } from "@/components/ReflectionForm";

export default function SwotPage() {
  const swotFields = [
    { id: "strengths", label: "จุดแข็ง", en: "STRENGTHS", placeholder: "เช่น เครือข่ายผู้ปกครอง, พระผู้ใหญ่สนับสนุน...", color: "#3D5C3B", tint: "#EEF3ED", border: "#D6E1D4" },
    { id: "weaknesses", label: "จุดอ่อน", en: "WEAKNESSES", placeholder: "เช่น ทีมงานน้อย, งบจำกัด, สื่อโซเชียลยังไม่ครบ...", color: "#B14A4A", tint: "#FBEBEB", border: "#F4D5D5" },
    { id: "opportunities", label: "โอกาส", en: "OPPORTUNITIES", placeholder: "เช่น โรงเรียนเตรียมพุทธ, AI ช่วยคัดกรอง...", color: "var(--saffron-700)", tint: "var(--saffron-50)", border: "var(--saffron-100)" },
    { id: "threats", label: "อุปสรรค", en: "THREATS", placeholder: "เช่น พ่อแม่ยังไม่เข้าใจ, เด็กติดมือถือ...", color: "#6E5418", tint: "#F8F1DD", border: "#E8DBB1" },
  ];

  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <TopHeaderBack title="SWOT · วิเคราะห์สถานการณ์"/>
      </div>

      <div style={{ padding: "0 22px 100px" }}>
        <div style={{ marginBottom: 20 }}>
          <DualLabel en="SWOT ANALYSIS" th="วิเคราะห์สถานการณ์การชวนบวชเรียน"/>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <Chip variant="saffron">แผนปี 2569</Chip>
            <Chip>ส่วนบุคคล</Chip>
          </div>
        </div>

        <ReflectionForm category="swot" fields={swotFields} />

        <div className="card" style={{ marginTop: 24, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Icons.bolt size={16} stroke="var(--saffron-600)" fill="var(--saffron-100)"/>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
              color: "var(--saffron-600)", fontFamily: "var(--font-en)" }}>TIPS</span>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink-600)" }}>
            ให้ลองดึงเอา <b>จุดแข็ง</b> มาใช้ร่วมกับ <b>โอกาส</b> เพื่อลดผลกระทบจาก <b>จุดอ่อน</b> และป้องกัน <b>อุปสรรค</b> ที่อาจเกิดขึ้นในการทำงานจริง
          </div>
        </div>
      </div>
    </>
  );
}
