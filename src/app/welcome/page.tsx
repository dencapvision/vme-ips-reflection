import Link from "next/link";
import { Icons } from "@/components/Icons";

export default function WelcomePage() {
  return (
    <div style={{
      background: "linear-gradient(180deg, #FDF1E6 0%, #FBF7F1 60%)",
      minHeight: "100vh", padding: "40px 24px 32px",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 12px 6px 8px", borderRadius: 99,
          background: "var(--white)", border: "1px solid var(--ink-200)",
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 11, background: "var(--saffron-500)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
            fontFamily: "var(--font-en)", fontWeight: 700, fontSize: 11,
          }}>I</div>
          <span style={{ fontFamily: "var(--font-en)", fontSize: 12, fontWeight: 600 }}>IPS Reflect</span>
        </div>
        <span style={{ fontSize: 11, color: "var(--ink-500)", fontFamily: "var(--font-en)" }}>v.2569</span>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <svg width="240" height="240" viewBox="0 0 240 240" style={{ position: "absolute" }}>
          <circle cx="120" cy="120" r="110" fill="none" stroke="var(--saffron-200)" strokeDasharray="2 5" opacity="0.7"/>
          <circle cx="120" cy="120" r="78"  fill="none" stroke="var(--saffron-300)" strokeDasharray="2 5" opacity="0.6"/>
          <circle cx="120" cy="120" r="48"  fill="var(--saffron-100)"/>
          <circle cx="120" cy="120" r="48"  fill="none" stroke="var(--saffron-400)" strokeWidth="1"/>
        </svg>
        <svg width="86" height="86" viewBox="0 0 100 100" style={{ position: "relative" }}>
          <g stroke="var(--saffron-700)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M50 22c-7 11-7 22 0 33 7-11 7-22 0-33z" fill="var(--saffron-50)"/>
            <path d="M22 48c-1 8 8 18 28 18s29-10 28-18c-7 5-15 8-28 8s-21-3-28-8z" fill="var(--saffron-100)"/>
            <path d="M14 60c4 12 18 18 36 18s32-6 36-18"/>
            <path d="M50 22v33"/>
          </g>
        </svg>
      </div>

      <div>
        <div style={{
          fontFamily: "var(--font-en)", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.16em", color: "var(--saffron-600)", marginBottom: 8,
        }}>VME · IPS REFLECTION</div>
        <h1 style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.2, marginBottom: 10, letterSpacing: "-0.01em" }}>
          ทบทวนบทเรียน<br/>วางแผนสร้าง<span style={{ color: "var(--saffron-600)" }}>ศาสนทายาท</span>
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-600)", lineHeight: 1.55, marginBottom: 24 }}>
          สมุดสรุปบทเรียนส่วนตัว สำหรับอาสาการศึกษา VME
          หลังเข้าร่วมโครงการอบรม ณ ศูนย์ปฏิบัติธรรมอโยธยา DCI
        </p>

        <Link href="/" className="btn-saffron" style={{ width: "100%", padding: "16px 20px", fontSize: 16, textDecoration: "none" }}>
          เริ่มทบทวน <Icons.arrow size={18} sw={2}/>
        </Link>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "var(--ink-500)" }}>
          ลงชื่อเข้าใช้ด้วยรหัสผู้เข้าอบรม
        </div>
      </div>
    </div>
  );
}
