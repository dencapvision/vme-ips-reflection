import { getProfile } from '@/app/actions/profile'
import { getSupabaseAdmin } from '@/lib/clients'
import { createUser, deleteUser } from '@/app/actions/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const ROLES = ['member', 'leader', 'facilitator', 'admin']
const GROUPS = ['กลุ่ม 1', 'กลุ่ม 2', 'กลุ่ม 3', 'กลุ่ม 4', 'กลุ่ม 5', 'กลุ่ม 6', 'วิทยากร', 'ทีมงาน']

export default async function UsersAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  // Verify admin access
  const profile = await getProfile()
  if (!profile) redirect('/login')

  if (!profile.role?.toLowerCase().includes('admin')) redirect('/')

  // List all users
  const supabaseAdmin = getSupabaseAdmin()
  const { data: users } = await supabaseAdmin
    .from('profiles')
    .select('id, first_name, last_name, phone, role, group_name, created_at')
    .order('created_at', { ascending: false })

  const { error: msgError, success: msgSuccess } = await searchParams

  return (
    <div style={{ minHeight: "100vh", background: "#F9F1FF", padding: 20 }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <Link href="/profile" style={{ textDecoration: "none", color: "#8E6DA1", fontSize: 14 }}>← กลับ</Link>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#4A345E", margin: 0 }}>จัดการผู้ใช้งาน</h1>
            <p style={{ fontSize: 13, color: "#8E6DA1", margin: 0, marginTop: 2 }}>เพิ่ม ลบ และดูข้อมูลสมาชิก</p>
          </div>
        </div>

        {/* Messages */}
        {msgError && (
          <div style={{ padding: 12, background: "#fee2e2", color: "#b91c1c", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
            ❌ {msgError}
          </div>
        )}
        {msgSuccess && (
          <div style={{ padding: 12, background: "#dcfce7", color: "#166534", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
            ✅ {msgSuccess}
          </div>
        )}

        {/* Create User Form */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #E5D5F2", padding: 20, marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#4A345E", marginBottom: 16, marginTop: 0 }}>เพิ่มผู้ใช้งานใหม่</h2>
          <form action={createUser} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#6A5A7A" }}>ชื่อจริง *</label>
                <input name="first_name" required placeholder="กรอกชื่อจริง" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#6A5A7A" }}>นามสกุล *</label>
                <input name="last_name" required placeholder="กรอกนามสกุล" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#6A5A7A" }}>เบอร์โทรศัพท์ * (ใช้เป็นรหัสผ่านเข้าใช้งาน)</label>
              <input name="phone" type="tel" required placeholder="08x-xxx-xxxx" style={inputStyle} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#6A5A7A" }}>บทบาท (Role)</label>
                <select name="role" style={inputStyle}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4, color: "#6A5A7A" }}>กลุ่ม</label>
                <select name="group_name" style={inputStyle}>
                  <option value="">— ไม่ระบุ —</option>
                  {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" style={{
              padding: "12px", borderRadius: 12, marginTop: 4,
              background: "linear-gradient(135deg, #A67BCA 0%, #B68FD6 100%)",
              color: "white", fontWeight: 700, fontSize: 14,
              border: "none", cursor: "pointer"
            }}>
              + เพิ่มผู้ใช้งาน
            </button>
          </form>
        </div>

        {/* Users List */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #E5D5F2", padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#4A345E", margin: "0 0 16px" }}>
            สมาชิกทั้งหมด ({users?.length || 0} คน)
          </h2>

          {!users?.length ? (
            <p style={{ fontSize: 13, color: "#8E6DA1", textAlign: "center", padding: "20px 0" }}>ยังไม่มีสมาชิก</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {users.map(u => (
                <div key={u.id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: 12, background: "#F9F1FF", borderRadius: 12,
                  border: "1px solid #E5D5F2"
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 19,
                    background: "linear-gradient(135deg, #B68FD6, #F2A2C0)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: 700, fontSize: 14, flexShrink: 0
                  }}>
                    {u.first_name?.[0]}{u.last_name?.[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#4A345E" }}>
                      {u.first_name} {u.last_name}
                    </div>
                    <div style={{ fontSize: 11, color: "#8E6DA1", marginTop: 1 }}>
                      📞 {u.phone || '—'} · {u.role || 'member'}{u.group_name ? ` · ${u.group_name}` : ''}
                    </div>
                  </div>
                  <form action={deleteUser.bind(null, u.id)}>
                    <button
                      type="submit"
                      style={{
                        padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                        background: "#fee2e2", color: "#b91c1c", border: "none", cursor: "pointer"
                      }}
                    >
                      ลบ
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Login Info */}
        <div style={{
          marginTop: 16, padding: 14, background: "#FFF7ED", borderRadius: 12,
          border: "1px solid #FED7AA", fontSize: 12, color: "#92400E"
        }}>
          <strong>วิธีเข้าสู่ระบบสำหรับสมาชิก:</strong><br/>
          ชื่อจริง + นามสกุล + เบอร์โทรศัพท์ (เบอร์โทร = รหัสผ่าน)
        </div>

      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "14px 18px", borderRadius: 12,
  border: "1px solid #E5D5F2", fontSize: 16, outline: "none",
  background: "white", boxSizing: "border-box",
}
