import Link from "next/link";
import { Icons } from "@/components/Icons";
import { AppHeader } from "@/components/AppHeader";
import { TabBar } from "@/components/TabBar";
import { Chip, NumPill } from "@/components/UI";
import { TOPICS, type Topic } from "@/lib/topics";

export default function TopicsPage() {
  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <AppHeader large title="หัวข้อบทเรียน" subtitle="VME · IPS WORKSHOP"
          trailing={<>
            <button style={{ width: 38, height: 38, borderRadius: 19, background: "var(--white)", border: "1px solid var(--ink-200)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.search size={18} stroke="var(--ink-700)"/>
            </button>
            <button style={{ width: 38, height: 38, borderRadius: 19, background: "var(--white)", border: "1px solid var(--ink-200)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.filter size={18} stroke="var(--ink-700)"/>
            </button>
          </>}
        />
      </div>

      <div style={{ padding: "4px 22px 14px", display: "flex", gap: 8, overflowX: "auto" }}>
        <span className="chip chip-saffron" style={{ fontWeight: 600 }}>ทั้งหมด · 8</span>
        <span className="chip">ทำแล้ว · 3</span>
        <span className="chip">กำลังทำ · 1</span>
        <span className="chip">ยังไม่เริ่ม · 4</span>
      </div>

      <div style={{ padding: "0 22px 30px", display: "flex", flexDirection: "column", gap: 10 }}>
        {TOPICS.map(t => <TopicRow key={t.id} {...t}/>)}
      </div>
      <TabBar/>
    </>
  );
}

function TopicRow({ id, idx, title, sub, state }: Topic) {
  const stateMap = {
    done:  { label: "ทำแล้ว",     color: "sage" as const,    icon: <Icons.check2 size={14} stroke="#3D5C3B"/> },
    doing: { label: "กำลังทำ",     color: "saffron" as const, icon: <Icons.clock  size={14} stroke="var(--saffron-700)"/> },
    todo:  { label: "ยังไม่เริ่ม",   color: "default" as const, icon: null },
  }[state];
  return (
    <Link href={`/topics/${id}`} className="card" style={{
      padding: 14, display: "flex", gap: 14, alignItems: "flex-start", textDecoration: "none",
    }}>
      <NumPill n={idx} color={state === "done" ? "sage" : state === "doing" ? "saffron" : "ink"}/>
      <div style={{ flex: 1, paddingTop: 2 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.3, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--ink-500)", marginBottom: 8 }}>{sub}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {stateMap.icon}
          <span style={{ fontSize: 11, fontWeight: 600,
            color: state === "done" ? "#3D5C3B" : state === "doing" ? "var(--saffron-700)" : "var(--ink-500)" }}>
            {stateMap.label}
          </span>
        </div>
      </div>
      <Icons.arrow size={18} stroke="var(--ink-400)"/>
    </Link>
  );
}
