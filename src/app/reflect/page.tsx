import * as React from "react";
import { Icons } from "@/components/Icons";
import { TopHeaderBack } from "@/components/AppHeader";
import { Chip, DualLabel } from "@/components/UI";
import { ReflectionForm } from "@/components/ReflectionForm";

export default function ReflectionPage() {
  const reflectFields = [
    { id: "new_skills", label: "1. ความรู้ และ ทักษะใหม่ๆที่ได้รับในครั้งนี้", en: "NEW KNOWLEDGE & SKILLS", placeholder: "สิ่งที่ท่านได้เรียนรู้และพัฒนาขึ้นจากการสัมมนาในครั้งนี้...", color: "var(--ink-700)", tint: "var(--white)", border: "var(--ink-200)" },
    { id: "feelings", label: "2. ความรู้สึกที่เกิดขึ้นหลังจากการสัมมนา", en: "FEELINGS & REFLECTION", placeholder: "ความรู้สึกในใจหลังจบกิจกรรม (ดีใจ, มีพลัง, เห็นความหวัง...)", color: "var(--ink-700)", tint: "var(--white)", border: "var(--ink-200)" },
    { id: "intentions", label: "3. ความตั้งใจที่ท่านจะทำให้เกิดขึ้นใหม่ในการทำหน้าที่ VME", en: "NEW INTENTIONS", placeholder: "ความตั้งใจหรือเป้าหมายใหม่ที่อยากทำให้สำเร็จ...", color: "var(--ink-700)", tint: "var(--white)", border: "var(--ink-200)" },
    { id: "difference", label: "4. การทำหน้าที่ VME ในพื้นที่ มีอะไรบ้างที่ท่านตั้งใจทำให้แตกต่างจากที่เคยทำผ่านมา", en: "DIFFERENT APPROACH", placeholder: "สิ่งที่ท่านจะปรับปรุงหรือเปลี่ยนแปลงในการทำงานจริง...", color: "var(--ink-700)", tint: "var(--white)", border: "var(--ink-200)" },
    { id: "message_to_self", label: "5. ท่านอยากบอกอะไรกับตัวเอง ในวันที่รู้สึกท้อหรือหมดไฟ จะได้ลุกและลุยต่อ", en: "MESSAGE TO SELF", placeholder: "ข้อความให้กำลังใจตัวเองเพื่อเป็นแรงผลักดันในอนาคต...", color: "var(--ink-700)", tint: "var(--white)", border: "var(--ink-200)" },
  ];

  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <TopHeaderBack title="สรุปบทเรียน (Reflection)"/>
      </div>

      <div style={{ padding: "0 22px 100px" }}>
        <div style={{ marginBottom: 20 }}>
          <DualLabel en="REFLECTION JOURNEY" th="ถอดบทเรียนและตั้งเป้าหมาย"/>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <Chip variant="gold">ทบทวนตัวเอง</Chip>
            <Chip>VME Insight</Chip>
          </div>
        </div>

        {/* Task Explanation */}
        <div style={{ 
          background: "var(--saffron-50)", 
          border: "1px solid var(--saffron-200)",
          borderRadius: "var(--r-md)",
          padding: "16px",
          marginBottom: "24px",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ 
            position: "absolute", top: -10, right: -10, opacity: 0.1, color: "var(--saffron-600)" 
          }}>
            <Icons.ai size={80} />
          </div>
          <h3 style={{ 
            fontSize: "14px", fontWeight: 700, color: "var(--saffron-800)", marginBottom: "8px",
            display: "flex", alignItems: "center", gap: "6px"
          }}>
            <Icons.ai size={16} /> แนวทางการสรุปบทเรียน
          </h3>
          <p style={{ fontSize: "12px", color: "var(--saffron-900)", lineHeight: "1.6", margin: 0 }}>
            การสะท้อนความคิด (Reflection) คือกระบวนการตกตะกอนสิ่งที่ได้รับ เพื่อเปลี่ยนประสบการณ์ให้เป็นพลังในการก้าวเดินต่อไป 
            โปรดใช้เวลาสั้นๆ ทบทวนความรู้สึกและความตั้งใจของท่านผ่าน 5 คำถามสำคัญนี้ เพื่อสร้าง Roadmap ส่วนบุคคลในการทำหน้าที่ VME ให้ดียิ่งขึ้น
          </p>
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
