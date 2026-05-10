"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "./Icons";

type TabKey = "home" | "reflect" | "community" | "plan" | "lib" | "me";

const items: Array<{ k: TabKey; label: string; href: string; Icon: (p?: any) => JSX.Element }> = [
  { k: "home",      label: "หน้าหลัก",    href: "/",           Icon: Icons.home   },
  { k: "reflect",   label: "ถอดบทเรียน",  href: "/topics",     Icon: Icons.spark  },
  { k: "community", label: "ชุมชน",       href: "/community",  Icon: Icons.users  },
  { k: "plan",      label: "แผนงาน",      href: "/strategic",  Icon: Icons.target },
  { k: "lib",       label: "คลังความรู้",  href: "/library",    Icon: Icons.book   },
  { k: "me",        label: "โปรไฟล์",     href: "/profile",    Icon: Icons.user   },
];

export function TabBar() {
  const path = usePathname() ?? "/";
  const activeKey: TabKey =
    path === "/"                          ? "home" :
    path.startsWith("/profile")           ? "me" :
    path.startsWith("/library")           ? "lib" :
    path.startsWith("/community")         ? "community" :
    path.startsWith("/strategic") ||
    path.startsWith("/smart")             ? "plan" :
    path.startsWith("/topics")  ||
    path.startsWith("/reflect") ||
    path.startsWith("/swot")    ||
    path.startsWith("/case")    ||
    path.startsWith("/journal")           ? "reflect" :
    "home";

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      maxWidth: 480, margin: "0 auto",
      paddingBottom: "calc(20px + env(safe-area-inset-bottom))", paddingTop: 8,
      background: "rgba(251,247,241,0.92)",
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
            color: on ? "var(--saffron-500)" : "var(--ink-500)",
            padding: "4px 8px", textDecoration: "none",
          }}>
            <I size={22} sw={on ? 1.9 : 1.5}/>
            <div style={{ fontSize: 10.5, fontWeight: on ? 600 : 500 }}>{label}</div>
          </Link>
        );
      })}
    </div>
  );
}
