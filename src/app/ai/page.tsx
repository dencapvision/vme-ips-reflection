import { Icons } from "@/components/Icons";
import { TopHeaderBack } from "@/components/AppHeader";
import { Chip } from "@/components/UI";

export default function AIPage() {
  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <TopHeaderBack title="AI ช่วยร่างคำชวน"/>
      </div>

      <div style={{ padding: "0 22px 30px" }}>
        <div style={{
          background: "linear-gradient(135deg, #F0E9F1 0%, #FDF1E6 100%)",
          borderRadius: "var(--r-xl)", padding: 18, marginBottom: 16,
          border: "1px solid #DDD0DE",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: 21, background: "var(--white)",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.ai size={22} stroke="#6B4A6E"/>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-en)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#6B4A6E" }}>AI ASSISTANT</div>
              <div style={{ fontSize: 17, fontWeight: 600 }}>ร่างคำชวนบวชเรียน</div>
            </div>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-700)", lineHeight: 1.55 }}>
            ใช้สื่อสารกับน้อง ม.ปลาย หรือพ่อแม่ผู้ปกครอง — ปรับโทน ภาษา และความยาวได้
          </div>
        </div>

        <div className="card" style={{ padding: 14, marginBottom: 14 }}>
          <Setting label="กลุ่มผู้รับ" value="นักเรียน ม.ปลาย (อายุ 17–18)"/>
          <Setting label="ช่องทาง"  value="ไลน์ส่วนตัว · ข้อความสั้น"/>
          <Setting label="โทนภาษา" value="เป็นกันเอง · ไม่ทางการมาก" last/>
        </div>

        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-500)",
          fontFamily: "var(--font-en)", marginBottom: 8,
        }}>DRAFT · ข้อความที่ AI ร่างให้</div>

        <div style={{
          background: "var(--white)", border: "1px solid var(--ink-200)",
          borderRadius: "var(--r-lg)", padding: 16, marginBottom: 12, position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 12, right: 12,
            width: 6, height: 6, borderRadius: 3, background: "#6E8B6B",
          }}/>
          <div style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--ink-800)" }}>
            สวัสดีครับน้อง 🙏<br/>
            พี่นึกถึงน้องตอนเห็นข่าวโครงการ IPS10 พอดี อยากชวนน้องลองมาดูสักครั้ง
            <br/><br/>
            มันคือโครงการบวชเรียน 4 ปี เริ่มจาก 1 ปีเรียนภาษาอังกฤษ แล้วเลือกเรียนต่ออีก 3 ปี
            มี 3 สาขาให้เลือก น้องๆ ที่จบไปได้ทุนเรียนเมืองนอกก็มีครับ
            <br/><br/>
            พี่ว่าน้องน่าจะชอบ — ถ้าสนใจ พี่นัดเจอที่ร้านกาแฟใกล้บ้านได้ไหมครับ?
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--ink-100)" }}>
            <button style={{ padding: "8px 12px", borderRadius: 99, background: "var(--ink-100)", fontSize: 11.5, fontWeight: 600 }}>สั้นลง</button>
            <button style={{ padding: "8px 12px", borderRadius: 99, background: "var(--ink-100)", fontSize: 11.5, fontWeight: 600 }}>เป็นทางการขึ้น</button>
            <button style={{ padding: "8px 12px", borderRadius: 99, background: "var(--ink-100)", fontSize: 11.5, fontWeight: 600 }}>เน้นบุญ</button>
          </div>
        </div>

        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-500)",
          fontFamily: "var(--font-en)", marginBottom: 8,
        }}>OTHER ANGLES · ลองมุมอื่น</div>
        {[
          { tone: "สำหรับพ่อแม่", text: "\"ลูกของคุณมีโอกาสได้เรียนภาษาอังกฤษและเดินทางเรียนต่อต่างประเทศ…\"" },
          { tone: "เน้นเพื่อนรุ่นเดียวกัน", text: "\"เพื่อนๆ พี่หลายคนที่ตัดสินใจบวชเรียน ตอนนี้เก่งภาษาอังกฤษมาก…\"" },
        ].map((v, i) => (
          <div key={i} className="card" style={{ padding: 14, marginBottom: 8 }}>
            <Chip variant="plum">{v.tone}</Chip>
            <div style={{ fontSize: 12.5, marginTop: 8, color: "var(--ink-700)", lineHeight: 1.55, fontStyle: "italic" }}>{v.text}</div>
          </div>
        ))}

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="btn-ghost" style={{ flex: 1, fontSize: 14 }}>ร่างใหม่</button>
          <button className="btn-saffron" style={{ flex: 1.4 }}>
            <Icons.share size={16} sw={2}/> ส่งทางไลน์
          </button>
        </div>
      </div>
    </>
  );
}

function Setting({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 0", borderBottom: last ? "none" : "1px solid var(--ink-100)",
    }}>
      <div style={{ fontSize: 12.5, color: "var(--ink-600)" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 500 }}>
        {value}
        <Icons.arrow size={12} stroke="var(--ink-400)"/>
      </div>
    </div>
  );
}
