"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icons } from "./Icons";

export function AppHeader({
  title, subtitle, leading, trailing, large = false,
}: {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  large?: boolean;
}) {
  return (
    <div style={{
      padding: large ? "12px 22px 8px" : "14px 20px",
      display: "flex", alignItems: "center", gap: 14,
    }}>
      {leading && <div style={{ flex: "0 0 auto" }}>{leading}</div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        {subtitle && (
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "var(--saffron-600)",
            fontFamily: "var(--font-en)", marginBottom: 3,
          }}>{subtitle}</div>
        )}
        <div style={{
          fontSize: large ? 26 : 19, fontWeight: 600, lineHeight: 1.2,
          color: "var(--ink-900)",
        }}>{title}</div>
      </div>
      {trailing && <div style={{ flex: "0 0 auto", display: "flex", gap: 8 }}>{trailing}</div>}
    </div>
  );
}

export function TopHeaderBack({ title, href }: { title: string; href?: string }) {
  const router = useRouter();
  const Btn = (
    <button
      onClick={() => (href ? null : router.back())}
      style={{
        width: 36, height: 36, borderRadius: 18,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: "var(--ink-100)", color: "var(--ink-700)",
      }}
    >
      <Icons.back size={20}/>
    </button>
  );
  return (
    <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      {href ? <Link href={href}>{Btn}</Link> : Btn}
      <div style={{ flex: 1, fontSize: 16, fontWeight: 600, textAlign: "center", paddingRight: 36 }}>{title}</div>
    </div>
  );
}
