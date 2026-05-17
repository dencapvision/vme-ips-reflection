import { AppHeader } from "@/components/AppHeader";
import { Icons } from "@/components/Icons";
import { TabBar } from "@/components/TabBar";

export default function StrategicPage() {
  const regions = [
    { name: "ภาคเหนือ", nameEn: "NORTHERN", current: 12, target: 15, color: "#1976D2", bg: "#E3F2FD" },
    { name: "ภาคตะวันออกเฉียงเหนือ", nameEn: "NORTHEASTERN", current: 25, target: 30, color: "#E64A19", bg: "#FBE9E7" },
    { name: "ภาคกลาง", nameEn: "CENTRAL", current: 18, target: 20, color: "#F57C00", bg: "#FFF3E0" },
    { name: "ภาคใต้", nameEn: "SOUTHERN", current: 8, target: 10, color: "#388E3C", bg: "#E8F5E9" },
    { name: "ภาคตะวันออก", nameEn: "EASTERN", current: 9, target: 10, color: "#7B1FA2", bg: "#F3E5F5" },
    { name: "ภาคตะวันตก", nameEn: "WESTERN", current: 6, target: 5, color: "#00796B", bg: "#E0F2F1" },
  ];

  const totalCurrent = regions.reduce((acc, r) => acc + r.current, 0);
  const totalTarget = 90;
  const totalPercentage = Math.round((totalCurrent / totalTarget) * 100);

  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <AppHeader large title="แผนกลยุทธ์ปี 2570" subtitle="STRATEGIC PLAN"
          trailing={<button style={{ width: 38, height: 38, borderRadius: 19, background: "var(--white)", border: "1px solid var(--ink-200)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icons.share size={17} stroke="var(--ink-700)"/>
          </button>}/>
      </div>

      <div style={{ padding: "4px 22px 100px" }}>
        {/* Banner Target */}
        <div style={{
          background: "linear-gradient(135deg, var(--saffron-500) 0%, #D84315 100%)",
          borderRadius: "var(--r-xl)", padding: 20, color: "#fff", marginBottom: 20,
          position: "relative", overflow: "hidden",
          boxShadow: "0 10px 25px -5px rgba(230, 74, 25, 0.3)"
        }}>
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: "absolute", right: -40, top: -40, opacity: 0.2 }}>
            <circle cx="90" cy="90" r="80" fill="none" stroke="#fff" strokeWidth="1"/>
            <circle cx="90" cy="90" r="55" fill="none" stroke="#fff" strokeWidth="1"/>
            <circle cx="90" cy="90" r="30" fill="none" stroke="#fff" strokeWidth="1"/>
          </svg>
          <div style={{ position: "relative" }}>
            <div style={{ fontFamily: "var(--font-en)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", opacity: 0.9 }}>TARGET IPS#11 (2570)</div>
            <div style={{ fontSize: 36, fontWeight: 700, marginTop: 4, fontFamily: "var(--font-en)", display: "flex", alignItems: "baseline", gap: 6 }}>
              {totalTarget} <span style={{ fontSize: 16, fontWeight: 400, opacity: 0.9 }}>รูป</span>
            </div>
            <div style={{ fontSize: 13, opacity: 0.95, marginTop: 4, lineHeight: 1.6 }}>
              ชวนบวชเรียน IPS#11 จากผู้สมัครและเครือข่ายโรงเรียน 400+ ทั่วประเทศ
            </div>
          </div>
        </div>

        {/* Regional Stats Card */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-500)", fontFamily: "var(--font-en)", marginBottom: 12 }}>
            APPLICANT TRACKER · ยอดผู้สมัครสะสมจำแนกตามภูมิภาค
          </div>
          
          <div className="card" style={{ padding: 20, background: "var(--white)", border: "1px solid var(--ink-200)" }}>
            {/* National Summary */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-900)" }}>ความคืบหน้าทั่วประเทศ</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--saffron-600)", fontFamily: "var(--font-en)" }}>
                  {totalCurrent}/{totalTarget} รูป ({totalPercentage}%)
                </span>
              </div>
              <div style={{ width: "100%", height: 10, borderRadius: 5, background: "var(--ink-100)", overflow: "hidden" }}>
                <div style={{ 
                  width: `${totalPercentage}%`, 
                  height: "100%", 
                  borderRadius: 5, 
                  background: "linear-gradient(90deg, var(--saffron-500) 0%, #E64A19 100%)",
                  transition: "width 0.5s ease"
                }}/>
              </div>
            </div>

            {/* Regional List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {regions.map((reg, index) => {
                const percent = Math.min(100, Math.round((reg.current / reg.target) * 100));
                return (
                  <div key={index} style={{ borderBottom: index < regions.length - 1 ? "1px solid var(--ink-100)" : "none", paddingBottom: index < regions.length - 1 ? 12 : 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-800)" }}>{reg.name}</span>
                        <span style={{ fontFamily: "var(--font-en)", fontSize: 10, fontWeight: 600, color: "var(--ink-500)", marginLeft: 6 }}>{reg.nameEn}</span>
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-900)", fontFamily: "var(--font-en)" }}>
                        {reg.current} / {reg.target} ใบสมัคร <span style={{ color: reg.color, fontSize: 11, fontWeight: 600 }}>({percent}%)</span>
                      </span>
                    </div>
                    <div style={{ width: "100%", height: 6, borderRadius: 3, background: "var(--ink-100)", overflow: "hidden" }}>
                      <div style={{ 
                        width: `${percent}%`, 
                        height: "100%", 
                        borderRadius: 3, 
                        background: reg.color,
                        transition: "width 0.5s ease"
                      }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4 Pillars Section */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-500)", fontFamily: "var(--font-en)", marginBottom: 12 }}>
          4 PILLARS · 4 มิติของแผนการทำงาน IPS#11
        </div>

        <Pillar n="01" color="saffron" title="กลุ่มเป้าหมาย & พื้นที่" en="WHO & WHERE"
          items={[
            "ศูนย์พุทธศาสตร์ศึกษา DCI อ.บางบาล จ.พระนครศรีอยุธยา (สถานที่จัดอบรมหลัก)",
            "ผู้เรียนอายุ 18+ (ม.6 / ปวส.3) และสามเณร โรงเรียนเตรียมพุทธศาสตร์",
            "ผู้ที่ยังไม่พร้อมอายุต่ำกว่า 18: แนะนำศึกษาต่อโรงเรียนเตรียมพุทธศาสตร์ เขาแก้วเสด็จ เพื่อเตรียมความพร้อม"
          ]}/>
        <Pillar n="02" color="sage" title="บริบท & ข้อมูลสำคัญ" en="CONTEXT"
          items={[
            "สัมมนาผู้บริหาร/ครูการใช้ AI ณ DCI อ.บางบาล เพื่อเสริมการตัดสินใจส่งต่อผู้สมัคร",
            "ร่วมมือกับ The New England School of English (NESE, USA) ยกระดับภาษาอังกฤษ",
            "โครงการอื่นๆ ในอนาคต: รองรับหลักสูตรเทคโนโลยีเพื่อสังคมสำหรับเยาวชนและอาสา VME"
          ]}/>
        <Pillar n="03" color="gold" title="กิจกรรม & ช่องทาง" en="ACTIVITIES"
          items={[
            "สัมมนาอบรมครูและผู้บริหารโรงเรียนทั่วประเทศเกี่ยวกับการใช้ AI ในการศึกษา ณ DCI อ.บางบาล",
            "ค่าย AI Support 3 วัน สำหรับเตรียมความพร้อมผู้บริหาร ครู และสามเณรเตรียมพุทธศาสตร์",
            "เตรียมความพร้อมกิจกรรมสร้างสรรค์เทคโนโลยีอื่นๆ สำหรับอาสา VME และเยาวชนทั่วไป"
          ]}/>
        <Pillar n="04" color="plum" title="การเก็บข้อมูล & สัมพันธ์" en="RELATIONSHIP"
          items={[
            "ประสานงานและดูแลอย่างอบอุ่นกับผู้ปกครองและเจ้าอาวาสเครือข่าย",
            "ใช้ระบบ AI ของ VME ในการวิเคราะห์และติดตามศักยภาพรายคน",
            "การคัดกรองและนัดหมายสัมภาษณ์อย่างเป็นระบบในเดือนเมษายน 2570"
          ]}/>

        {/* Operational Roadmap */}
        <div style={{ marginTop: 32, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-500)", fontFamily: "var(--font-en)", marginBottom: 12 }}>
            OPERATIONAL ROADMAP · แผนการดำเนินงานถึง เมษายน 2570
          </div>
          
          <div className="card" style={{ padding: 20, background: "var(--white)", border: "1px solid var(--ink-200)" }}>
            <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
              <RoadmapItem 
                month="พฤษภาคม - ตุลาคม 2569" 
                title="เตรียมความพร้อม & ติดตั้งระบบตั้งรับ" 
                tasks={[
                  "ประสานงานโรงเรียนเป้าหมาย 400+ แห่งทั่วประเทศ",
                  "ติดตั้งระบบ AI เพื่อการเรียนการสอนและเก็บรวบรวมข้อมูลความสนใจ",
                  "คัดกรองรายชื่อผู้สมัครและผู้สนใจเข้าร่วมเบื้องต้น"
                ]} 
                status="done"
              />
              <RoadmapItem 
                month="พฤศจิกายน 2569 - มกราคม 2570" 
                title="ยกระดับความพร้อมคณะครูและผู้บริหาร" 
                tasks={[
                  "เปิดโครงการสัมมนาหลักสูตร AI สำหรับครูแนะแนวและผู้บริหารโรงเรียน",
                  "แสดงศักยภาพความพร้อมด้านเทคโนโลยีและการเรียนการสอนของโครงการ",
                  "เปิดรับสมัครผู้เข้าร่วมโครงการ IPS#11 ประจำภูมิภาคอย่างเป็นทางการ"
                ]} 
                status="doing"
              />
              <RoadmapItem 
                month="กุมภาพันธ์ - มีนาคม 2570" 
                title="ค่ายพัฒนา AI และเตรียมความพร้อม ณ DCI อ.บางบาล" 
                tasks={[
                  "จัดค่ายยกระดับทักษะ AI 3 วัน สำหรับผู้บริหาร ครู และสามเณรโรงเรียนเตรียมพุทธศาสตร์",
                  "ปูพื้นฐานการใช้งาน AI วันแรก และเสริมทักษะเชิงลึกเพื่อสร้างนวัตกรรมในวันที่ 2-3",
                  "สร้างแรงบันดาลใจและเชื่อมความร่วมมือการเรียนภาษากับสถาบัน NESE (USA)"
                ]} 
                status="pending"
              />
              <RoadmapItem 
                month="เมษายน 2570" 
                title="คัดกรองรอบสุดท้าย & นัดสัมภาษณ์ผู้สมัคร" 
                tasks={[
                  "ประมวลผลความสนใจและข้อมูลสะสมของผู้เข้าร่วมค่ายทั้งหมด",
                  "ดำเนินการนัดหมายสัมภาษณ์รายบุคคลเพื่อเข้าคัดเลือกในโครงการ IPS#11",
                  "ประกาศผลการคัดเลือกและมอบทุนศาสนทายาทนานาชาติ"
                ]} 
                status="pending"
              />
            </div>
          </div>
        </div>

        {/* DCI AI Support Highlight */}
        <div style={{ 
          background: "linear-gradient(135deg, #1A237E 0%, #0D47A1 100%)", 
          borderRadius: "var(--r-xl)", 
          padding: 20, color: "var(--white)", marginTop: 24,
          boxShadow: "0 10px 20px rgba(13, 71, 161, 0.2)"
        }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ background: "var(--saffron-500)", borderRadius: 10, padding: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.spark size={22} stroke="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "var(--saffron-400)", fontFamily: "var(--font-en)" }}>DCI AI SUPPORT & PREPARATION</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--white)", marginTop: 2 }}>โครงการ AI ตั้งรับ & สนับสนุน (DCI อ.บางบาล)</h4>
            </div>
          </div>
          
          <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.9, display: "flex", flexDirection: "column", gap: 10 }}>
            <p>
              โครงการพัฒนาทักษะ AI ณ **ศูนย์พุทธศาสตร์ศึกษา DCI อ.บางบาล จ.พระนครศรีอยุธยา** สำหรับผู้บริหาร ครู และสามเณรจากโรงเรียนเตรียมพุทธศาสตร์ เพื่อเสริมสร้างความพร้อมด้านเทคโนโลยีการศึกษาและยกระดับภาษาอังกฤษร่วมกับสถาบัน **NESE (USA)** เพิ่มโอกาสสมัครทุน IPS#11
            </p>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 12, border: "1px solid rgba(255,255,255,0.12)" }}>
              <span style={{ fontWeight: 700, color: "var(--saffron-400)", display: "block", marginBottom: 4, fontSize: 12.5 }}>💡 ไฮไลท์กิจกรรมและการดูแลผู้ที่ไม่พร้อม:</span>
              <ul style={{ paddingLeft: 16, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                <li><strong>ผู้บริหาร & ครู:</strong> อบรมการใช้ AI เพื่อการศึกษา สัมมนาแนะแนวทุนวิชาการ</li>
                <li><strong>สามเณร/นักเรียน:</strong> อบรมเข้มข้น 3 วัน (วันแรกปรับพื้นฐาน วันที่ 2-3 ลงลึกสร้างนวัตกรรม AI)</li>
                <li><strong>ผู้ที่ยังไม่พร้อมเรียน/อายุไม่ถึง:</strong> แนะนำเข้าศึกษาและบวชเรียนเตรียมความพร้อมที่ โรงเรียนเตรียมพุทธศาสตร์ เขาแก้วเสด็จ จ.ปราจีนบุรี</li>
              </ul>
            </div>
            <p style={{ fontSize: 12, opacity: 0.8, fontStyle: "italic", marginTop: 4 }}>
              * ปรับแผนงานให้กระชับและลดความซับซ้อน เพื่อเตรียมความพร้อมในการรองรับโครงการเชิงสร้างสรรค์อื่นๆ สำหรับอาสาสมัคร VME ในอนาคตอันใกล้
            </p>
          </div>
        </div>
      </div>

      <TabBar/>
    </>
  );
}

function RoadmapItem({ month, title, tasks, status }: { month: string; title: string; tasks: string[]; status: "done" | "doing" | "pending" }) {
  return (
    <div style={{ display: "flex", gap: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24 }}>
        <div style={{ 
          width: 22, height: 22, borderRadius: 11, 
          background: status === "doing" ? "var(--saffron-500)" : status === "done" ? "#4CAF50" : "var(--ink-200)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: status === "doing" ? "0 0 10px rgba(245, 124, 0, 0.4)" : "none"
        }}>
          {status === "done" && <Icons.check size={13} stroke="#fff" sw={3}/>}
          {status === "doing" && <div style={{ width: 6, height: 6, borderRadius: 3, background: "#fff" }}/>}
        </div>
        <div style={{ flex: 1, width: 2, background: "var(--ink-100)", marginTop: 4, marginBottom: 4 }}/>
      </div>
      <div style={{ flex: 1, paddingBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--saffron-600)", marginBottom: 2 }}>{month}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)", marginBottom: 8 }}>{title}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {tasks.map((t, i) => (
            <div key={i} style={{ fontSize: 12.5, color: "var(--ink-600)", display: "flex", gap: 6, lineHeight: 1.5 }}>
              <span style={{ color: "var(--saffron-500)" }}>•</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pillar({ n, color, title, en, items }: {
  n: string; color: "saffron" | "sage" | "gold" | "plum"; title: string; en: string; items: string[];
}) {
  const map = {
    saffron: { bg: "var(--saffron-50)",  fg: "var(--saffron-700)", br: "var(--saffron-100)" },
    sage:    { bg: "#EEF3ED",            fg: "#3D5C3B",            br: "#D6E1D4" },
    gold:    { bg: "#F8F1DD",            fg: "#6E5418",            br: "#E8DBB1" },
    plum:    { bg: "#F0E9F1",            fg: "#4A2D4D",            br: "#DDD0DE" },
  }[color];
  return (
    <div style={{
      background: map.bg, border: `1px solid ${map.br}`, borderRadius: "var(--r-lg)",
      padding: 14, marginBottom: 10,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
        <div style={{ fontFamily: "var(--font-en)", fontSize: 22, fontWeight: 700, color: map.fg, opacity: 0.85 }}>{n}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-en)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", color: map.fg, opacity: 0.7 }}>{en}</div>
          <div style={{ fontSize: 14.5, fontWeight: 600 }}>{title}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.75)", borderRadius: 8, padding: "8px 10px",
            fontSize: 12.5, color: "var(--ink-800)", display: "flex", gap: 8,
            border: "1px solid rgba(255,255,255,0.5)"
          }}>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: map.fg, marginTop: 8, flex: "0 0 auto" }}/>
            <span style={{ flex: 1, lineHeight: 1.4 }}>{it}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
