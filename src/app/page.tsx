import React from "react";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import { Chip, ProgressBar, ProgressRing, SectionHeader } from "@/components/UI";
import { TabBar } from "@/components/TabBar";

import { getProfile } from "@/app/actions/profile";

import { getUserProgress } from "@/app/actions/responses";

export default async function HomePage() {
  const profile = await getProfile();
  const progress = await getUserProgress();
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
          <ProgressRing value={progress.percentage} size={68}/>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              color: "var(--saffron-600)", textTransform: "uppercase",
              fontFamily: "var(--font-en)",
            }}>YOUR REFLECTION</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2, marginBottom: 6 }}>
              ทบทวน {progress.completed} จาก {progress.total} หัวข้อแล้ว
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-600)" }}>
              {progress.completed === progress.total ? "ยอดเยี่ยม! คุณสรุปบทเรียนครบแล้ว" : `เหลือ ${progress.total - progress.completed} หัวข้อที่ยังไม่ได้เริ่ม`}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "10px 22px 20px" }}>
        <SectionHeader title="เมนูหลัก" en="MAIN MENU"/>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* 1. แผนการทำงาน ปี 2569 */}
          <Link href="/smart" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="card" style={{ padding: 18, display: "flex", alignItems: "center", gap: 16, borderLeft: "4px solid #6E8B6B" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#EEF3ED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icons.target size={22} stroke="#3D5C3B"/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>1. แผนการทำงาน ปี 2569</div>
                <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 2 }}>วางแผนกลยุทธ์เพื่อพิชิตเป้าหมาย</div>
              </div>
              <Icons.arrow size={18} stroke="var(--ink-300)"/>
            </div>
          </Link>

          {/* 2. สรุปการเรียนรู้ (สั้นๆ) */}
          <Link href="/reflect" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="card" style={{ padding: 18, display: "flex", alignItems: "center", gap: 16, borderLeft: "4px solid var(--saffron-400)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--saffron-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icons.spark size={22} stroke="var(--saffron-600)"/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>2. สรุปการเรียนรู้ (สั้นๆ)</div>
                <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 2 }}>ถอดบทเรียน What / So What / Now What</div>
              </div>
              <Icons.arrow size={18} stroke="var(--ink-300)"/>
            </div>
          </Link>
        </div>
      </div>

      {/* 3. เอไอน้องแก้วใส banner */}
      <div style={{ padding: "0 22px 24px" }}>
        <SectionHeader title="ที่ปรึกษา AI" en="AI ASSISTANT"/>
        <Link href="/kaewsai" style={{
          display: "flex", alignItems: "center", gap: 16,
          background: "linear-gradient(135deg, #fff 0%, #FBF7F1 100%)",
          borderRadius: "24px", padding: "20px",
          border: "1px solid #F3E4D4", textDecoration: "none",
          boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", background: "rgba(245, 158, 11, 0.05)", borderRadius: "50%" }} />
          
          <div style={{
            width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
            overflow: "hidden",
            boxShadow: "0 8px 20px rgba(217, 119, 6, 0.3)",
            border: "2.5px solid white",
            position: "relative",
            zIndex: 1
          }}>
            <img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: "#B45309", marginBottom: 4 }}>AI FACILITATOR</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1F2937" }}>3. น้องแก้วใส 🙏</div>
            <div style={{ fontSize: 13, color: "#4B5563", marginTop: 2, lineHeight: "1.4" }}>ยอดกัลยาณมิตร พร้อมปรึกษาเรื่องทุน IPS ค่ะ</div>
          </div>
          <div style={{
            padding: "10px 20px", borderRadius: "14px",
            background: "#1F2937", color: "#fff",
            fontSize: 14, fontWeight: 700, flexShrink: 0,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            position: "relative",
            zIndex: 1
          }}>คุยเลย</div>
        </Link>
      </div>

      {/* Admin Section */}
      {profile?.role?.toLowerCase().includes('admin') && (
        <div style={{ padding: "0 22px 40px" }}>
          <SectionHeader title="ส่วนของผู้ดูแล" en="ADMIN PANEL"/>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/admin/summary" style={{ 
              display: "flex", alignItems: "center", gap: 14, textDecoration: "none", color: "inherit",
              padding: "16px", background: "#F0EFFF", borderRadius: "var(--r-lg)", border: "1px solid #D5D2F2"
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icons.users size={22} stroke="#5E5BA1"/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#3A376E" }}>สรุปข้อมูลรายบุคคล</div>
                <div style={{ fontSize: 12, color: "#5E5BA1", marginTop: 2 }}>ดูความคืบหน้าการกรอกของสมาชิก</div>
              </div>
              <Icons.arrow size={18} stroke="#5E5BA1"/>
            </Link>

            <Link href="/admin/knowledge" style={{ 
              display: "flex", alignItems: "center", gap: 14, textDecoration: "none", color: "inherit",
              padding: "16px", background: "#F9F1FF", borderRadius: "var(--r-lg)", border: "1px solid #E5D5F2"
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icons.book size={22} stroke="#8E6DA1"/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#4A345E" }}>จัดการคลังความรู้ AI</div>
                <div style={{ fontSize: 12, color: "#8E6DA1", marginTop: 2 }}>อัปโหลดและฝึกฝนน้องแก้วใสด้วย PDF</div>
              </div>
              <Icons.arrow size={18} stroke="#8E6DA1"/>
            </Link>
          </div>
        </div>
      )}
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
