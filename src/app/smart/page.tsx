import { Icons } from "@/components/Icons";
import { TopHeaderBack } from "@/components/AppHeader";
import { Chip, DualLabel } from "@/components/UI";
import { ReflectionForm } from "@/components/ReflectionForm";

export default function SmartPage() {
  const smartFields = [
    { id: "specific", label: "S - Specific (ชัดเจน)", en: "SPECIFIC", placeholder: "เป้าหมายคืออะไร? ใคร? ที่ไหน? อย่างไร?...", color: "var(--ink-700)", tint: "var(--white)", border: "var(--ink-200)" },
    { id: "measurable", label: "M - Measurable (วัดผลได้)", en: "MEASURABLE", placeholder: "วัดผลด้วยตัวเลขอย่างไร? เช่น 5 รูป, 10 คน...", color: "var(--ink-700)", tint: "var(--white)", border: "var(--ink-200)" },
    { id: "achievable", label: "A - Achievable (ทำได้จริง)", en: "ACHIEVABLE", placeholder: "มีทรัพยากรพอไหม? จะทำให้สำเร็จได้อย่างไร?...", color: "var(--ink-700)", tint: "var(--white)", border: "var(--ink-200)" },
    { id: "relevant", label: "R - Relevant (สอดคล้อง)", en: "RELEVANT", placeholder: "ทำไปทำไม? สอดคล้องกับเป้าหมายรวมอย่างไร?...", color: "var(--ink-700)", tint: "var(--white)", border: "var(--ink-200)" },
    { id: "timebound", label: "T - Time-bound (มีเวลา)", en: "TIME-BOUND", placeholder: "จะทำให้เสร็จเมื่อไหร่? กำหนดเดดไลน์...", color: "var(--ink-700)", tint: "var(--white)", border: "var(--ink-200)" },
  ];

  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <TopHeaderBack title="SMART Goal · เป้าหมายปี 2569"/>
      </div>

      <div style={{ padding: "0 22px 100px" }}>
        <div style={{ marginBottom: 20 }}>
          <DualLabel en="SMART GOAL" th="แผนพิชิตเป้าหมายปี 2569"/>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
            <Chip variant="sage">กลยุทธ์หลัก</Chip>
            <span style={{ fontSize: 11, color: "var(--ink-500)" }}>· กรอกให้ครบทุกช่องเพื่อความชัดเจน</span>
          </div>
        </div>

        <div className="card" style={{
          padding: 16, marginBottom: 20,
          background: "linear-gradient(135deg, #FDF1E6 0%, var(--white) 100%)",
          borderColor: "var(--saffron-100)",
        }}>
          <div style={{
            fontSize: 11, color: "var(--saffron-700)", fontFamily: "var(--font-en)",
            fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4,
          }}>THE BIG GOAL</div>
          <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.35 }}>
            เขียนเป้าหมายใหญ่ในใจคุณ แล้วค่อยแยกย่อยตามหลัก SMART ด้านล่าง
          </div>
        </div>

        <ReflectionForm category="smart" fields={smartFields} layout="list" />

        <div style={{ marginTop: 24, padding: 16, background: "var(--ink-50)", borderRadius: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-500)", marginBottom: 8, textTransform: "uppercase" }}>Quick Tip</div>
          <p style={{ fontSize: 13, color: "var(--ink-600)", lineHeight: 1.5, margin: 0 }}>
            เป้าหมายที่ <b>SMART</b> จะช่วยให้น้องแก้วใส (AI) วิเคราะห์และให้คำปรึกษาได้แม่นยำยิ่งขึ้น!
          </p>
        </div>
      </div>
    </>
  );
}
