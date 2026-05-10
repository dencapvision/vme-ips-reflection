import { Icons } from "@/components/Icons";
import { TopHeaderBack } from "@/components/AppHeader";
import { DualLabel } from "@/components/UI";

export default function CasePage() {
  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <TopHeaderBack title="กรณีศึกษาความสำเร็จ"/>
      </div>

      <div style={{ padding: "0 22px 30px" }}>
        <div style={{ marginBottom: 14 }}>
          <DualLabel en="SUCCESS CASE" th="กรณีศึกษา · ปีที่ผ่านมา"/>
        </div>

        <div style={{
          background: "linear-gradient(160deg, #FDF1E6 0%, var(--white) 100%)",
          border: "1px solid var(--saffron-100)", borderRadius: "var(--r-xl)", padding: 18, marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: "var(--white)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid var(--saffron-200)" }}>
              <Icons.lotus size={22} stroke="var(--saffron-600)"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "var(--saffron-600)", fontFamily: "var(--font-en)", fontWeight: 700, letterSpacing: "0.08em" }}>CASE 01</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>เณรน้อยจากบ้านไผ่</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <Stat label="อายุตอนชวน" value="18 ปี" sub="จบ ม.6 ใหม่"/>
            <Stat label="ระยะเวลา" value="3 เดือน" sub="ชวน → บวช"/>
          </div>

          <div style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--ink-800)" }}>
            <b>เริ่มจาก</b> แม่เณรเป็นกัลยาณมิตรในกลุ่มสวดมนต์ที่ไปทำบุญด้วยกันทุกวันอาทิตย์
            ลูกชายเรียนจบ ม.6 พอดี เดิมตั้งใจเรียนต่อมหาลัยที่กรุงเทพ
            <br/><br/>
            <b>วิธีชวน</b> นัดเจอที่บ้าน 3 ครั้ง พาไปดูศูนย์ DCI 1 ครั้ง พระอาจารย์มาคุยที่บ้าน 1 ครั้ง
            ให้ดูคลิปบรรยากาศ IPS ในกลุ่มไลน์
            <br/><br/>
            <b>ผลที่เกิด</b> ตัดสินใจบวชเรียน 4 ปี · ครอบครัวศรัทธาแก่กล้า · ชวนต่อได้อีก 2 ครอบครัวในซอยเดียวกัน
          </div>
        </div>

        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-500)",
          fontFamily: "var(--font-en)", marginBottom: 8,
        }}>
          KEY LESSONS · บทเรียนสำคัญ
        </div>
        {[
          { n: "01", text: "เริ่มจากกัลยาณมิตร — ความสัมพันธ์เดิมมีพลังที่สุด" },
          { n: "02", text: "พ่อแม่ต้องเห็นด้วยก่อน เด็กถึงกล้าตัดสินใจ" },
          { n: "03", text: "พาไปดูสถานที่จริง 1 ครั้ง คุ้มค่ากว่าคุย 10 ครั้ง" },
          { n: "04", text: "ความสำเร็จ 1 ราย ขยายเครือข่ายต่อได้อีกหลายราย" },
        ].map((l) => (
          <div key={l.n} className="card" style={{
            padding: 14, marginBottom: 8, display: "flex", gap: 12, alignItems: "center",
          }}>
            <div style={{ fontFamily: "var(--font-en)", fontSize: 18, fontWeight: 600, color: "var(--saffron-500)", minWidth: 28 }}>{l.n}</div>
            <div style={{ flex: 1, fontSize: 13.5, lineHeight: 1.5 }}>{l.text}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{ background: "var(--white)", border: "1px solid var(--ink-200)", borderRadius: "var(--r-md)", padding: 12 }}>
      <div style={{ fontSize: 10.5, color: "var(--ink-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: "var(--saffron-700)", fontFamily: "var(--font-en)", marginTop: 2 }}>{value}</div>
      <div style={{ fontSize: 11, color: "var(--ink-600)", marginTop: 1 }}>{sub}</div>
    </div>
  );
}
