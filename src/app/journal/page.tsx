import { Icons } from "@/components/Icons";
import { AppHeader } from "@/components/AppHeader";
import { TabBar } from "@/components/TabBar";

const days = [
  {
    date: "10 พ.ค.", day: "วันนี้",
    entries: [
      { time: "17:42", icon: "spark"  as const, color: "saffron" as const, title: "จดบันทึกหัวข้อ 2.3", text: "น่าจะใช้ AI คัดกรองเด็ก ม.ปลายในอุบลฯ ที่สนใจธรรมะ" },
      { time: "14:20", icon: "layers" as const, color: "sage"    as const, title: "ทำ SWOT กลุ่ม 4", text: "ทีมงานพบว่า \"เครือข่ายผู้ปกครอง\" คือจุดแข็งจริงๆ" },
    ],
  },
  {
    date: "9 พ.ค.", day: "เมื่อวาน",
    entries: [
      { time: "20:15", icon: "target" as const, color: "gold" as const, title: "ตั้ง SMART Goal #2", text: "พื้นที่อุบลฯ — ชวนได้ 5 รูป ภายใน ธ.ค. 2569" },
      { time: "11:08", icon: "book"   as const, color: "plum" as const, title: "อ่านคู่มือ DCI จบเล่ม 1", text: "" },
    ],
  },
  {
    date: "8 พ.ค.", day: "วันแรก",
    entries: [
      { time: "09:30", icon: "flag" as const, color: "saffron" as const, title: "เริ่มโครงการ", text: "เปิดโครงการ ณ DCI อโยธยา — รู้สึกตื้นตันมาก" },
    ],
  },
];

const cmap = { saffron: "var(--saffron-500)", sage: "#6E8B6B", gold: "#C8A04A", plum: "#6B4A6E" };
const tint = { saffron: "var(--saffron-50)", sage: "#EEF3ED",  gold: "#F8F1DD",  plum: "#F0E9F1" };

export default function JournalPage() {
  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <AppHeader large title="สมุดบันทึก" subtitle="REFLECTION JOURNAL"
          trailing={<button style={{
            width: 38, height: 38, borderRadius: 19, background: "var(--saffron-500)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><Icons.plus size={18} stroke="#fff" sw={2}/></button>}/>
      </div>

      <div style={{ padding: "4px 22px 30px" }}>
        {days.map((d, di) => (
          <div key={di} style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{d.day}</div>
              <div style={{ fontSize: 11, color: "var(--ink-500)", fontFamily: "var(--font-en)" }}>· {d.date}</div>
            </div>
            <div style={{ position: "relative", paddingLeft: 8 }}>
              <div style={{ position: "absolute", left: 19, top: 8, bottom: 8, width: 1.5, background: "var(--ink-200)" }}/>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {d.entries.map((e, ei) => {
                  const I = (Icons as any)[e.icon] as (p?: any) => JSX.Element;
                  return (
                    <div key={ei} style={{ display: "flex", gap: 12, position: "relative" }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 14, background: tint[e.color],
                        border: `1.5px solid ${cmap[e.color]}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flex: "0 0 auto", zIndex: 1,
                      }}>
                        <I size={14} stroke={cmap[e.color]}/>
                      </div>
                      <div className="card" style={{ flex: 1, padding: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{e.title}</div>
                          <div style={{ fontSize: 10.5, color: "var(--ink-500)", fontFamily: "var(--font-en)" }}>{e.time}</div>
                        </div>
                        {e.text && <div style={{ fontSize: 12.5, color: "var(--ink-700)", marginTop: 4, lineHeight: 1.5 }}>{e.text}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      <TabBar/>
    </>
  );
}
