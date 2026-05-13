import { getUsersSummary } from "@/app/actions/responses";
import { getProfile } from "@/app/actions/profile";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Icons } from "@/components/Icons";

export default async function AdminSummaryPage() {
  const profile = await getProfile();
  
  // Basic security check
  if (!profile?.role?.toLowerCase().includes('admin')) {
    redirect("/");
  }

  const users = await getUsersSummary();

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link href="/" style={{ 
          width: 36, height: 36, borderRadius: 10, background: "white", 
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid var(--ink-200)", color: "inherit"
        }}>
          <div style={{ display: "flex", transform: "rotate(180deg)" }}>
            <Icons.arrow size={18} />
          </div>
        </Link>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>สรุปข้อมูลรายบุคคล</h1>
          <p style={{ fontSize: 13, color: "var(--ink-500)", margin: 0 }}>ติดตามความคืบหน้าของสมาชิกทั้งหมด</p>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--ink-200)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "1px solid var(--ink-200)" }}>
                <th style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "var(--ink-600)" }}>รายชื่อ</th>
                <th style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "var(--ink-600)", textAlign: "center" }}>ความคืบหน้า</th>
                <th style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "var(--ink-600)", textAlign: "right" }}>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid var(--ink-100)" }}>
                  <td style={{ padding: "16px" }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{user.first_name} {user.last_name}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-500)" }}>{user.email}</div>
                  </td>
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: "#E5E7EB", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${user.percentage}%`, height: "100%", background: user.percentage === 100 ? "#10B981" : "#F59E0B" }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-700)" }}>{Math.round(user.percentage)}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    {user.percentage === 100 ? (
                      <span style={{ padding: "4px 8px", borderRadius: 20, background: "#ECFDF5", color: "#065F46", fontSize: 11, fontWeight: 700 }}>ครบถ้วน</span>
                    ) : user.percentage > 0 ? (
                      <span style={{ padding: "4px 8px", borderRadius: 20, background: "#FFFBEB", color: "#92400E", fontSize: 11, fontWeight: 700 }}>กำลังทำ</span>
                    ) : (
                      <span style={{ padding: "4px 8px", borderRadius: 20, background: "#F3F4F6", color: "#4B5563", fontSize: 11, fontWeight: 700 }}>ยังไม่เริ่ม</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 24, padding: 16, background: "#EEF2FF", borderRadius: 12, border: "1px solid #D1DBFF" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#3730A3", display: "flex", alignItems: "center", gap: 8 }}>
          <Icons.info size={16} />
          <span>ข้อมูลเชิงลึก</span>
        </div>
        <p style={{ fontSize: 13, color: "#4338CA", marginTop: 4, lineHeight: 1.5 }}>
          ขณะนี้มีผู้ใช้งานทั้งหมด {users.length} ท่าน สรุปข้อมูลครบถ้วนแล้ว {users.filter(u => u.percentage === 100).length} ท่าน
        </p>
      </div>
    </div>
  );
}
