'use client'

import { useState } from 'react'
import { Icons } from './Icons'

export function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      // 1. Call API to clear cookies & Supabase session on the server
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      // 2. Clear any client-side states & storage
      localStorage.clear()
      sessionStorage.clear()

      // 3. Redirect to login and replace the history to prevent back-button looping
      window.location.replace('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback redirect even if fetch fails to keep UX solid
      window.location.replace('/login')
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      type="button"
      style={{
        width: "100%",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "none",
        border: "none",
        cursor: isLoggingOut ? "not-allowed" : "pointer",
        textAlign: "left",
        color: "#b91c1c",
        opacity: isLoggingOut ? 0.75 : 1,
        transition: "all 0.2s ease",
      }}
      className="active:bg-red-50/80 hover:bg-red-50/50 rounded-b-2xl"
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#fee2e2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {isLoggingOut ? (
          <span 
            className="w-4.5 h-4.5 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"
            style={{ 
              display: 'inline-block',
              width: '16px',
              height: '16px',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
        ) : (
          <Icons.logout size={16} stroke="#b91c1c" />
        )}
      </div>
      <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>
        {isLoggingOut ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
      </div>
    </button>
  )
}
