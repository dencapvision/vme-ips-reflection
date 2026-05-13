"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "./Icons";

type TabKey = "home" | "plan" | "reflect" | "kaewsai" | "me";

const items: Array<{ k: TabKey; label: string; href: string; Icon: (p?: any) => React.ReactElement }> = [
  { k: "home",    label: "หน้าหลัก",    href: "/",           Icon: Icons.home   },
  { k: "plan",    label: "แผนงาน",      href: "/smart",      Icon: Icons.target },
  { k: "reflect", label: "ถอดบทเรียน",  href: "/reflect",    Icon: Icons.spark  },
  { k: "kaewsai", label: "น้องแก้วใส",  href: "/kaewsai",    Icon: Icons.ai     },
  { k: "me",      label: "โปรไฟล์",     href: "/profile",    Icon: Icons.user   },
];

export function TabBar() {
  const path = usePathname() ?? "/";
  const activeKey: TabKey =
    path === "/"                          ? "home" :
    path.startsWith("/profile")           ? "me" :
    path.startsWith("/kaewsai")           ? "kaewsai" :
    path.startsWith("/smart") ||
    path.startsWith("/swot")              ? "plan" :
    path.startsWith("/reflect")           ? "reflect" :
    "home";

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      maxWidth: 480, margin: "0 auto",
      paddingBottom: "calc(20px + env(safe-area-inset-bottom))", paddingTop: 8,
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(14px) saturate(180%)",
      WebkitBackdropFilter: "blur(14px) saturate(180%)",
      borderTop: "1px solid var(--ink-200)",
      display: "flex", justifyContent: "space-around", alignItems: "flex-start",
      zIndex: 50,
    }}>
      {items.map(({ k, label, href, Icon: I }) => {
        const on = k === activeKey;
        return (
          <Link key={k} href={href} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: on ? "var(--saffron-600)" : "var(--ink-500)",
            padding: "4px 8px", textDecoration: "none",
            transition: "all 0.2s ease"
          }}>
            <I size={22} sw={on ? 2 : 1.5} stroke={on ? "var(--saffron-600)" : "var(--ink-400)"}/>
            <div style={{ fontSize: 10, fontWeight: on ? 700 : 500, letterSpacing: "-0.01em" }}>{label}</div>
          </Link>
        );
      })}
    </div>
  );
}
