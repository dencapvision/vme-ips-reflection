# IPS Reflect — Next.js App

เว็บแอปสรุปบทเรียน · ทบทวนความรู้ · วางแผนนำกลับไปใช้งาน
สำหรับโครงการ **VME — สร้างศาสนทายาท IPS**

## เริ่มใช้งาน

```bash
npm install
npm run dev
```

เปิด <http://localhost:3000>

## โครงสร้างโปรเจกต์

```
app/
  layout.tsx          # Root layout + ฟอนต์ + globals.css
  globals.css         # Design tokens (สี, ฟอนต์, spacing)
  page.tsx            # หน้าหลัก / Dashboard
  welcome/page.tsx    # หน้าเปิดใช้งาน
  profile/page.tsx
  topics/page.tsx     # รายการหัวข้อบทเรียน 8 หัวข้อ
  topics/[id]/page.tsx
  reflect/page.tsx    # What / So What / Now What
  swot/page.tsx
  case/page.tsx       # Success Case
  journal/page.tsx    # สมุดบันทึก timeline
  smart/page.tsx      # SMART Goal Builder
  strategic/page.tsx  # แผนกลยุทธ์ 2569
  library/page.tsx
  ai/page.tsx         # AI ช่วยร่างคำชวน
  export/page.tsx

components/
  AppShell.tsx        # Status bar + Tab bar wrappers
  Icons.tsx           # Line icon set (1.6px stroke, 24x24)
  UI.tsx              # Chip, NumPill, Progress, DualLabel ฯลฯ
  AppHeader.tsx
  TabBar.tsx
```

## Design tokens

- **Saffron จีวร** `#D45F1C` (saffron-500)
- **Cream** `#FBF7F1` background
- **Ink** charcoal/warm gray ramp
- **ฟอนต์** IBM Plex Sans Thai Looped (Body) + IBM Plex Sans (English)

## ขั้นตอนพัฒนาต่อ

- [ ] เชื่อม backend (Supabase / Firebase) สำหรับ auth + storage
- [ ] Persist reflection data ลง DB
- [ ] PDF export endpoint
- [ ] LINE Login + LINE Notify ติดตามผล
- [ ] AI endpoint (Claude / OpenAI) สำหรับ "ร่างคำชวน"
- [ ] PWA + offline mode
