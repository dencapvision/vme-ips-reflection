import { login, loginByName } from '@/app/actions/auth'
import { Icons } from '@/components/Icons'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; mode?: string }>
}) {
  const { message, mode } = await searchParams
  const isAdminMode = mode === 'email'

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "20px",
      background: "linear-gradient(135deg, var(--saffron-50) 0%, #fff 100%)"
    }}>
      <div className="card" style={{ padding: 24, maxWidth: 400, margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, background: "var(--saffron-100)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16
          }}>
            <Icons.user size={32} stroke="var(--saffron-600)"/>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink-900)" }}>ยินดีต้อนรับ</h1>
          <p style={{ fontSize: 14, color: "var(--ink-500)", marginTop: 4 }}>
            {isAdminMode ? 'เข้าสู่ระบบสำหรับผู้ดูแลระบบ' : 'ระบบ VME · IPS Reflection'}
          </p>
        </div>

        {message && (
          <div style={{
            padding: 12, background: "#fee2e2", color: "#b91c1c",
            borderRadius: 8, fontSize: 13, textAlign: "center", marginBottom: 16
          }}>
            {message}
          </div>
        )}

        {isAdminMode ? (
          <form action={login} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-700)" }}>
                อีเมล
              </label>
              <input
                id="email" name="email" type="email" required
                placeholder="admin@example.com"
                autoComplete="email"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12,
                  border: "1px solid var(--ink-200)", fontSize: 15,
                  outline: "none", transition: "border-color 0.2s"
                }}
              />
            </div>
            <div>
              <label htmlFor="password" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-700)" }}>
                รหัสผ่าน
              </label>
              <input
                id="password" name="password" type="password" required
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12,
                  border: "1px solid var(--ink-200)", fontSize: 15,
                  outline: "none", transition: "border-color 0.2s"
                }}
              />
            </div>
            <button type="submit" style={{
              width: "100%", padding: "14px", borderRadius: 12, marginTop: 8,
              background: "#6B46C1", color: "white", fontWeight: 600,
              fontSize: 15, border: "none", cursor: "pointer"
            }}>
              เข้าสู่ระบบ
            </button>
          </form>
        ) : (
          <form action={loginByName} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label htmlFor="first_name" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-700)" }}>
                  ชื่อจริง
                </label>
                <input
                  id="first_name" name="first_name" required
                  placeholder="ชื่อ"
                  autoComplete="given-name"
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12,
                    border: "1px solid var(--ink-200)", fontSize: 15,
                    outline: "none", transition: "border-color 0.2s"
                  }}
                />
              </div>
              <div>
                <label htmlFor="last_name" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-700)" }}>
                  นามสกุล
                </label>
                <input
                  id="last_name" name="last_name" required
                  placeholder="นามสกุล"
                  autoComplete="family-name"
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12,
                    border: "1px solid var(--ink-200)", fontSize: 15,
                    outline: "none", transition: "border-color 0.2s"
                  }}
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-700)" }}>
                เบอร์โทรศัพท์
              </label>
              <input
                id="phone" name="phone" type="tel" required
                placeholder="0812345678"
                autoComplete="tel"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12,
                  border: "1px solid var(--ink-200)", fontSize: 15,
                  outline: "none", transition: "border-color 0.2s"
                }}
              />
            </div>
            <button type="submit" style={{
              width: "100%", padding: "14px", borderRadius: 12, marginTop: 8,
              background: "var(--saffron-600)", color: "white", fontWeight: 600,
              fontSize: 15, border: "none", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(234, 88, 12, 0.2)"
            }}>
              เข้าสู่ระบบ
            </button>
          </form>
        )}

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "var(--ink-400)" }}>
          {isAdminMode ? (
            <Link href="/login" style={{ color: "var(--ink-400)", textDecoration: "none" }}>
              ← กลับ
            </Link>
          ) : (
            <Link href="/login?mode=email" style={{ color: "var(--ink-400)", textDecoration: "none" }}>
              ผู้ดูแลระบบ
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
