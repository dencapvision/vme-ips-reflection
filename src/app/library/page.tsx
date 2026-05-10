import { Icons } from "@/components/Icons";
import { AppHeader } from "@/components/AppHeader";
import { Chip, SectionHeader } from "@/components/UI";
import { TabBar } from "@/components/TabBar";

export default function LibraryPage() {
  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <AppHeader large title="คลังความรู้" subtitle="LIBRARY"
          trailing={<button style={{ width: 38, height: 38, borderRadius: 19, background: "var(--white)", border: "1px solid var(--ink-200)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icons.search size={18} stroke="var(--ink-700)"/>
          </button>}/>
      </div>

      <div style={{ padding: "4px 22px 30px" }}>
        <div style={{
          background: "linear-gradient(140deg, #FDF1E6 0%, var(--white) 60%, #F0E9F1 100%)",
          borderRadius: "var(--r-xl)", padding: 18, marginBottom: 18, border: "1px solid var(--saffron-100)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: "var(--font-en)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "var(--saffron-600)" }}>FEATURED</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>โครงการ IPS10 — คู่มือผู้ชวนบวช</div>
              <div style={{ fontSize: 12, color: "var(--ink-600)", marginTop: 6 }}>26 หน้า · 4 วิดีโอ · อัปเดต พ.ค. 2569</div>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--white)", border: "1px solid var(--saffron-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.lotus size={24} stroke="var(--saffron-600)"/>
            </div>
          </div>
          <button className="btn-saffron" style={{ padding: "11px 18px", fontSize: 13 }}>
            อ่านคู่มือ <Icons.arrow size={14} sw={2}/>
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
          <Cat Icon={Icons.lotus}  label="DCI"   sub="12 บทความ" color="saffron"/>
          <Cat Icon={Icons.book}   label="IPS"   sub="8 บทความ"  color="sage"/>
          <Cat Icon={Icons.layers} label="หลักสูตร" sub="6 บทความ"  color="gold"/>
          <Cat Icon={Icons.ai}     label="AI"    sub="5 บทความ"  color="plum"/>
        </div>

        <SectionHeader title="ดูล่าสุด" en="RECENTLY VIEWED" action="ดูทั้งหมด"/>
        {[
          { type: "PDF", title: "AI สำหรับการเผยแผ่พระพุทธศาสนา", sub: "สไลด์วิทยากร · 18 หน้า", tag: "AI" },
          { type: "VID", title: "บรรยากาศ IPS-DCI · ตอนที่ 1",     sub: "พระนิสิตเล่าประสบการณ์ · 12:30", tag: "IPS" },
          { type: "DOC", title: "หลักสูตรเตรียมพุทธศาสตร์ ปี 2569", sub: "ศูนย์เขาแก้วเสด็จ · 24 หน้า", tag: "หลักสูตร" },
        ].map((d, i) => (
          <div key={i} className="card" style={{ padding: 12, display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 38, height: 44, borderRadius: 8, background: "var(--saffron-50)",
              fontSize: 10, fontWeight: 700, fontFamily: "var(--font-en)", color: "var(--saffron-700)",
              display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto",
            }}>{d.type}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>{d.title}</div>
              <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}>{d.sub}</div>
            </div>
            <Chip variant="saffron">{d.tag}</Chip>
          </div>
        ))}
      </div>

      <TabBar/>
    </>
  );
}

function Cat({ Icon, label, sub, color }: {
  Icon: (p?: any) => JSX.Element; label: string; sub: string; color: "saffron" | "sage" | "gold" | "plum";
}) {
  const map = {
    saffron: { bg: "var(--saffron-50)",  fg: "var(--saffron-700)", br: "var(--saffron-100)" },
    sage:    { bg: "#EEF3ED",            fg: "#3D5C3B",            br: "#D6E1D4" },
    gold:    { bg: "#F8F1DD",            fg: "#6E5418",            br: "#E8DBB1" },
    plum:    { bg: "#F0E9F1",            fg: "#4A2D4D",            br: "#DDD0DE" },
  }[color];
  return (
    <div style={{ background: map.bg, border: `1px solid ${map.br}`, borderRadius: "var(--r-lg)", padding: 14, minHeight: 100 }}>
      <Icon size={26} stroke={map.fg}/>
      <div style={{ fontSize: 16, fontWeight: 600, color: map.fg, marginTop: 10 }}>{label}</div>
      <div style={{ fontSize: 11, color: "var(--ink-600)", marginTop: 2 }}>{sub}</div>
    </div>
  );
}
