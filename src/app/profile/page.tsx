import { Icons } from "@/components/Icons";
import { AppHeader } from "@/components/AppHeader";
import { TabBar } from "@/components/TabBar";

export default function ProfilePage() {
  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <AppHeader large title="โปรไฟล์" subtitle="MY PROFILE"/>
      </div>

      <div style={{ padding: "4px 22px 30px" }}>
        <div style={{
          background: "linear-gradient(135deg, #FDF1E6 0%, #FCE3CE 100%)",
          borderRadius: "var(--r-xl)", padding: 20, marginBottom: 18,
          border: "1px solid var(--saffron-100)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 32, background: "var(--white)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 600, color: "var(--saffron-700)",
              border: "2px solid var(--saffron-200)",
            }}>วภ</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>คุณวิภา ชัยมงคล</div>
              <div style={{ fontSize: 12, color: "var(--ink-600)", marginTop: 2 }}>อาสาการศึกษา VME · กลุ่มที่ 4</div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6,
                fontSize: 11, color: "var(--saffron-700)", fontWeight: 600,
              }}>
                <Icons.pin size={12} stroke="var(--saffron-700)"/> จังหวัดอุบลราชธานี
              </div>
            </div>
            <button style={{
              width: 36, height: 36, borderRadius: 18, background: "var(--white)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid var(--saffron-200)",
            }}><Icons.edit size={16} stroke="var(--saffron-700)"/></button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 18 }}>
          {[
            { n: "5/8", label: "หัวข้อ\nที่ทบทวน" },
            { n: "12",  label: "บันทึก\nReflection" },
            { n: "3",   label: "SMART\nGoal" },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: "var(--saffron-600)", fontFamily: "var(--font-en)" }}>{s.n}</div>
              <div style={{ fontSize: 11, color: "var(--ink-600)", marginTop: 4, whiteSpace: "pre-line", lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 16, marginBottom: 18 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            color: "var(--saffron-600)", fontFamily: "var(--font-en)", marginBottom: 8,
          }}>CURRENT WORKSHOP</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>โครงการสร้างศาสนทายาท IPS</div>
          <div style={{ fontSize: 12, color: "var(--ink-600)", lineHeight: 1.55 }}>
            VME — อาสาการศึกษา<br/>
            ศูนย์ปฏิบัติธรรมอโยธยา DCI · พระนครศรีอยุธยา<br/>
            8–10 พฤษภาคม 2569
          </div>
        </div>

        <div className="card" style={{ overflow: "hidden" }}>
          {[
            { Icon: Icons.bell,     label: "การแจ้งเตือนติดตามผล", detail: "เปิด" },
            { Icon: Icons.cal,      label: "นัดติดตามผลครั้งหน้า",  detail: "14 มิ.ย." },
            { Icon: Icons.download, label: "ส่งออกข้อมูลทั้งหมด",   detail: "PDF · 4 หน้า" },
            { Icon: Icons.globe,    label: "ภาษา / Language",     detail: "ไทย · English" },
          ].map((it, i, arr) => (
            <div key={i} style={{
              padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
              borderBottom: i < arr.length - 1 ? "1px solid var(--ink-100)" : "none",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: "var(--ink-100)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}><it.Icon size={16} stroke="var(--ink-700)"/></div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{it.label}</div>
              <div style={{ fontSize: 12, color: "var(--ink-500)" }}>{it.detail}</div>
              <Icons.arrow size={14} stroke="var(--ink-400)"/>
            </div>
          ))}
        </div>
      </div>

      <TabBar/>
    </>
  );
}
