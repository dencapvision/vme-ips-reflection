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
        background: "linear-gradient(180deg, #FFF9F0 0%, #FFF 100%)",
        padding: "60px 24px 60px",
        textAlign: "center",
        position: "relative",
      }}>
        {/* Decorative background elements */}
        <div style={{
            position: "absolute",
            top: -100, left: "50%",
            transform: "translateX(-50%)",
            width: 400, height: 400,
            background: "radial-gradient(circle, rgba(200, 160, 74, 0.1) 0%, rgba(255, 255, 255, 0) 70%)",
            zIndex: 0,
            pointerEvents: "none"
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 16px", borderRadius: 99,
          background: "#fff", border: "1px solid rgba(200, 160, 74, 0.3)",
          marginBottom: 32,
          boxShadow: "0 4px 12px rgba(200, 160, 74, 0.08)",
          position: "relative", zIndex: 1
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 11, background: "var(--gold-gradient)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
            fontFamily: "var(--font-en)", fontWeight: 800, fontSize: 11,
          }}>I</div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#8B733C", letterSpacing: "0.05em", textTransform: "uppercase" }}>IPS REFLECT · PLATFORM</span>
        </div>

        <h1 style={{ 
            fontSize: 40, 
            fontWeight: 800, 
            lineHeight: 1.1, 
            marginBottom: 20, 
            color: "#3D2B1F",
            letterSpacing: "-0.02em",
            position: "relative", zIndex: 1
        }}>
          เปลี่ยน <span style={{ color: "var(--gold)", textShadow: "0 2px 4px rgba(200, 160, 74, 0.1)" }}>เป้าหมาย</span><br/>
          ให้เป็น <span style={{ color: "#7C5D99" }}>ความสำเร็จ</span>
        </h1>
        <p style={{ fontSize: 17, color: "var(--ink-600)", lineHeight: 1.7, marginBottom: 40, position: "relative", zIndex: 1 }}>
          ระบบจัดการตัวตนดิจิทัลและสมุดบันทึกปัญญา<br/>
          ยกระดับจิตใจ พัฒนาศักยภาพเยาวชน IPS
        </p>

        {/* ─── Premium Golden Sphere Logo ─── */}
        <div style={{ 
            position: "relative", 
            width: 180, height: 180, 
            margin: "0 auto 48px",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1
        }}>
            {/* Outer Glow */}
            <div style={{
                position: "absolute",
                width: "140%", height: "140%",
                background: "radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, rgba(255, 255, 255, 0) 70%)",
                borderRadius: "50%",
                animation: "pulse 4s infinite ease-in-out"
            }} />
            
            {/* The Golden Sphere */}
            <div style={{
                width: 140, height: 140,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FFF4CC 0%, #FFD700 30%, #C8A04A 70%, #8B733C 100%)",
                boxShadow: "inset -10px -10px 30px rgba(0,0,0,0.2), 0 20px 40px rgba(200, 160, 74, 0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid rgba(255, 255, 255, 0.5)",
                position: "relative",
                overflow: "hidden"
            }}>
                {/* Surface Reflection */}
                <div style={{
                    position: "absolute",
                    top: "10%", left: "15%",
                    width: "40%", height: "20%",
                    background: "rgba(255, 255, 255, 0.4)",
                    borderRadius: "50%",
                    filter: "blur(5px)",
                    transform: "rotate(-25deg)"
                }} />
                
                {/* Meditating Buddha Symbol (More detailed/Elegant) */}
                <svg width="85" height="85" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}>
                    {/* Halo/Ushnisha */}
                    <circle cx="12" cy="5" r="1.5" fill="white" fillOpacity="0.9"/>
                    {/* Head */}
                    <circle cx="12" cy="7.5" r="2.5" fill="white" fillOpacity="0.95"/>
                    {/* Body/Shoulders */}
                    <path d="M12 11C9.5 11 7.5 12.5 7 14.5C6.8 15.5 7.5 16.5 8.5 16.5H15.5C16.5 16.5 17.2 15.5 17 14.5C16.5 12.5 14.5 11 12 11Z" fill="white" fillOpacity="0.95"/>
                    {/* Lotus Base */}
                    <path d="M4 19.5C4 18.5 5.5 17.5 7.5 17.5C8.5 17.5 9.5 17.8 10.5 18.2C11 18.4 11.5 18.5 12 18.5C12.5 18.5 13 18.4 13.5 18.2C14.5 17.8 15.5 17.5 16.5 17.5C18.5 17.5 20 18.5 20 19.5C20 20.5 18.5 21.5 16.5 21.5H7.5C5.5 21.5 4 20.5 4 19.5Z" fill="white" fillOpacity="0.8"/>
                </svg>
            </div>
            
            {/* Floating Rings */}
            <div style={{
                position: "absolute",
                width: 170, height: 170,
                border: "1px solid rgba(200, 160, 74, 0.2)",
                borderRadius: "50%",
                transform: "rotateX(75deg)",
                animation: "spin 10s linear infinite"
            }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative", zIndex: 1 }}>
            <Link href="/register" className="btn-premium" style={{ width: "100%", padding: "20px 24px", fontSize: 18, fontWeight: 700, textDecoration: "none" }}>
                เริ่มสร้างตัวตนดิจิทัล <Icons.arrow size={22} sw={2.5}/>
            </Link>
            <Link href="/login" style={{ fontSize: 16, color: "#8B733C", fontWeight: 600, textDecoration: "none", padding: "12px", transition: "opacity 0.2s" }}>
                มีบัญชีอยู่แล้ว? <span style={{ textDecoration: "underline" }}>เข้าสู่ระบบ</span>
            </Link>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section style={{ padding: "40px 22px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#33261A", marginBottom: 8 }}>
                เอกสิทธิ์เฉพาะสมาชิก IPS
            </h2>
            <div style={{ width: 40, height: 3, background: "var(--gold)", margin: "0 auto" }} />
        </div>

        <div style={{ display: "grid", gap: 16 }}>
            <FeatureCard
                Icon={Icons.user}
                color="var(--gold)"
                title="Digital ID Card"
                desc="สร้างนามบัตรดิจิทัลพร้อมคุณธรรมประจำตัว แชร์เป้าหมายและวิสัยทัศน์ของคุณอย่างมืออาชีพ"
            />
            <FeatureCard
                Icon={Icons.spark}
                color="#6E8B6B"
                title="Wisdom Reflection"
                desc="ระบบถอดบทเรียน What / So What สรุปปัญญาจากการทำงานจริงเพื่อการเติบโตที่ยั่งยืน"
            />
            <FeatureCard
                Icon={Icons.ai}
                color="#7C5D99"
                title="Nong Kaew Sai"
                desc="ปรึกษาน้องแก้วใส AI Facilitator ที่คอยแนะนำแนวทางการแก้ปัญหาและให้กำลังใจตลอด 24 ชม."
            />
        </div>
      </section>

      {/* ─── Kaew Sai Promo ─── */}
      <section style={{
          padding: "32px 24px",
          background: "linear-gradient(135deg, #FDF9F2 0%, #FFF 100%)",
          margin: "0 22px",
          borderRadius: 28,
          border: "1px solid rgba(200, 160, 74, 0.2)",
          display: "flex", gap: 20, alignItems: "center",
          boxShadow: "0 10px 30px rgba(200, 160, 74, 0.05)"
      }}>
          <div style={{
              width: 64, height: 64, borderRadius: 32, flexShrink: 0,
              background: "var(--gold-gradient)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 16px rgba(200, 160, 74, 0.2)"
          }}>
              <Icons.lotus size={36} stroke="#fff" sw={1.5}/>
          </div>
          <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--gold)", marginBottom: 4, letterSpacing: "0.05em" }}>AI FACILITATOR</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#4A3A5E" }}>คุยกับน้องแก้วใส 🙏</div>
              <p style={{ fontSize: 14, color: "#6A5A7A", marginTop: 4, lineHeight: 1.6 }}>
                  ผู้ช่วยส่วนตัวที่จะช่วยคุณถอดบทเรียน และให้คำแนะนำตามหลักการ IPS อย่างชาญฉลาด
              </p>
          </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ padding: "60px 24px 80px", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-400)", letterSpacing: "0.15em", marginBottom: 24, textTransform: "uppercase" }}>
              Collaborating Partners
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, opacity: 0.6, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 900, fontSize: 18, color: "var(--ink-900)" }}>DCI</span>
              <span style={{ fontWeight: 900, fontSize: 18, color: "var(--ink-900)" }}>NESE</span>
              <span style={{ fontWeight: 900, fontSize: 18, color: "var(--ink-900)" }}>VME</span>
              <span style={{ fontWeight: 900, fontSize: 18, color: "var(--ink-900)" }}>IPS</span>
          </div>

          <div style={{ marginTop: 48, fontSize: 13, color: "var(--ink-500)", lineHeight: 1.8 }}>
              © 2026 IPS Reflect · Intellectual Property System<br/>
              <span style={{ fontWeight: 500 }}>"ปัญญาบริสุทธิ์ นำมาซึ่งความสำเร็จที่แท้จริง"</span>
          </div>
      </footer>

      <style>{`
          @keyframes pulse {
              0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
              50% { opacity: 0.6; transform: translateX(-50%) scale(1.1); }
          }
          @keyframes spin {
              from { transform: rotateX(75deg) rotateZ(0deg); }
              to { transform: rotateX(75deg) rotateZ(360deg); }
          }
          .btn-premium {
              background: var(--gold-gradient);
              color: white;
              border-radius: 20px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              border: none;
              cursor: pointer;
              box-shadow: 0 10px 25px rgba(200, 160, 74, 0.3);
          }
          .btn-premium:hover {
              transform: translateY(-2px);
              box-shadow: 0 15px 30px rgba(200, 160, 74, 0.4);
          }
          .btn-premium:active {
              transform: translateY(0) scale(0.98);
          }
      `}</style>
    </div>
  );
}

function FeatureCard({ Icon, color, title, desc }: { Icon: any, color: string, title: string, desc: string }) {
    return (
        <div style={{
            background: "white", padding: 24, borderRadius: 24,
            border: "1px solid var(--ink-100)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
            transition: "transform 0.2s ease"
        }}>
            <div style={{
                width: 48, height: 48, borderRadius: 16,
                background: color === "var(--gold)" ? "rgba(200, 160, 74, 0.1)" : color + "15", 
                color: color,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16
            }}>
                <Icon size={26} stroke={color} sw={2}/>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: "#33261A" }}>{title}</h3>
            <p style={{ fontSize: 15, color: "var(--ink-600)", lineHeight: 1.7 }}>{desc}</p>
        </div>
    );
}
