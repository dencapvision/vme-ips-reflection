import React from "react";
import { Icons } from "@/components/Icons";
import { TopHeaderBack } from "@/components/AppHeader";
import { DualLabel, Toggle } from "@/components/UI";

export default function ExportPage() {
  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <TopHeaderBack title="ส่งออก & แชร์"/>
      </div>

      <div style={{ padding: "0 22px 30px" }}>
        <div style={{ marginBottom: 14 }}>
          <DualLabel en="EXPORT" th="สรุปบทเรียนของคุณ"/>
        </div>

        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>สรุปบทเรียน VME · IPS 2569</div>
          <div style={{ fontSize: 12, color: "var(--ink-600)", marginTop: 2 }}>
            8 หัวข้อ · 12 บันทึก · 1 SMART Goal · 4 หน้า PDF
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-500)",
          fontFamily: "var(--font-en)", marginBottom: 8 }}>FORMAT</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
          <FormatCard Icon={Icons.doc}   label="PDF"   sub="สำหรับพิมพ์ · 4 หน้า" active/>
          <FormatCard Icon={Icons.share} label="รูปภาพ" sub="แชร์ลงโซเชียล · 1080×1080"/>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-500)",
          fontFamily: "var(--font-en)", marginBottom: 8 }}>INCLUDE · เลือกหัวข้อที่จะรวม</div>
        <div className="card" style={{ overflow: "hidden", marginBottom: 16 }}>
          {[
            { label: "สรุปแต่ละหัวข้อบรรยาย (8 หัวข้อ)", on: true },
            { label: "Reflection · What / So What / Now What", on: true },
            { label: "SWOT Analysis", on: true },
            { label: "Success Case · กรณีศึกษา", on: false },
            { label: "SMART Goal + แผนกลยุทธ์ปี 2569", on: true },
            { label: "บันทึกส่วนตัวจากสมุด Reflection", on: false },
          ].map((s, i, arr) => (
            <div key={i} style={{
              padding: "13px 16px", display: "flex", alignItems: "center", gap: 12,
              borderBottom: i < arr.length - 1 ? "1px solid var(--ink-100)" : "none",
            }}>
              <Toggle on={s.on}/>
              <div style={{ flex: 1, fontSize: 13.5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <button className="btn-saffron" style={{ width: "100%" }}>
          <Icons.download size={16} sw={2}/> ส่งออก PDF
        </button>
      </div>
    </>
  );
}

function FormatCard({ Icon, label, sub, active }: {
  Icon: (p?: any) => React.ReactElement; label: string; sub: string; active?: boolean;
}) {
  return (
    <div style={{
      padding: 14, borderRadius: "var(--r-lg)",
      border: active ? "2px solid var(--saffron-500)" : "1px solid var(--ink-200)",
      background: active ? "var(--saffron-50)" : "var(--white)",
    }}>
      <Icon size={22} stroke={active ? "var(--saffron-700)" : "var(--ink-700)"}/>
      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8, color: active ? "var(--saffron-700)" : "var(--ink-900)" }}>{label}</div>
      <div style={{ fontSize: 11, color: "var(--ink-600)", marginTop: 1 }}>{sub}</div>
    </div>
  );
}
