"use client";

import React, { useState, useEffect } from "react";
import { Icons } from "./Icons";

export function CopyCardLink({ cardId }: { cardId: string }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(`${window.location.origin}/card/${cardId}`);
  }, [cardId]);

  const copyToClipboard = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        background: "var(--ink-100)",
        borderRadius: "12px",
        border: "1px solid var(--ink-200)",
        fontSize: "12px",
        color: "var(--ink-600)",
      }}>
        <div style={{ 
          flex: 1, 
          overflow: "hidden", 
          textOverflow: "ellipsis", 
          whiteSpace: "nowrap",
          fontFamily: "var(--font-en)"
        }}>
          {shareUrl || "Loading..."}
        </div>
        <button
          onClick={copyToClipboard}
          style={{
            background: copied ? "#4F7A4D" : "var(--saffron-500)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.2s ease",
            fontSize: "11px",
            whiteSpace: "nowrap"
          }}
        >
          {copied ? (
            <>
              <Icons.check size={14} stroke="white" />
              ก๊อปปี้แล้ว
            </>
          ) : (
            <>
              <Icons.link size={14} stroke="white" />
              ก๊อปปี้ลิงก์
            </>
          )}
        </button>
      </div>
    </div>
  );
}
