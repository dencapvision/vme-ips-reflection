import * as React from "react";
import { Icons } from "@/components/Icons";
import { TopHeaderBack } from "@/components/AppHeader";
import { Chip, DualLabel } from "@/components/UI";
import { ReflectionForm } from "@/components/ReflectionForm";

export default function ReflectionPage() {
  const reflectFields = [
    { id: "what", label: "1. WHAT - ทำอะไรมา?", en: "WHAT", placeholder: "เป้าหมายและผลลัพธ์ที่เกิดขึ้นในปีที่ผ่านมา...", color: "var(--ink-700)", tint: "var(--white)", border: "var(--ink-200)" },
    { id: "sowhat", label: "2. SO WHAT - เห็นอะไรบ้าง?", en: "SO WHAT", placeholder: "สังเกตเห็นอะไร? ความท้าทาย สิ่งดีๆ โอกาสใหม่ๆ...", color: "var(--ink-700)", tint: "var(--white)", border: "var(--ink-200)" },
    { id: "nowwhat", label: "3. NOW WHAT - จะทำอะไรต่อ?", en: "NOW WHAT", placeholder: "บทสรุปที่จะนำไปทำต่อในปี 2569 คืออะไร?...", color: "var(--ink-700)", tint: "var(--white)", border: "var(--ink-200)" },
  ];

  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <TopHeaderBack title="สรุปบทเรียน (Reflection)"/>
      </div>

      <div style={{ padding: "0 22px 100px" }}>
        <div style={{ marginBottom: 20 }}>
          <DualLabel en="WHAT / SO WHAT / NOW WHAT" th="ถอดบทเรียนสั้นๆ"/>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <Chip variant="gold">ทบทวนตัวเอง</Chip>
            <Chip>ส่วนบุคคล</Chip>
          </div>
        </div>

        <ReflectionForm category="reflect" fields={reflectFields} layout="list" />

        <div style={{
          marginTop: 24, padding: 16,
          background: "linear-gradient(135deg, #F0E9F1 0%, #FDF1E6 100%)",
          borderRadius: "var(--r-lg)", border: "1px solid #DDD0DE",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12, background: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icons.ai size={20} stroke="#6B4A6E"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>ถอดบทเรียนลึกกว่าเดิม?</div>
            <div style={{ fontSize: 11, color: "var(--ink-600)" }}>ปรึกษาน้องแก้วใส AI ได้ทันที</div>
          </div>
          <a href="/kaewsai" style={{ 
            padding: "8px 14px", borderRadius: 99, background: "white",
            fontSize: 12, fontWeight: 600, color: "#6B4A6E", border: "1px solid #DDD0DE",
            textDecoration: "none"
          }}>ปรึกษาเลย</a>
        </div>
      </div>
    </>
  );
}
