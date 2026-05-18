import * as React from "react";
import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/profile";
import { getArrActivities, getArrApplicants, getArrSummaryStats } from "@/app/actions/arr";
import { TopHeaderBack } from "@/components/AppHeader";
import ArrClient from "@/components/ArrClient";

export const dynamic = 'force-dynamic';

export default async function ArrPage() {
  const profile = await getProfile();
  
  // ตรวจสอบสิทธิ์ผู้ใช้งาน หากไม่ได้ล็อกอินให้นำทางไปที่หน้าแรก / เพื่อความปลอดภัย
  if (!profile) {
    redirect('/');
  }

  // เรียกข้อมูลทั้งหมดในฝั่งเซิร์ฟเวอร์แบบขนานเพื่อประสิทธิภาพที่ดีที่สุด (Parallel Data Fetching)
  const [activities, applicants, stats] = await Promise.all([
    getArrActivities(),
    getArrApplicants(),
    getArrSummaryStats()
  ]);

  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <TopHeaderBack title="ARR & ติดตามผู้สมัครโครงการ IPS" />
      </div>

      <ArrClient 
        initialActivities={activities} 
        initialApplicants={applicants} 
        initialStats={stats} 
        userProfile={profile} 
      />
    </>
  );
}
