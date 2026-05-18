import { Icons } from "@/components/Icons";
import { getPublicProfile } from "@/app/actions/profile";
import { CopyCardLink } from "@/components/CopyCardLink";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DigitalCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getPublicProfile(id);

  if (!profile) {
    notFound();
  }

  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || '👤';

  return (
    <div className="min-h-screen bg-[#FDF1E6] pb-12 overflow-x-hidden font-th">
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full z-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#D45F1C] blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[250px] h-[250px] rounded-full bg-[#C8A04A] blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-[480px] mx-auto px-6 relative z-10 flex flex-col items-center">
          {/* Avatar with Ring */}
          <div className="relative mb-8 animate-fade-in-up">
            <div className="w-[140px] h-[140px] rounded-full p-1 bg-gradient-to-tr from-[#8E3B0F] via-[#F2A876] to-[#C8A04A] shadow-xl">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-[#8E3B0F] font-en">{initials}</span>
                )}
              </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-[#4F7A4D] text-white p-2 rounded-full border-2 border-white shadow-lg">
              <Icons.check size={16} />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-[#1C1A17] text-center mb-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            คุณ{profile.first_name} {profile.last_name}
          </h1>

          <div className="flex flex-wrap justify-center gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="bg-[#FDF1E6] text-[#8E3B0F] border border-[#FCE3CE] text-sm py-1.5 px-4 rounded-full font-semibold">{profile.role}</span>
            {profile.group_name && <span className="bg-[#F2EEE8] text-[#4A443D] border border-[#E8E3DC] text-sm py-1.5 px-4 rounded-full font-medium">{profile.group_name}</span>}
            {profile.province && (
              <span className="bg-[#EEF3ED] text-[#3D5C3B] border border-[#D6E1D4] text-sm py-1.5 px-4 rounded-full font-medium flex items-center gap-1.5">
                <Icons.pin size={14} /> {profile.province}
              </span>
            )}
          </div>

          {profile.motto && (
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-[#FCE3CE] text-center max-w-sm animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Icons.spark size={24} className="mx-auto mb-3 text-[#D45F1C] opacity-60" />
              <p className="text-lg italic font-medium text-[#2E2A25] leading-relaxed">
                "{profile.motto}"
              </p>
              {profile.virtue && (
                <div className="mt-4 pt-4 border-t border-[#FDF1E6] flex items-center justify-center gap-2 text-[#8E3B0F] font-bold text-sm tracking-wide uppercase">
                  ⭐ Core Virtue: {profile.virtue}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── Contact & Socials ────────────────────────────────────── */}
      <section className="max-w-[480px] mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-[32px] shadow-lg border border-[#F2EEE8] p-8">
          <h2 className="text-xs font-bold text-[#B0AAA2] tracking-[0.2em] uppercase mb-6 text-center font-en">Get in Touch</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#FDF1E6] border border-[#FCE3CE] hover:bg-[#FCE3CE] transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#B14A14] shadow-sm group-hover:scale-110 transition-transform">
                  <Icons.phone size={20} />
                </div>
                <span className="text-sm font-semibold text-[#8E3B0F] font-en">{profile.phone}</span>
              </a>
            )}
            {(profile.line_id || profile.line_url) && (
              <a href={profile.line_url || `https://line.me/ti/p/~${profile.line_id}`} target="_blank" className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#EFFFF0] border border-[#D1F7D4] hover:bg-[#DFFDE2] transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#00B900] shadow-sm group-hover:scale-110 transition-transform">
                  <Icons.users size={20} />
                </div>
                <span className="text-sm font-semibold text-[#007F00] font-en">LINE ID</span>
              </a>
            )}
          </div>

          <div className="flex justify-center gap-4 mb-8">
            {profile.facebook_url && (
              <a href={profile.facebook_url} target="_blank" className="w-[52px] h-[52px] rounded-[18px] bg-[#F9F6F1] flex items-center justify-center border border-[#ECE3D2] hover:bg-white hover:border-[#E8843E] hover:-translate-y-1 transition-all shadow-sm">
                <Icons.facebook size={20} className="text-[#67615A]" />
              </a>
            )}
            {profile.instagram_url && (
              <a href={profile.instagram_url} target="_blank" className="w-[52px] h-[52px] rounded-[18px] bg-[#F9F6F1] flex items-center justify-center border border-[#ECE3D2] hover:bg-white hover:border-[#E8843E] hover:-translate-y-1 transition-all shadow-sm">
                <Icons.instagram size={20} className="text-[#67615A]" />
              </a>
            )}
            {profile.tiktok_url && (
              <a href={profile.tiktok_url} target="_blank" className="w-[52px] h-[52px] rounded-[18px] bg-[#F9F6F1] flex items-center justify-center border border-[#ECE3D2] hover:bg-white hover:border-[#E8843E] hover:-translate-y-1 transition-all shadow-sm">
                <Icons.tiktok size={20} className="text-[#67615A]" />
              </a>
            )}
            {profile.youtube_url && (
              <a href={profile.youtube_url} target="_blank" className="w-[52px] h-[52px] rounded-[18px] bg-[#F9F6F1] flex items-center justify-center border border-[#ECE3D2] hover:bg-white hover:border-[#E8843E] hover:-translate-y-1 transition-all shadow-sm">
                <Icons.youtube size={20} className="text-[#67615A]" />
              </a>
            )}
          </div>

          {profile.organization && (
            <div className="pt-6 border-t border-[#F9F6F1] mb-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F9F6F1]">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#B0AAA2]">
                  <Icons.pin size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#B0AAA2] uppercase tracking-wider mb-1 font-en">Organization</div>
                  <div className="text-sm font-semibold text-[#2E2A25]">{profile.organization}</div>
                  {profile.address && <div className="text-xs text-[#8B857D] mt-1">{profile.address}</div>}
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-[#F9F6F1]">
            <div className="text-center text-[10px] font-bold text-[#B0AAA2] tracking-widest uppercase mb-3 font-en">Share this Card</div>
            <CopyCardLink cardId={profile.id} />
          </div>
        </div>
      </section>

      {/* ─── Projects & Activities ────────────────────────────────── */}
      <section className="max-w-[480px] mx-auto px-6 mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1C1A17] flex items-center gap-2">
            <span className="w-1 h-6 bg-[#D45F1C] rounded-full"></span>
            กิจกรรมความดี
          </h2>
          <span className="text-xs font-medium text-[#B0AAA2] font-en">IPS Reflection</span>
        </div>

        {profile.activity_photos && profile.activity_photos.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {profile.activity_photos.map((url: string, i: number) => (
              <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img src={url} alt={`Activity ${i+1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/50 border-2 border-dashed border-[#D4CFC8] rounded-3xl p-12 text-center text-[#B0AAA2]">
             <Icons.spark size={32} className="mx-auto mb-3 opacity-20" />
             <p className="text-sm font-medium">ยังไม่มีกิจกรรมที่แสดงในขณะนี้</p>
          </div>
        )}

        <a href="https://www.facebook.com/share/p/1EuucsvLsR/" target="_blank" className="mt-8 block p-6 rounded-[28px] bg-gradient-to-br from-[#D45F1C] to-[#8E3B0F] text-white shadow-xl shadow-orange-500/20 relative overflow-hidden group">
          <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-80 mb-1 font-en">Joined Program</div>
              <div className="text-lg font-bold">โครงการสร้างศาสนทายาท IPS</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icons.arrowRight size={20} />
            </div>
          </div>
        </a>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer className="mt-20 text-center px-6">
        <div className="w-12 h-1 bg-[#E8E3DC] mx-auto mb-6 rounded-full"></div>
        <div className="text-[10px] font-bold text-[#B0AAA2] tracking-[0.3em] uppercase mb-2 font-en">Developed for</div>
        <div className="text-sm font-bold text-[#67615A]">VME · IPS REFLECTION</div>
        <div className="text-[10px] text-[#B0AAA2] mt-4 opacity-50 font-en">© 2026 โครงการทุนเรียนภาษานานาชาติ IPS</div>
      </footer>
    </div>
  );
}
