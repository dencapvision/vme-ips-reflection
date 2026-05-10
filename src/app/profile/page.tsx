import { Icons } from "@/components/Icons";
import { AppHeader } from "@/components/AppHeader";
import { TabBar } from "@/components/TabBar";
import { getProfile, logout } from "@/app/actions/auth"; // Need to export logout there
import { getProfile as fetchProfile } from "@/app/actions/profile";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const profile = await fetchProfile();

  if (!profile) {
    redirect('/login');
  }

  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || '👤';

  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <AppHeader large title="โปรไฟล์" subtitle="MY PROFILE"/>
      </div>

      <div style={{ padding: "4px 22px 30px" }}>
        <div style={{
          background: "linear-gradient(135deg, #FDF1E6 0%, #FCE3CE 100%)",
          borderRadius: "var(--r-xl)", padding: 20, marginBottom: 18,
          border: "1px solid var(--saffron-100)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 32, background: "var(--white)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 600, color: "var(--saffron-700)",
              border: "2px solid var(--saffron-200)", overflow: "hidden"
            }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>คุณ{profile.first_name} {profile.last_name}</div>
              <div style={{ fontSize: 12, color: "var(--ink-600)", marginTop: 2 }}>{profile.role} {profile.group_name && `· ${profile.group_name}`}</div>
              {profile.province && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6,
                  fontSize: 11, color: "var(--saffron-700)", fontWeight: 600,
                }}>
                  <Icons.pin size={12} stroke="var(--saffron-700)"/> {profile.province}
                </div>
              )}
            </div>
            <Link href="/profile/edit" style={{
              width: 36, height: 36, borderRadius: 18, background: "var(--white)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid var(--saffron-200)", textDecoration: "none"
            }}>
              <Icons.edit size={16} stroke="var(--saffron-700)"/>
            </Link>
          </div>

          {(profile.motto || profile.virtue) && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px dashed var(--saffron-300)" }}>
              {profile.motto && <div style={{ fontSize: 13, color: "var(--ink-700)", fontStyle: "italic" }}>"{profile.motto}"</div>}
              {profile.virtue && <div style={{ fontSize: 12, color: "var(--saffron-700)", fontWeight: 600, marginTop: 4 }}>⭐ {profile.virtue}</div>}
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 18 }}>
          {[
            { n: "5/8", label: "หัวข้อ\nที่ทบทวน" },
            { n: "12",  label: "บันทึก\nReflection" },
            { n: "3",   label: "SMART\nGoal" },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: "var(--saffron-600)", fontFamily: "var(--font-en)" }}>{s.n}</div>
              <div style={{ fontSize: 11, color: "var(--ink-600)", marginTop: 4, whiteSpace: "pre-line", lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {profile.is_public && (
          <Link href={`/card/${profile.id}`} className="card" style={{ 
            padding: 16, marginBottom: 18, display: "flex", alignItems: "center", gap: 12,
            background: "linear-gradient(135deg, var(--saffron-600) 0%, var(--saffron-700) 100%)",
            color: "white", textDecoration: "none" 
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>นามบัตรดิจิทัลของคุณ</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>คลิกเพื่อดูและแชร์นามบัตรของคุณ</div>
            </div>
            <Icons.arrow size={20} stroke="white"/>
          </Link>
        )}

        <div className="card" style={{ padding: 16, marginBottom: 18 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            color: "var(--saffron-600)", fontFamily: "var(--font-en)", marginBottom: 8,
          }}>CURRENT WORKSHOP</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>โครงการสร้างศาสนทายาท IPS</div>
          <div style={{ fontSize: 12, color: "var(--ink-600)", lineHeight: 1.55 }}>
            VME — อาสาการศึกษา<br/>
            ศูนย์ปฏิบัติธรรมอโยธยา DCI · พระนครศรีอยุธยา<br/>
            8–10 พฤษภาคม 2569
          </div>
        </div>

        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{
            padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
            borderBottom: "1px solid var(--ink-100)", cursor: "pointer"
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: "var(--ink-100)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><Icons.globe size={16} stroke="var(--ink-700)"/></div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>ภาษา / Language</div>
            <div style={{ fontSize: 12, color: "var(--ink-500)" }}>ไทย</div>
            <Icons.arrow size={14} stroke="var(--ink-400)"/>
          </div>

          <form action={logout}>
            <button type="submit" style={{
              width: "100%", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              color: "#b91c1c"
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: "#fee2e2",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}><Icons.logout size={16} stroke="#b91c1c"/></div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>ออกจากระบบ</div>
            </button>
          </form>
        </div>
      </div>

      <TabBar/>
    </>
  );
}
