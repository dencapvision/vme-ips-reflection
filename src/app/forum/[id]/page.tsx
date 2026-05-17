"use client";

import { AppHeader } from "@/components/AppHeader";
import { TabBar } from "@/components/TabBar";
import { Icons } from "@/components/Icons";
import Link from "next/link";
import { useParams } from "next/navigation";

const topicsData = {
  1: {
    title: "เทคนิคการชวนบวชอย่างไรให้สำเร็จ",
    author: "สมาชิก VME-001",
    date: "17 พ.ค. 2026",
    content: "สวัสดีครับเพื่อนๆ ทุกคน วันนี้ผมอยากจะมาสอบถามหรือให้ทุกท่านช่วยแชร์เทคนิคการชวนคนมาบวชในโครงการต่างๆ หน่อยครับว่าทำอย่างไรให้ประสบความสำเร็จ มีวิธีการพูดคุยหรือเปิดใจอย่างไรบ้างครับ ขอบคุณล่วงหน้าครับ",
    adminComment: "ขอบคุณสำหรับการตั้งกระทู้นี้นะครับ ทางทีมงานขอแนะนำเทคนิคเพิ่มเติมคือการสร้างความคุ้นเคยและใช้ความจริงใจในการพูดคุยครับ พยายามเล่าถึงประโยชน์ที่จะได้รับจากการบวช ทั้งต่อตนเองและครอบครัว และที่สำคัญคือต้องมีความอดทนและสม่ำเสมอครับ เป็นกำลังใจให้นะครับ"
  },
  2: {
    title: "แชร์ประสบการณ์การทำงานในพื้นที่",
    author: "สมาชิก VME-042",
    date: "16 พ.ค. 2026",
    content: "เมื่อวานได้ลงพื้นที่ไปพูดคุยกับชาวบ้านในชุมชน รู้สึกประทับใจมากครับ ได้เห็นความตั้งใจและรอยยิ้มของทุกคน เลยอยากชวนเพื่อนๆ มาแชร์ประสบการณ์การทำงานในพื้นที่ของแต่ละคนบ้างครับ ว่าเจออะไรสนุกๆ หรือท้าทายบ้าง",
    adminComment: "เป็นประสบการณ์ที่ยอดเยี่ยมมากครับ ขอเป็นกำลังใจให้ทุกท่านในการทำงานในพื้นที่ครับ หากมีปัญหาอะไรสามารถแจ้งทีมงานได้ตลอดเลยนะครับ การทำงานในพื้นที่มีความสำคัญมากในการสร้างความสัมพันธ์อันดีครับ"
  },
  3: {
    title: "ถาม-ตอบ ปัญหาการใช้งานแอป VME",
    author: "สมาชิก VME-115",
    date: "15 พ.ค. 2026",
    content: "รบกวนสอบถามหน่อยครับ ช่วงนี้เวลาเข้าแอปแล้วรู้สึกว่าโหลดช้ากว่าปกติ หรือบางทีก็เด้งออก ไม่แน่ใจว่าเป็นที่เครื่องผมคนเดียวหรือเปล่า มีวิธีแก้ไขเบื้องต้นไหมครับ?",
    adminComment: "สำหรับปัญหาการเข้าสู่ระบบหรือแอปทำงานช้า แนะนำให้ลองล้างแคช (Clear Cache) ของเบราว์เซอร์หรืออัปเดตแอปให้เป็นเวอร์ชันล่าสุดดูนะครับ หากยังมีปัญหา สามารถทักแชทแจ้งทีมงานพร้อมแนบรูปภาพปัญหาได้เลยครับ ทีมงานจะรีบตรวจสอบให้ทันทีครับ"
  },
  4: {
    title: "รวมภาพบรรยากาศโครงการ IPS#11",
    author: "ทีมงานสื่อ VME",
    date: "14 พ.ค. 2026",
    content: "ประมวลภาพความประทับใจจากโครงการ IPS รุ่นที่ 11 ที่เพิ่งผ่านพ้นไปครับ ทุกท่านสามารถเข้ามาดูภาพและร่วมคอมเมนต์ความรู้สึกที่ได้รับจากโครงการนี้กันได้เลยนะครับ (รูปภาพกำลังทยอยอัปโหลดครับ)",
    adminComment: "ภาพบรรยากาศสวยงามและน่าประทับใจมากครับ ขออนุโมทนาบุญกับทุกท่านที่ได้มาร่วมโครงการ IPS#11 ในครั้งนี้นะครับ 🙏 ไว้พบกันใหม่ในโครงการหน้านะครับ"
  }
};

export default function ForumTopicPage() {
  const params = useParams();
  const topicId = Number(params.id);
  const topic = topicsData[topicId as keyof typeof topicsData];

  if (!topic) {
    return (
      <>
        <div style={{ paddingTop: 30 }}>
          <AppHeader large title="ไม่พบกระทู้" subtitle="FORUM ERROR" />
        </div>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>ขออภัย ไม่พบกระทู้ที่คุณต้องการ</p>
          <Link href="/forum" style={{ color: "#1976D2", textDecoration: "none", marginTop: 20, display: "inline-block" }}>
            กลับหน้ารวมกระทู้
          </Link>
        </div>
        <TabBar />
      </>
    );
  }

  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <AppHeader large title="กระทู้สนทนา" subtitle="COMMUNITY FORUM" />
      </div>

      <div style={{ padding: "4px 22px 100px" }}>
        
        {/* Topic Content */}
        <div className="card" style={{ padding: 24, marginBottom: 20, borderRadius: "var(--r-xl)", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", marginBottom: 16, lineHeight: 1.4 }}>
            {topic.title}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #F1F5F9" }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: "#E3F2FD", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.user size={20} stroke="#1976D2" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#37474F" }}>{topic.author}</div>
              <div style={{ fontSize: 12, color: "#78909C" }}>{topic.date}</div>
            </div>
          </div>
          <div style={{ fontSize: 15, color: "#455A64", lineHeight: 1.6 }}>
            {topic.content}
          </div>
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#37474F", marginBottom: 12, paddingLeft: 8 }}>
          ความคิดเห็น (1)
        </h3>

        {/* Admin Comment */}
        <div style={{
          background: "linear-gradient(to right, #F0F7FF, #FFFFFF)",
          borderRadius: 16,
          padding: 20,
          border: "1px solid #BBDEFB",
          borderLeft: "4px solid #2196F3",
          marginBottom: 24,
          boxShadow: "0 2px 8px rgba(33,150,243,0.08)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: "#1976D2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.award size={18} stroke="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1976D2", display: "flex", alignItems: "center", gap: 6 }}>
                ผู้ดูแลระบบ (Admin)
                <div style={{ background: "#E3F2FD", color: "#1565C0", fontSize: 10, padding: "2px 6px", borderRadius: 10, fontWeight: 600 }}>STAFF</div>
              </div>
              <div style={{ fontSize: 12, color: "#78909C" }}>ตอบเมื่อ {topic.date}</div>
            </div>
          </div>
          <div style={{ fontSize: 14, color: "#37474F", lineHeight: 1.6, paddingLeft: 46 }}>
            {topic.adminComment}
          </div>
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link href="/forum" style={{ 
            fontSize: 14, color: "#1976D2", fontWeight: 600, textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 20px", background: "#F5F9FF", borderRadius: 20
          }}>
            <Icons.back size={16} stroke="#1976D2"/> กลับหน้ารวมกระทู้
          </Link>
        </div>

      </div>

      <TabBar />
    </>
  );
}
