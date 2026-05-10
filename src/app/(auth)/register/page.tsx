import { signup } from '@/app/actions/auth'
import { Icons } from '@/components/Icons'
import Link from 'next/link'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams
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
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink-900)" }}>สร้างบัญชีใหม่</h1>
          <p style={{ fontSize: 14, color: "var(--ink-500)", marginTop: 4 }}>เข้าร่วมเพื่อสร้างนามบัตรดิจิทัลของคุณ</p>
        </div>

        <form action={signup} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {message && (
            <div style={{ padding: 12, background: "#fee2e2", color: "#b91c1c", borderRadius: 8, fontSize: 13, textAlign: "center" }}>
              {message}
            </div>
          )}
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label htmlFor="first_name" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-700)" }}>ชื่อจริง</label>
              <input
                id="first_name"
                name="first_name"
                required
                placeholder="ชื่อ"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12,
                  border: "1px solid var(--ink-200)", fontSize: 15,
                  outline: "none", transition: "border-color 0.2s"
                }}
              />
            </div>
            <div>
              <label htmlFor="last_name" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-700)" }}>นามสกุล</label>
              <input
                id="last_name"
                name="last_name"
                required
                placeholder="นามสกุล"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12,
                  border: "1px solid var(--ink-200)", fontSize: 15,
                  outline: "none", transition: "border-color 0.2s"
                }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-700)" }}>อีเมล</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                border: "1px solid var(--ink-200)", fontSize: 15,
                outline: "none", transition: "border-color 0.2s"
              }}
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-700)" }}>รหัสผ่าน</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              minLength={6}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                border: "1px solid var(--ink-200)", fontSize: 15,
                outline: "none", transition: "border-color 0.2s"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%", padding: "14px", borderRadius: 12, marginTop: 8,
              background: "var(--saffron-600)", color: "white", fontWeight: 600,
              fontSize: 15, border: "none", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(234, 88, 12, 0.2)"
            }}
          >
            สร้างบัญชี
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--ink-500)" }}>
          มีบัญชีอยู่แล้ว?{' '}
          <Link href="/login" style={{ color: "var(--saffron-600)", fontWeight: 600, textDecoration: "none" }}>
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  )
}
