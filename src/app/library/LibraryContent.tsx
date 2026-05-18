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
  section?: string;
  badge_text?: string;
  meta_info?: string;
  sort_order?: number;
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
  const [curriculumTab, setCurriculumTab] = useState<"nese" | "benefits" | "schedule">("nese");

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

  // Split links by section
  const prMediaLinks = links.filter(l => l.section === 'pr-media');
  const featuredLinks = links.filter(l => l.section === 'featured');
  const resourceLinks = links.filter(l => !l.section || l.section === 'resource');

  // Group resource links by category
  const linkCategories = resourceLinks.reduce((acc, link) => {
    const name = link.category || "ทั่วไป";
    if (!acc[name]) acc[name] = [];
    acc[name].push(link);
    return acc;
  }, {} as Record<string, LibraryLink[]>);

  return (
    <div className="space-y-8">
      {/* โครงสร้างหลักสูตรและกำหนดการ IPS#11 (DCI) */}
      <section className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#E5D5F2] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-[#B68FD6] via-[#9B7BB6] to-[#8E6DA1] p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Icons.lotus className="text-white" size={24} />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#FDF9FF]/90 uppercase">DCI Center · Ayutthaya</span>
              <h2 className="text-lg font-bold leading-tight">โครงการทุนบวชเรียนภาษานานาชาติ IPS#11</h2>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-[#F0E4F8] bg-[#FAF6FC] p-1.5 gap-1">
          <button
            onClick={() => setCurriculumTab("nese")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              curriculumTab === "nese"
                ? "bg-white text-[#8E6DA1] shadow-sm border border-[#E5D5F2]"
                : "text-[#8E6DA1]/70 hover:bg-white/50 hover:text-[#8E6DA1]"
            }`}
          >
            <Icons.globe size={14} />
            หลักสูตร NESE (USA)
          </button>
          <button
            onClick={() => setCurriculumTab("benefits")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              curriculumTab === "benefits"
                ? "bg-white text-[#8E6DA1] shadow-sm border border-[#E5D5F2]"
                : "text-[#8E6DA1]/70 hover:bg-white/50 hover:text-[#8E6DA1]"
            }`}
          >
            <Icons.spark size={14} />
            สิทธิประโยชน์ & เกณฑ์
          </button>
          <button
            onClick={() => setCurriculumTab("schedule")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              curriculumTab === "schedule"
                ? "bg-white text-[#8E6DA1] shadow-sm border border-[#E5D5F2]"
                : "text-[#8E6DA1]/70 hover:bg-white/50 hover:text-[#8E6DA1]"
            }`}
          >
            <Icons.cal size={14} />
            กำหนดการปี 2570
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5">
          {curriculumTab === "nese" && (
            <div className="space-y-6">
              {/* NESE Partner Badge and Overview */}
              <div className="bg-gradient-to-br from-[#FAF5FF] to-[#F3E8FF] p-4 rounded-2xl border border-[#E9D5FF] flex flex-col md:flex-row gap-4 items-center">
                <div className="w-16 h-16 bg-white rounded-2xl border border-[#D8B4FE] shadow-sm flex items-center justify-center flex-shrink-0">
                  <span className="text-[16px] font-extrabold text-[#7C3AED] tracking-tight">NESE</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold text-[#7C3AED] bg-[#EDE9FE] px-2 py-0.5 rounded-md uppercase tracking-wider">สถาบันมาตรฐานโลก</span>
                    <span className="text-[10px] font-bold text-[#8E6DA1]">Boston, USA</span>
                  </div>
                  <h4 className="text-[15px] font-bold text-[#4A345E]">ความร่วมมือระดับสากลกับ The New England School of English</h4>
                  <p className="text-[12px] text-[#5C4575] mt-1 leading-relaxed">
                    ยกระดับมาตรฐานภาษาอังกฤษด้วยหลักสูตรเข้มข้น 10 ระดับความรู้ (G1 ถึง G10) เรียนเต็มอิ่มวันละ 5 ชั่วโมง 4 วันต่อสัปดาห์ มุ่งมั่นพิชิตคะแนนมาตรฐานสากล <strong>TOEIC 750+</strong> เพื่อทักษะสื่อสารและงานวิจัยระดับสูง
                  </p>
                </div>
              </div>

              {/* 10 Levels Grid Showcase */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-bold tracking-wider text-[#8E6DA1] uppercase">ผังหลักสูตรภาษาอังกฤษ 10 ระดับ (G1 - G10)</h4>
                  <span className="text-[10px] text-[#8E6DA1] font-semibold">TOEIC 750+ Target</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { lv: 1, name: "Foundation I", style: "from-[#F3E8FF] to-[#E9D5FF] text-[#6B21A8] border-[#D8B4FE]" },
                    { lv: 2, name: "Foundation II", style: "from-[#F3E8FF] to-[#E9D5FF] text-[#6B21A8] border-[#D8B4FE]" },
                    { lv: 3, name: "Foundation III", style: "from-[#F3E8FF] to-[#E9D5FF] text-[#6B21A8] border-[#D8B4FE]" },
                    { lv: 4, name: "Intermediate I", style: "from-[#E0F2FE] to-[#BAE6FD] text-[#0369A1] border-[#7DD3FC]" },
                    { lv: 5, name: "Intermediate II", style: "from-[#E0F2FE] to-[#BAE6FD] text-[#0369A1] border-[#7DD3FC]" },
                    { lv: 6, name: "Intermediate III", style: "from-[#E0F2FE] to-[#BAE6FD] text-[#0369A1] border-[#7DD3FC]" },
                    { lv: 7, name: "Advanced I", style: "from-[#ECFDF5] to-[#D1FAE5] text-[#065F46] border-[#6EE7B7]" },
                    { lv: 8, name: "Advanced II", style: "from-[#ECFDF5] to-[#D1FAE5] text-[#065F46] border-[#6EE7B7]" },
                    { lv: 9, name: "Academic Elite", style: "from-[#FFF7ED] to-[#FFEDD5] text-[#9A3412] border-[#FDBA74]" },
                    { lv: 10, name: "TOEIC Master", style: "from-[#FEF2F2] to-[#FEE2E2] text-[#991B1B] border-[#FCA5A5] ring-2 ring-[#EF4444]/20" },
                  ].map((level) => (
                    <div 
                      key={level.lv} 
                      className={`p-2.5 rounded-xl border bg-gradient-to-br ${level.style} text-center transition-all duration-300 hover:scale-105 hover:shadow-sm`}
                    >
                      <div className="text-[13px] font-extrabold">G{level.lv}</div>
                      <div className="text-[9px] font-semibold opacity-90 mt-0.5 truncate">{level.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities Highlight */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold tracking-wider text-[#8E6DA1] uppercase">กิจกรรมการฝึกฝนและฝึกภาคปฏิบัติ (Experiential Learning)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-white border border-[#E5D5F2] rounded-2xl flex gap-3 hover:border-[#B68FD6] hover:shadow-sm transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF0FF] flex items-center justify-center text-[#B68FD6] flex-shrink-0">
                      <Icons.chat size={18} />
                    </div>
                    <div>
                      <h5 className="text-[13px] font-bold text-[#4A345E]">Monk Chat ที่อยุธยา</h5>
                      <p className="text-[11px] text-[#8E6DA1] mt-1 leading-relaxed">
                        ทำหน้าที่กัลยาณมิตร สนทนาแลกเปลี่ยนธรรมะและภาษาอังกฤษกับชาวต่างชาติจริง ณ วัดมหาธาตุ พระนครศรีอยุธยา
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white border border-[#E5D5F2] rounded-2xl flex gap-3 hover:border-[#B68FD6] hover:shadow-sm transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF0FF] flex items-center justify-center text-[#B68FD6] flex-shrink-0">
                      <Icons.home size={18} />
                    </div>
                    <div>
                      <h5 className="text-[13px] font-bold text-[#4A345E]">Temple Stay พรีเมียม</h5>
                      <p className="text-[11px] text-[#8E6DA1] mt-1 leading-relaxed">
                        สัมผัสชีวิตสมณะ ฝึกการบริหารเวลา สภาพแวดล้อมที่ได้รับการดูแลและส่งเสริมทัศนคติเชิงบวกอย่างยอดเยี่ยม
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white border border-[#E5D5F2] rounded-2xl flex gap-3 hover:border-[#B68FD6] hover:shadow-sm transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF0FF] flex items-center justify-center text-[#B68FD6] flex-shrink-0">
                      <Icons.globe size={18} />
                    </div>
                    <div>
                      <h5 className="text-[13px] font-bold text-[#4A345E]">อบรมสมาธิป่าแป๋ เชียงใหม่</h5>
                      <p className="text-[11px] text-[#8E6DA1] mt-1 leading-relaxed">
                        ฝึกปฏิบัติสมาธิควบคู่การใช้ชีวิตสื่อสารภาษาอังกฤษท่ามกลางธรรมชาติร่มรื่น ณ ป่าแป๋ เมดิเทชั่น เซ็นเตอร์ จ.เชียงใหม่
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pali co-curriculum option */}
              <div className="bg-[#FAF3E8] p-3.5 rounded-2xl border border-[#F5E6CC] flex items-start gap-3">
                <Icons.info className="text-[#D9822B] flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <h6 className="text-[12.5px] font-bold text-[#8C5820]">แผนการเรียนบาลีควบคู่ภาษาอังกฤษ (Pali Co-curriculum Track)</h6>
                  <p className="text-[11px] text-[#8C5820]/90 leading-relaxed mt-0.5">
                    เปิดโอกาสให้ผู้มีความสนใจ สามารถเลือกศึกษาต่อพระปริยัติธรรมแผนกบาลี (ป.ธ. 1-2 ถึง ป.ธ. 9) ไปด้วยกันได้ เพื่อเพิ่มขีดความสามารถการศึกษาเปรียบเทียบในระดับสากล มีระบบติวเข้มและวัดผลแบบขั้นบันไดส่วนตัว
                  </p>
                </div>
              </div>
            </div>
          )}

          {curriculumTab === "benefits" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Benefits List */}
                <div className="space-y-3">
                  <h4 className="text-[12px] font-bold tracking-wider text-[#8E6DA1] uppercase flex items-center gap-1.5">
                    <Icons.spark size={14} className="text-[#B68FD6]" />
                    สิทธิประโยชน์ระดับพรีเมียม (เรียนฟรี 100%)
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { title: "ไม่มีข้อผูกมัดหรือค่าปรับ", desc: "เรียนบวชเรียนเพื่อพัฒนาตนเอง ไม่มีเงื่อนไขหรือค่าปรับใดๆ หากจำเป็นต้องลาออกกลางคัน" },
                      { title: "ฟรีค่าที่พัก อาหาร และสิ่งอำนวยความสะดวก", desc: "ที่พักมาตรฐาน สะอาด ปลอดภัย ดูแลคุณภาพชีวิตแบบครบวงจรฟรี 100%" },
                      { title: "ฟรีค่าสมัครสอบมาตรฐาน TOEIC", desc: "สนับสนุนค่าสอบวัดระดับมาตรฐานระดับสากลเพื่อการันตีคุณภาพทักษะภาษา" },
                      { title: "รับใบประกาศนียบัตรรับรองจาก DCI", desc: "ได้รับการรับรองอย่างเป็นทางการจากสถาบันการศึกษาเพื่อใช้ต่อยอด" },
                      { title: "อบรมพิเศษทักษะ AI & เทคโนโลยี", desc: "หลักสูตร Generative AI เพื่อการประยุกต์ใช้งานในงานเผยแผ่และการสอนยุคดิจิทัล" },
                      { title: "พัฒนาบุคลิกภาพระดับสากล", desc: "การปรับบุคลิกภาพ (Personality Development) และทักษะการนำเสนอในที่สาธารณะ" },
                    ].map((benefit, i) => (
                      <div key={i} className="p-3 bg-[#FAF8FC] border border-[#F0E4F8] rounded-xl flex gap-3 transition-all hover:bg-white hover:border-[#B68FD6] hover:shadow-sm duration-300">
                        <Icons.check className="text-[#B68FD6] flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <h5 className="text-[12.5px] font-bold text-[#4A345E]">{benefit.title}</h5>
                          <p className="text-[10.5px] text-[#8E6DA1] mt-0.5 leading-normal">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admission Qualifications */}
                <div className="space-y-3">
                  <h4 className="text-[12px] font-bold tracking-wider text-[#8E6DA1] uppercase flex items-center gap-1.5">
                    <Icons.target size={14} className="text-[#B68FD6]" />
                    เกณฑ์คุณสมบัติผู้สมัครคัดเลือก
                  </h4>
                  
                  <div className="bg-[#FAF8FC] p-5 rounded-2xl border border-[#F0E4F8] space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF0FF] flex items-center justify-center text-[#B68FD6] flex-shrink-0">
                        <Icons.user size={20} />
                      </div>
                      <div>
                        <h5 className="text-[13px] font-bold text-[#4A345E]">คุณสมบัติพื้นฐานและวุฒิการศึกษา</h5>
                        <p className="text-[11px] text-[#8E6DA1] mt-0.5">คัดกรองเบื้องต้นเพื่อความพร้อมทางการเรียนรู้</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { title: "เพศและวุฒิการศึกษา", desc: "ชายแท้ จบชั้น ม.6 หรือเทียบเท่า หรือสอบผ่านเปรียญธรรม 5 ประโยค (ป.ธ.5) ขึ้นไป" },
                        { title: "เกณฑ์อายุของโครงการ", desc: "อายุไม่เกิน 25 ปี ณ วันสมัคร เพื่อความเหมาะสมในการเรียนรู้และบรรพชา" },
                        { title: "ผลการเรียนสะสม (GPA)", desc: "เกรดเฉลี่ยสะสมมัธยมปลาย GPA >= 2.50 ขึ้นไป (หรือได้รับพิจารณาเป็นพิเศษจากคณะกรรมการ)" },
                        { title: "ความประพฤติและสุขภาพ", desc: "ประพฤติดี ร่างกายแข็งแรง ปราศจากโรคติดต่อร้ายแรง ปลอดสิ่งเสพติดและคดีความทางกฎหมาย" },
                        { title: "อุดมการณ์และความตั้งใจ", desc: "มีความปรารถนาที่จะพัฒนาตนเองและสืบทอดอายุพระพุทธศาสนาในระดับนานาชาติ" },
                      ].map((qual, i) => (
                        <div key={i} className="flex gap-3 items-start text-[12px] text-[#4A345E]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#B68FD6] flex-shrink-0 mt-2"></div>
                          <div>
                            <span className="font-bold">{qual.title}: </span>
                            <span className="text-[#5C4575] leading-relaxed">{qual.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {curriculumTab === "schedule" && (
            <div className="space-y-5">
              {/* Timeline Phase Status */}
              <div className="bg-[#FAF8FC] p-3.5 rounded-2xl border border-[#F0E4F8] flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-[11.5px] font-bold text-[#4A345E]">สถานะขณะนี้: กำลังรับสมัครออนไลน์ (เปิดรับประวัติ)</span>
                </div>
                <span className="text-[10.5px] text-[#8E6DA1] font-bold">อัปเดตระบบ IPS#11</span>
              </div>

              {/* Vertical Timeline */}
              <div className="relative border-l-2 border-[#E5D5F2] ml-4 pl-8 space-y-6">
                {[
                  {
                    date: "1 มิ.ย. 2569 – 31 มี.ค. 2570",
                    title: "เปิดรับสมัครออนไลน์ทั่วประเทศ",
                    desc: "กรอกใบสมัครยื่นประวัติ ผลการเรียน และทักษะพื้นฐานผ่านระบบ VME โครงการ IPS#11",
                    status: "active",
                    statusLabel: "กำลังดำเนินการ"
                  },
                  {
                    date: "เมษายน 2570",
                    title: "การสอบสัมภาษณ์เชิงลึก (In-depth Interview)",
                    desc: "สัมภาษณ์อย่างเป็นทางการโดยคณะผู้ทรงคุณวุฒิและประกาศผลคัดเลือกระดับประเทศใน 7 วันหลังสัมภาษณ์เสร็จสิ้น",
                    status: "todo",
                    statusLabel: "รอคิว"
                  },
                  {
                    date: "10 – 11 เมษายน 2570",
                    title: "วันรายงานตัวและเตรียมความพร้อมศาสนทายาท",
                    desc: "ผู้ผ่านการคัดเลือกเดินทางมารายงานตัวและเข้าคอร์สปฐมนิเทศ ณ ศูนย์พุทธศาสตร์ศึกษา DCI อ.บางบาล จ.พระนครศรีอยุธยา",
                    status: "todo",
                    statusLabel: "รอคิว"
                  },
                  {
                    date: "25 เมษายน 2570",
                    title: "พิธีบรรพชาสามเณรทุน IPS#11 ครั้งยิ่งใหญ่",
                    desc: "เข้าพิธีบรรพชาบวชเรียนเป็นศาสนทายาทร่วมกันอย่างเป็นทางการ ณ วัดพระธรรมกาย จ.ปทุมธานี",
                    status: "todo",
                    statusLabel: "รอคิว"
                  },
                  {
                    date: "10 พฤษภาคม 2570",
                    title: "เปิดภาคเรียนและสัปดาห์เตรียมความพร้อมภาษาอังกฤษ",
                    desc: "เริ่มต้นบทเรียนแรกสัปดาห์แรกของภาคเรียนการศึกษาภาษาอังกฤษ (หลักสูตร NESE G1 - G10)",
                    status: "todo",
                    statusLabel: "รอคิว"
                  },
                ].map((item, i) => (
                  <div key={i} className="relative transition-all duration-300 hover:translate-x-1">
                    {/* Circle Timeline Node */}
                    <div className={`absolute -left-[39px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow ${
                      item.status === "active" ? "bg-purple-600 ring-4 ring-purple-100" : "bg-[#B68FD6]"
                    }`}></div>
                    
                    <div className="bg-white p-4 rounded-2xl border border-[#E5D5F2] hover:border-[#B68FD6] hover:shadow-sm transition-all duration-300">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-extrabold text-[#7C3AED] bg-[#F3E8FF] px-2.5 py-1 rounded-lg border border-[#E9D5FF]">
                          {item.date}
                        </span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                          item.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {item.statusLabel}
                        </span>
                      </div>
                      <h5 className="text-[13.5px] font-extrabold text-[#4A345E]">{item.title}</h5>
                      <p className="text-[11px] text-[#8E6DA1] mt-1.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

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

      {/* PR MEDIA & INVITATIONS — dynamic */}
      {prMediaLinks.length > 0 && (
        <section>
          <SectionHeader title="ดาวน์โหลดสื่อ & หนังสือเชิญ" en="PR MEDIA & INVITATIONS" />
          <div className="mt-4 grid grid-cols-1 gap-3">
            {prMediaLinks.map((link) => {
              const isOfficial = link.badge_text?.toLowerCase().includes('official');
              const borderColor = isOfficial ? "var(--saffron-100)" : "#BBDEFB";
              const badgeColor = isOfficial ? "var(--saffron-600)" : "#1976D2";
              const bg = isOfficial
                ? "linear-gradient(140deg, #FDF1E6 0%, var(--white) 60%, #FCE3CE 100%)"
                : "linear-gradient(140deg, #E3F2FD 0%, var(--white) 60%, #F1F8FE 100%)";
              return (
                <div key={link.id} style={{ background: bg, borderRadius: "var(--r-xl)", padding: 18, border: `1px solid ${borderColor}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      {link.badge_text && (
                        <div style={{ fontFamily: "var(--font-en)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: badgeColor }}>
                          {link.badge_text}
                        </div>
                      )}
                      <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>{link.title}</div>
                      {link.description && (
                        <div style={{ fontSize: 12, color: "var(--ink-600)", marginTop: 6 }}>{link.description}</div>
                      )}
                    </div>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--white)", border: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {isOfficial ? <Icons.doc size={24} stroke={badgeColor}/> : <Icons.download size={24} stroke={badgeColor}/>}
                    </div>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-saffron inline-flex items-center gap-1.5"
                    style={{ padding: "11px 18px", fontSize: 13, ...(isOfficial ? {} : { background: "#1976D2", borderColor: "#1976D2" }) }}
                  >
                    {isOfficial ? "ดาวน์โหลดหนังสือเชิญ" : "เข้าสู่พื้นที่ดาวน์โหลด"}
                    {isOfficial ? <Icons.download size={14} sw={2}/> : <Icons.arrow size={14} sw={2}/>}
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* FEATURED DOCUMENTS — dynamic */}
      {featuredLinks.length > 0 && (
        <section>
          <SectionHeader title="คัดสรรมาเพื่อคุณ" en="FEATURED DOCUMENTS" />
          <div className="mt-4 grid grid-cols-1 gap-3">
            {featuredLinks.map((link) => (
              <div key={link.id} style={{
                background: "linear-gradient(140deg, #FDF1E6 0%, var(--white) 60%, #F0E9F1 100%)",
                borderRadius: "var(--r-xl)", padding: 18, border: "1px solid var(--saffron-100)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-en)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "var(--saffron-600)" }}>
                      {link.badge_text || "FEATURED"}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>{link.title}</div>
                    {(link.meta_info || link.description) && (
                      <div style={{ fontSize: 12, color: "var(--ink-600)", marginTop: 6 }}>
                        {link.meta_info || link.description}
                      </div>
                    )}
                  </div>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--white)", border: "1px solid var(--saffron-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icons.lotus size={24} stroke="var(--saffron-600)"/>
                  </div>
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-saffron inline-flex items-center gap-1.5"
                  style={{ padding: "11px 18px", fontSize: 13 }}
                >
                  {link.url.includes('youtube') ? "ชมวิดีโอ" : "อ่านคู่มือ"}
                  <Icons.arrow size={14} sw={2}/>
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
