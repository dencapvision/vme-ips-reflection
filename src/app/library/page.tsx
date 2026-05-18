import React from "react";
import { Icons } from "@/components/Icons";
import { AppHeader } from "@/components/AppHeader";
import { Chip, SectionHeader } from "@/components/UI";
import { TabBar } from "@/components/TabBar";
import LibraryAI from "@/components/LibraryAI";
import LibraryContent from "./LibraryContent";

export default function LibraryPage() {
  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <AppHeader large title="คลังความรู้" subtitle="LIBRARY"
          trailing={<button style={{ width: 38, height: 38, borderRadius: 19, background: "var(--white)", border: "1px solid var(--ink-200)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icons.search size={18} stroke="var(--ink-700)"/>
          </button>}/>
      </div>

      <div style={{ padding: "4px 22px 30px" }}>
        <div id="ai-chat-section" style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
                <SectionHeader title="ถามน้องแก้วใส AI" en="SMART KNOWLEDGE SEARCH" />
            </div>
            <React.Suspense fallback={<div>กำลังโหลดผู้ช่วย AI...</div>}>
                <LibraryAI />
            </React.Suspense>
        </div>

        <React.Suspense fallback={<div className="animate-pulse h-96 bg-gray-50 rounded-3xl" />}>
          <LibraryContent />
        </React.Suspense>
      </div>

      <TabBar/>
    </>
  );
}
