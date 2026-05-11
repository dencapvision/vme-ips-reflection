import Link from "next/link";
import { Icons } from "@/components/Icons";

export default function WelcomePage() {
  return (
    <div style={{
      background: "#FFF",
      minHeight: "100vh",
      maxWidth: 480,
      margin: "0 auto",
      fontFamily: "var(--font-th)",
      color: "var(--ink-900)",
      overflowX: "hidden",
    }}>
      {/* ─── Hero Section ─── */}
      <section style={{
        background: "linear-gradient(180deg, #FDF1E6 0%, #FFF 100%)",
        padding: "40px 24px 60px",
        textAlign: "center",
        position: "relative",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 14px", borderRadius: 99,
          background: "rgba(255,255,255,0.8)", border: "1px solid #EED8C1",
          marginBottom: 24,
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: 10, background: "var(--saffron-500)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
            fontFamily: "var(--font-en)", fontWeight: 800, fontSize: 10,
          }}>I</div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#8B5E3C", letterSpacing: "0.02em" }}>IPS REFLECT v2026</span>
        </div>

        <h1 style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.2, marginBottom: 16, color: "#4A3421" }}>
          เปลี่ยน <span style={{ color: "var(--saffron-600)" }}>เป้าหมาย</span><br/>
          ให้เป็น <span style={{ color: "#7C5D99" }}>ความสำเร็จ</span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--ink-600)", lineHeight: 1.6, marginBottom: 32 }}>
          ระบบจัดการตัวตนดิจิทัลและสมุดบันทึกปัญญา<br/>
          สำหรับเยาวชน IPS และอาสาการศึกษา VME
        </p>

        {/* Hero Visual */}
        <div style={{ position: "relative", height: 200, marginBottom: 20 }}>
            <svg width="100%" height="100%" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="120" cy="100" r="80" fill="url(#grad1)" fillOpacity="0.1" />
                <defs>
                    <linearGradient id="grad1" x1="120" y1="20" x2="120" y2="180" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#D45F1C" />
                        <stop offset="1" stopColor="#B68FD6" />
                    </linearGradient>
                </defs>
                <path d="M120 40L145 100L120 160L95 100L120 40Z" fill="#D45F1C" fillOpacity="0.2" stroke="#D45F1C" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="120" cy="100" r="30" fill="white" stroke="#D45F1C" strokeWidth="2" />
                <path d="M115 100L120 105L130 95" stroke="#D45F1C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link href="/register" className="btn-saffron" style={{ width: "100%", padding: "18px 24px", fontSize: 17, fontWeight: 700, textDecoration: "none", boxShadow: "0 10px 25px rgba(212,95,28,0.2)" }}>
                เริ่มสร้างตัวตนของคุณ <Icons.arrow size={20} sw={2.5}/>
            </Link>
            <Link href="/login" style={{ fontSize: 15, color: "#8B5E3C", fontWeight: 600, textDecoration: "none", padding: "10px" }}>
                มีรหัสผ่านแล้ว? เข้าสู่ระบบที่นี่
            </Link>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section style={{ padding: "40px 22px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, textAlign: "center", color: "#33261A" }}>
          ฟีเจอร์ที่จะช่วยให้คุณก้าวกระโดด
        </h2>

        <div style={{ display: "grid", gap: 16 }}>
            <FeatureCard
                Icon={Icons.user}
                color="#D45F1C"
                title="Digital ID Card"
                desc="สร้างนามบัตรดิจิทัลพร้อมคุณธรรมประจำตัว แชร์ให้โลกเห็นถึงเป้าหมายและตัวตนที่แท้จริงของคุณ"
            />
            <FeatureCard
                Icon={Icons.spark}
                color="#6E8B6B"
                title="Wisdom Reflection"
                desc="ระบบถอดบทเรียน What / So What ช่วยให้คุณสรุปปัญญาจากการฝึกตัวได้อย่างเป็นระบบ"
            />
            <FeatureCard
                Icon={Icons.ai}
                color="#A67BCA"
                title="Nong Kaew Sai"
                desc="คุยกับน้องแก้วใส AI Facilitator ที่ปรึกษาส่วนตัวที่จะคอยแนะนำการตอบข้อโต้แย้งและให้กำลังใจ"
            />
        </div>
      </section>

      {/* ─── Kaew Sai Promo ─── */}
      <section style={{
          padding: "30px 22px",
          background: "linear-gradient(135deg, #F9F1FF 0%, #FFF5F9 100%)",
          margin: "0 22px",
          borderRadius: 24,
          border: "1px solid #E5D5F2",
          display: "flex", gap: 16, alignItems: "center"
      }}>
          <div style={{
              width: 60, height: 60, borderRadius: 30, flexShrink: 0,
              background: "linear-gradient(135deg, #B68FD6 0%, #F2A2C0 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(182,143,214,0.3)"
          }}>
              <Icons.lotus size={32} stroke="#fff" sw={1.5}/>
          </div>
          <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#8E6DA1", marginBottom: 2 }}>MEET YOUR MENTOR</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#4A3A5E" }}>พบน้องแก้วใส 🙏</div>
              <p style={{ fontSize: 13, color: "#6A5A7A", marginTop: 4, lineHeight: 1.5 }}>
                  ที่ปรึกษา AI ผู้เชี่ยวชาญโครงการ IPS พร้อมช่วยคุณออกแบบคำพูดและสร้างแรงบันดาลใจ
              </p>
          </div>
      </section>

      {/* ─── Footer / Social Proof ─── */}
      <section style={{ padding: "60px 24px 80px", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-400)", letterSpacing: "0.1em", marginBottom: 24 }}>
              TRUSTED BY DCI COMMUNITY
          </div>
          <div style={{ opacity: 0.5, display: "flex", justifyContent: "center", gap: 30 }}>
              <span style={{ fontWeight: 800, fontSize: 18 }}>DCI</span>
              <span style={{ fontWeight: 800, fontSize: 18 }}>NESE</span>
              <span style={{ fontWeight: 800, fontSize: 18 }}>VME</span>
              <span style={{ fontWeight: 800, fontSize: 18 }}>IPS</span>
          </div>

          <div style={{ marginTop: 48, fontSize: 13, color: "var(--ink-500)" }}>
              © 2026 IPS Reflect · All rights reserved<br/>
              พัฒนาโดยทีมงานกัลยาณมิตร เพื่ออนาคตของศาสนทายาท
          </div>
      </section>

      <style>{`
          .btn-saffron {
              background: var(--saffron-500);
              color: white;
              border-radius: 16px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              transition: transform 0.2s, background 0.2s;
              border: none;
              cursor: pointer;
          }
          .btn-saffron:active {
              transform: scale(0.98);
              background: var(--saffron-600);
          }
      `}</style>
    </div>
  );
}

function FeatureCard({ Icon, color, title, desc }: { Icon: any, color: string, title: string, desc: string }) {
    return (
        <div style={{
            background: "white", padding: 20, borderRadius: 20,
            border: "1px solid var(--ink-200)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
        }}>
            <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: color + "15", color: color,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16
            }}>
                <Icon size={24} stroke={color} sw={2}/>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
            <p style={{ fontSize: 14, color: "var(--ink-600)", lineHeight: 1.6 }}>{desc}</p>
        </div>
    );
}
