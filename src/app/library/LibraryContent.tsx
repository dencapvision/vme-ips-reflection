'use client'

import React, { useEffect, useState } from "react";
import { Icons } from "@/components/Icons";
import { Chip, SectionHeader } from "@/components/UI";

interface LibraryLink {
  id: string;
  title: string;
  url: string;
  category: string;
  description?: string;
}

interface LibraryVideo {
  id: string;
  title: string;
  url: string;
  thumbnail_url: string;
  playlist_name: string;
}

export default function LibraryContent() {
  const [links, setLinks] = useState<LibraryLink[]>([]);
  const [videos, setVideos] = useState<LibraryVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [linksRes, videosRes] = await Promise.all([
          fetch('/api/library/links'),
          fetch('/api/library/videos')
        ]);
        
        const linksData = await linksRes.json();
        const videosData = await videosRes.json();
        
        setLinks(linksData.links || []);
        setVideos(videosData.videos || []);
      } catch (error) {
        console.error("Failed to fetch library data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-40 bg-gray-100 rounded-2xl"></div>
        <div className="h-40 bg-gray-100 rounded-2xl"></div>
      </div>
    );
  }

  // Group videos by playlist
  const playlists = videos.reduce((acc, video) => {
    const name = video.playlist_name || "ทั่วไป";
    if (!acc[name]) acc[name] = [];
    acc[name].push(video);
    return acc;
  }, {} as Record<string, LibraryVideo[]>);

  // Group links by category
  const linkCategories = links.reduce((acc, link) => {
    const name = link.category || "ทั่วไป";
    if (!acc[name]) acc[name] = [];
    acc[name].push(link);
    return acc;
  }, {} as Record<string, LibraryLink[]>);

  return (
    <div className="space-y-8">
      {/* YouTube Gallery Section */}
      {videos.length > 0 && (
        <section>
          <SectionHeader title="วิดีโอแนะนำ" en="VIDEO GALLERY" />
          <div className="mt-4 space-y-6">
            {Object.entries(playlists).map(([name, items]) => (
              <div key={name}>
                <h3 className="text-sm font-bold text-[#8E6DA1] mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B68FD6]"></div>
                  {name}
                </h3>
                <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide -mx-2 px-2">
                  {items.map((video) => (
                    <a 
                      key={video.id} 
                      href={video.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-64 group"
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden shadow-sm border border-[#E5D5F2] group-hover:shadow-md transition-all">
                        <img 
                          src={video.thumbnail_url} 
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#B68FD6] shadow-lg">
                            <Icons.play size={20} fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-[#4A345E] line-clamp-2 leading-snug group-hover:text-[#B68FD6] transition-colors">
                        {video.title}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* External Links Section */}
      {links.length > 0 && (
        <section>
          <SectionHeader title="คลังลิงค์และเครื่องมือ" en="RESOURCES & DRIVE" />
          <div className="mt-4 grid grid-cols-1 gap-3">
            {links.map((link) => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-[#E5D5F2] hover:border-[#B68FD6] hover:shadow-sm transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F9F1FF] flex items-center justify-center text-[#B68FD6] group-hover:bg-[#B68FD6] group-hover:text-white transition-colors">
                  {link.url.includes('drive.google.com') ? (
                    <Icons.cloud size={24} />
                  ) : link.url.includes('youtube.com') ? (
                    <Icons.video size={24} />
                  ) : (
                    <Icons.link size={24} />
                  )}
                </div>
                <div className="flex-1 min-width-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-[#8E6DA1] px-2 py-0.5 bg-[#FDF9FF] rounded-md border border-[#F0E4F8]">
                      {link.category}
                    </span>
                  </div>
                  <h4 className="text-[13.5px] font-bold text-[#4A345E] truncate">
                    {link.title}
                  </h4>
                  {link.description && (
                    <p className="text-[11px] text-[#8E6DA1] line-clamp-1 mt-0.5">
                      {link.description}
                    </p>
                  )}
                </div>
                <div className="text-[#E5D5F2] group-hover:text-[#B68FD6] transition-colors">
                  <Icons.arrowRight size={18} />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Featured PDF Section (Placeholder for consistency) */}
      <section>
        <SectionHeader title="ดาวน์โหลดสื่อ & หนังสือเชิญ" en="PR MEDIA & INVITATIONS" />
        <div className="mt-4 grid grid-cols-1 gap-3">
          <div style={{
            background: "linear-gradient(140deg, #E3F2FD 0%, var(--white) 60%, #F1F8FE 100%)",
            borderRadius: "var(--r-xl)", padding: 18, border: "1px solid #BBDEFB",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "var(--font-en)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#1976D2" }}>DOWNLOAD</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>สื่อประชาสัมพันธ์โครงการ IPS#11</div>
                <div style={{ fontSize: 12, color: "var(--ink-600)", marginTop: 6 }}>โปสเตอร์, วิดีโอแนะนำ, และคอนเทนต์โซเชียล</div>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--white)", border: "1px solid #BBDEFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icons.download size={24} stroke="#1976D2"/>
              </div>
            </div>
            <button className="btn-saffron" style={{ padding: "11px 18px", fontSize: 13, background: "#1976D2", borderColor: "#1976D2" }}>
              เข้าสู่พื้นที่ดาวน์โหลด <Icons.arrow size={14} sw={2}/>
            </button>
          </div>

          <div style={{
            background: "linear-gradient(140deg, #FDF1E6 0%, var(--white) 60%, #FCE3CE 100%)",
            borderRadius: "var(--r-xl)", padding: 18, border: "1px solid var(--saffron-100)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "var(--font-en)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "var(--saffron-600)" }}>OFFICIAL</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>หนังสือเชิญร่วมโครงการ</div>
                <div style={{ fontSize: 12, color: "var(--ink-600)", marginTop: 6 }}>ไฟล์ PDF สำหรับพิมพ์หรือส่งต่อทางแอปพลิเคชัน</div>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--white)", border: "1px solid var(--saffron-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icons.doc size={24} stroke="var(--saffron-600)"/>
              </div>
            </div>
            <button className="btn-saffron" style={{ padding: "11px 18px", fontSize: 13 }}>
              ดาวน์โหลดหนังสือเชิญ <Icons.download size={14} sw={2}/>
            </button>
          </div>
        </div>
      </section>

      {/* Featured PDF Section (Placeholder for consistency) */}
      <section>
        <SectionHeader title="คัดสรรมาเพื่อคุณ" en="FEATURED DOCUMENTS" />
        <div style={{
          background: "linear-gradient(140deg, #FDF1E6 0%, var(--white) 60%, #F0E9F1 100%)",
          borderRadius: "var(--r-xl)", padding: 18, marginTop: 16, border: "1px solid var(--saffron-100)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: "var(--font-en)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "var(--saffron-600)" }}>FEATURED</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>โครงการ IPS#11 — คู่มือผู้ชวนบวช</div>
              <div style={{ fontSize: 12, color: "var(--ink-600)", marginTop: 6 }}>26 หน้า · 4 วิดีโอ · อัปเดต พ.ค. 2569</div>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--white)", border: "1px solid var(--saffron-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.lotus size={24} stroke="var(--saffron-600)"/>
            </div>
          </div>
          <button className="btn-saffron" style={{ padding: "11px 18px", fontSize: 13 }}>
            อ่านคู่มือ <Icons.arrow size={14} sw={2}/>
          </button>
        </div>
      </section>
    </div>
  );
}
