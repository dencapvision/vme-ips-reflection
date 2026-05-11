import React from "react";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import { Chip, ProgressBar, ProgressRing, SectionHeader } from "@/components/UI";
import { TabBar } from "@/components/TabBar";

import { getProfile } from "@/app/actions/profile";

export default async function HomePage() {
  const profile = await getProfile();
  const displayName = profile?.first_name ? `คุณ${profile.first_name}` : "กัลยาณมิตร";

  return (
    <>
      <div style={{
        background: "linear-gradient(180deg, #FDF1E6 0%, var(--cream) 100%)",
        padding: "30px 22px 20px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--ink-500)", marginBottom: 2 }}>{new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>สวัสดี {displayName}</div>
          </div>
          <button style={{
            width: 38, height: 38, borderRadius: 19, background: "var(--white)",
            border: "1px solid var(--ink-200)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icons.bell size={18} stroke="var(--ink-700)"/>
          </button>
        </div>

        <div style={{
          background: "var(--white)", borderRadius: "var(--r-lg)",
          padding: 18, border: "1px solid var(--ink-200)",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <ProgressRing value={62} size={68}/>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              color: "var(--saffron-600)", textTransform: "uppercase",
              fontFamily: "var(--font-en)",
            }}>YOUR REFLECTION</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2, marginBottom: 6 }}>
              ทบทวน 5 จาก 8 หัวข้อแล้ว
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-600)" }}>
              เหลือ 3 หัวข้อ · ใช้เวลาประมาณ 12 นาที
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "4px 22px 20px" }}>
        <SectionHeader title="ทำต่อจากที่ค้างไว้" en="CONTINUE"/>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <ContinueCard
            href="/topics/2-3"
            chip="หัวข้อ 2.3" title="โครงการ AI และระบบการตั้งรับ"
            stage="กำลังทำ So What · ขั้นที่ 2/3" progress={66}
          />
          <ContinueCard
            href="/smart"
            chip="แผนกลยุทธ์" title="SMART Goal — เป้าปี 2569"
            stage="ค้างไว้ที่ Measurable" progress={40} color="sage"
          />
        </div>
      </div>

      {/* Admin Section */}
      {profile?.role?.toLowerCase().includes('admin') && (
        <div style={{ padding: "0 22px 20px" }}>
          <SectionHeader title="แผงควบคุมผู้ดูแล" en="ADMIN PANEL"/>
          <Link href="/admin/knowledge" style={{ 
            display: "flex", alignItems: "center", gap: 14, textDecoration: "none", color: "inherit",
            padding: "16px", background: "#F9F1FF", borderRadius: "var(--r-lg)", border: "1px solid #E5D5F2"
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 6px rgba(182,143,214,0.1)"
            }}><Icons.book size={22} stroke="#8E6DA1"/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#4A345E" }}>จัดการคลังความรู้ AI</div>
              <div style={{ fontSize: 12, color: "#8E6DA1", marginTop: 2 }}>อัปโหลดและฝึกฝนน้องแก้วใสด้วย PDF</div>
            </div>
            <Icons.arrow size={18} stroke="#8E6DA1"/>
          </Link>
        </div>
      )}

      {/* น้องแก้วใส banner */}
      <div style={{ padding: "0 22px 14px" }}>
        <Link href="/kaewsai" style={{
          display: "flex", alignItems: "center", gap: 14,
          background: "linear-gradient(135deg, #F9F1FF 0%, #FFF5F9 100%)",
          borderRadius: "var(--r-lg)", padding: "14px 16px",
          border: "1px solid #E5D5F2", textDecoration: "none",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 24, flexShrink: 0,
            background: "linear-gradient(135deg, #B68FD6 0%, #F2A2C0 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(182,143,214,0.3)",
          }}>
            <Icons.lotus size={26} stroke="#fff" sw={1.6}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#8E6DA1", fontFamily: "var(--font-en)", marginBottom: 3 }}>AI FACILITATOR</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#4A345E" }}>น้องแก้วใส 🙏</div>
            <div style={{ fontSize: 12, color: "#6A5A7A", marginTop: 1 }}>ยอดกัลยาณมิตร พร้อมปรึกษาเรื่องทุน IPS ค่ะ</div>
          </div>
          <div style={{
            padding: "7px 14px", borderRadius: "var(--r-pill)",
            background: "#A67BCA", color: "#fff",
            fontSize: 12.5, fontWeight: 600, flexShrink: 0,
          }}>คุยเลย</div>
        </Link>
      </div>

      <div style={{ padding: "0 22px 20px" }}>
        <SectionHeader title="เครื่องมือด่วน" en="QUICK ACTIONS"/>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <QuickAction href="/reflect" Icon={Icons.spark}  title="What / So What" sub="ถอดบทเรียน"      color="saffron"/>
          <QuickAction href="/swot"    Icon={Icons.layers} title="SWOT 4 ช่อง"   sub="วิเคราะห์สถานการณ์" color="sage"/>
          <QuickAction href="/smart"   Icon={Icons.target} title="SMART Goal"    sub="ตั้งเป้า 2569"     color="gold"/>
          <QuickAction href="/kaewsai"  Icon={Icons.ai}     title="น้องแก้วใส"    sub="AI ที่ปรึกษา"        color="plum"/>
        </div>
      </div>

      <div style={{ padding: "0 22px 30px" }}>
        <SectionHeader title="ติดตามผลครั้งต่อไป" en="FOLLOW-UP"/>
        <div className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 56, borderRadius: 10, background: "var(--saffron-50)",
            border: "1px solid var(--saffron-100)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-en)",
          }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: "var(--saffron-600)", textTransform: "uppercase" }}>JUN</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: "var(--saffron-700)", lineHeight: 1 }}>14</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>นัดติดตามผลกลุ่มที่ 4</div>
            <div style={{ fontSize: 12, color: "var(--ink-600)", marginTop: 2 }}>14 มิ.ย. · 19:00 · Zoom</div>
          </div>
          <Icons.arrow size={18} stroke="var(--ink-500)"/>
        </div>
      </div>

      <TabBar/>
    </>
  );
}

function ContinueCard({
  chip, title, stage, progress, color = "saffron", href,
}: { chip: string; title: string; stage: string; progress: number; color?: "saffron" | "sage"; href: string }) {
  const trackColor = color === "sage" ? "#6E8B6B" : "var(--saffron-500)";
  return (
    <Link href={href} className="card" style={{
      padding: 14, display: "flex", alignItems: "center", gap: 14, textDecoration: "none",
    }}>
      <div style={{ flex: 1 }}>
        <Chip variant={color}>{chip}</Chip>
        <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 8, marginBottom: 4, lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginBottom: 8 }}>{stage}</div>
        <ProgressBar value={progress} color={trackColor}/>
      </div>
      <div style={{
        width: 38, height: 38, borderRadius: 19, background: "var(--saffron-500)", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icons.arrow size={18} sw={2}/>
      </div>
    </Link>
  );
}

function QuickAction({
  Icon, title, sub, color, href,
}: { Icon: (p?: any) => React.ReactElement; title: string; sub: string; color: "saffron" | "sage" | "gold" | "plum"; href: string }) {
  const map = {
    saffron: { bg: "var(--saffron-50)",  fg: "var(--saffron-600)", br: "var(--saffron-100)" },
    sage:    { bg: "#EEF3ED",            fg: "#3D5C3B",            br: "#D6E1D4" },
    gold:    { bg: "#F8F1DD",            fg: "#6E5418",            br: "#E8DBB1" },
    plum:    { bg: "#F0E9F1",            fg: "#4A2D4D",            br: "#DDD0DE" },
  }[color];
  return (
    <Link href={href} style={{
      background: map.bg, border: `1px solid ${map.br}`,
      borderRadius: "var(--r-lg)", padding: 14, minHeight: 96,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      textDecoration: "none",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.7)",
        display: "inline-flex", alignItems: "center", justifyContent: "center", color: map.fg,
      }}>
        <Icon size={20} stroke={map.fg}/>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: map.fg }}>{title}</div>
        <div style={{ fontSize: 11, color: "var(--ink-600)", marginTop: 1 }}>{sub}</div>
      </div>
    </Link>
  );
}
