import React from "react";
import { Icons } from "@/components/Icons";
import { AppHeader } from "@/components/AppHeader";
import { Chip, SectionHeader } from "@/components/UI";
import { TabBar } from "@/components/TabBar";
import LibraryAI from "@/components/LibraryAI";
import LibraryContent from "./LibraryContent";

export default function LibraryPage() {
  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <AppHeader large title="คลังความรู้" subtitle="LIBRARY"
          trailing={<button style={{ width: 38, height: 38, borderRadius: 19, background: "var(--white)", border: "1px solid var(--ink-200)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icons.search size={18} stroke="var(--ink-700)"/>
          </button>}/>
      </div>

      <div style={{ padding: "4px 22px 30px" }}>
        <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
                <SectionHeader title="ถามน้องแก้วใส AI" en="SMART KNOWLEDGE SEARCH" />
            </div>
            <React.Suspense fallback={<div>กำลังโหลดผู้ช่วย AI...</div>}>
                <LibraryAI />
            </React.Suspense>
        </div>

        <React.Suspense fallback={<div className="animate-pulse h-96 bg-gray-50 rounded-3xl" />}>
          <LibraryContent />
        </React.Suspense>

        <div style={{ marginTop: 32 }}>
          <SectionHeader title="หมวดหมู่ความรู้" en="CATEGORIES" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16, marginBottom: 18 }}>
            <Cat Icon={Icons.lotus}  label="ธัมมชโย" sub="คำสอนหลวงพ่อ" color="saffron"/>
            <Cat Icon={Icons.lotus}  label="ทัตตะชีโว" sub="คำสอนหลวงพ่อ" color="sage"/>
            <Cat Icon={Icons.book}   label="IPS"   sub="8 บทความ"  color="gold"/>
            <Cat Icon={Icons.layers} label="หลักสูตร" sub="6 บทความ"  color="plum"/>
            <Cat Icon={Icons.user}   label="คู่มือ VME" sub="5 บทความ" color="sage"/>
            <Cat Icon={Icons.video}  label="สื่อ PR"   sub="10 ไฟล์"   color="gold"/>
          </div>
        </div>
      </div>

      <TabBar/>
    </>
  );
}

function Cat({ Icon, label, sub, color }: {
  Icon: (p?: any) => React.ReactElement; label: string; sub: string; color: "saffron" | "sage" | "gold" | "plum";
}) {
  const map = {
    saffron: { bg: "var(--saffron-50)",  fg: "var(--saffron-700)", br: "var(--saffron-100)" },
    sage:    { bg: "#EEF3ED",            fg: "#3D5C3B",            br: "#D6E1D4" },
    gold:    { bg: "#F8F1DD",            fg: "#6E5418",            br: "#E8DBB1" },
    plum:    { bg: "#F0E9F1",            fg: "#4A2D4D",            br: "#DDD0DE" },
  }[color];
  return (
    <div style={{ background: map.bg, border: `1px solid ${map.br}`, borderRadius: "var(--r-lg)", padding: 14, minHeight: 100 }}>
      <Icon size={26} stroke={map.fg}/>
      <div style={{ fontSize: 16, fontWeight: 600, color: map.fg, marginTop: 10 }}>{label}</div>
      <div style={{ fontSize: 11, color: "var(--ink-600)", marginTop: 2 }}>{sub}</div>
    </div>
  );
}
