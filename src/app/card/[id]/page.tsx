import { Icons } from "@/components/Icons";
import { AppHeader } from "@/components/AppHeader";
import { getPublicProfile } from "@/app/actions/profile";
import { notFound } from "next/navigation";

export default async function DigitalCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getPublicProfile(id);

  if (!profile) {
    notFound();
  }

  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || '👤';

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink-50)", paddingBottom: 40 }}>
      <div style={{ paddingTop: 30, paddingBottom: 20 }}>
        <AppHeader title="นามบัตรดิจิทัล" subtitle="DIGITAL BUSINESS CARD" />
      </div>

      <div style={{ padding: "0 22px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{
          background: "white", borderRadius: "var(--r-xl)", padding: 32,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          border: "1px solid var(--ink-100)", position: "relative", overflow: "hidden"
        }}>
          {/* Header Graphic */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 100,
            background: "linear-gradient(135deg, var(--saffron-400) 0%, var(--saffron-600) 100%)",
          }}></div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1, marginTop: 30 }}>
            <div style={{
              width: 100, height: 100, borderRadius: 50, background: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 600, color: "var(--saffron-700)",
              border: "4px solid white", boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              marginBottom: 20, overflow: "hidden"
            }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : initials}
            </div>

            <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink-900)", textAlign: "center", marginBottom: 4 }}>
              คุณ{profile.first_name} {profile.last_name}
            </h1>
            
            <div style={{ fontSize: 14, color: "var(--ink-600)", fontWeight: 500, textAlign: "center", marginBottom: 20 }}>
              {profile.role} {profile.group_name && `· ${profile.group_name}`}
            </div>

            {(profile.motto || profile.virtue) && (
              <div style={{ 
                background: "var(--saffron-50)", padding: 16, borderRadius: 12, 
                width: "100%", textAlign: "center", marginBottom: 24,
                border: "1px dashed var(--saffron-200)"
              }}>
                {profile.motto && <div style={{ fontSize: 14, color: "var(--ink-800)", fontStyle: "italic", lineHeight: 1.5 }}>"{profile.motto}"</div>}
                {profile.virtue && <div style={{ fontSize: 13, color: "var(--saffron-700)", fontWeight: 600, marginTop: 8 }}>⭐ {profile.virtue}</div>}
              </div>
            )}

            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
              {profile.phone && (
                <a href={`tel:${profile.phone}`} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                  background: "var(--ink-50)", borderRadius: 12, textDecoration: "none", color: "var(--ink-800)"
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 18, background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icons.chat size={16} stroke="var(--saffron-600)"/>
                  </div>
                  <div style={{ flex: 1, fontWeight: 500 }}>{profile.phone}</div>
                </a>
              )}
              
              {profile.line_id && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                  background: "var(--ink-50)", borderRadius: 12, color: "var(--ink-800)"
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 18, background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "#00B900" }}>
                    <Icons.users size={16} stroke="currentColor"/>
                  </div>
                  <div style={{ flex: 1, fontWeight: 500 }}>LINE: {profile.line_id}</div>
                </div>
              )}

              {profile.province && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                  background: "var(--ink-50)", borderRadius: 12, color: "var(--ink-800)"
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 18, background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icons.pin size={16} stroke="var(--saffron-600)"/>
                  </div>
                  <div style={{ flex: 1, fontWeight: 500 }}>{profile.province}</div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 32, fontSize: 12, color: "var(--ink-400)", textAlign: "center" }}>
              Powered by VME · IPS REFLECTION
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
