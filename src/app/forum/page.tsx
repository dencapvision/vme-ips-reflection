import { AppHeader } from "@/components/AppHeader";
import { TabBar } from "@/components/TabBar";
import { Icons } from "@/components/Icons";
import Link from "next/link";

export default function ForumPage() {
  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <AppHeader large title="กระทู้สนทนา" subtitle="COMMUNITY FORUM"/>
      </div>

      <div style={{ padding: "4px 22px 100px" }}>
        <div style={{
          background: "linear-gradient(135deg, #F0F7FF 0%, #E3F2FD 100%)",
          borderRadius: "var(--r-xl)", padding: 24, textAlign: "center",
          border: "1px solid #BBDEFB", marginBottom: 20
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 32, background: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", border: "2px solid #90CAF9"
          }}>
            <Icons.chat size={32} stroke="#1976D2"/>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1565C0", marginBottom: 8 }}>พื้นที่แลกเปลี่ยนเรียนรู้</h2>
          <p style={{ fontSize: 14, color: "#455A64", lineHeight: 1.6 }}>
            เตรียมพบกับระบบกระทู้สนทนาเร็วๆ นี้ เพื่อให้สมาชิก VME ทุกท่านได้พูดคุย แบ่งปันประสบการณ์ และช่วยเหลือซึ่งกันและกัน
          </p>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>หัวข้อที่น่าสนใจ</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { id: 1, title: "เทคนิคการชวนบวชอย่างไรให้สำเร็จ" },
              { id: 2, title: "แชร์ประสบการณ์การทำงานในพื้นที่" },
              { id: 3, title: "ถาม-ตอบ ปัญหาการใช้งานแอป VME" },
              { id: 4, title: "รวมภาพบรรยากาศโครงการ IPS#11" }
            ].map((topic, i) => (
              <Link href={`/forum/${topic.id}`} key={i} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  padding: "12px 16px", borderRadius: 12, background: "#F5F5F5",
                  display: "flex", alignItems: "center", gap: 12,
                  transition: "background 0.2s"
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: "#90CAF9" }}></div>
                  <span style={{ fontSize: 14, color: "#37474F", flex: 1, fontWeight: 500 }}>{topic.title}</span>
                  <Icons.arrow size={14} stroke="#B0BEC5"/>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link href="/profile" style={{ 
            fontSize: 14, color: "#1976D2", fontWeight: 600, textDecoration: "none"
          }}>
            <Icons.back size={14} stroke="#1976D2"/> กลับหน้าโปรไฟล์
          </Link>
        </div>
      </div>

      <TabBar/>
    </>
  );
}
