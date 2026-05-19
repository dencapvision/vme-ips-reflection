'use client'

import React, { useState } from 'react'

const ROLES = ['member', 'leader', 'facilitator', 'admin']
const GROUPS = ['กลุ่ม 1', 'กลุ่ม 2', 'กลุ่ม 3', 'กลุ่ม 4', 'กลุ่ม 5', 'กลุ่ม 6', 'วิทยากร', 'ทีมงาน']

interface UserFormProps {
  createUserAction: (formData: FormData) => Promise<void>
}

export default function UserForm({ createUserAction }: UserFormProps) {
  const [role, setRole] = useState('member')

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 18px", borderRadius: 12,
    border: "1px solid #E5D5F2", fontSize: 16, outline: "none",
    background: "white", boxSizing: "border-box",
  }

  return (
    <div style={{ background: "white", borderRadius: 16, border: "1px solid #E5D5F2", padding: 20, marginBottom: 20 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#4A345E", marginBottom: 16, marginTop: 0 }}>เพิ่มผู้ใช้งานใหม่</h2>
      <form action={createUserAction} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        
        {/* Name Fields */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#6A5A7A" }}>ชื่อจริง *</label>
            <input name="first_name" required placeholder="กรอกชื่อจริง" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#6A5A7A" }}>นามสกุล *</label>
            <input name="last_name" required placeholder="กรอกนามสกุล" style={inputStyle} />
          </div>
        </div>

        {/* Role & Group Fields */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#6A5A7A" }}>บทบาท (Role) *</label>
            <select 
              name="role" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={inputStyle}
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Group Field (Hidden only if admin) */}
          {role !== 'admin' ? (
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4, color: "#6A5A7A" }}>กลุ่ม</label>
              <select name="group_name" style={inputStyle}>
                <option value="">— ไม่ระบุ —</option>
                {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          ) : (
            <div style={{ display: "none" }}>
              <input name="group_name" value="" readOnly />
            </div>
          )}
        </div>

        {/* Conditional Fields based on Role */}
        {role === 'admin' ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#6A5A7A" }}>อีเมลแอดมิน * (ใช้เข้าสู่ระบบ)</label>
              <input name="email" type="email" required placeholder="admin@example.com" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#6A5A7A" }}>รหัสผ่านแอดมิน * (ขั้นต่ำ 6 ตัวอักษร)</label>
              <input name="password" type="password" required minLength={6} placeholder="กรอกรหัสผ่านแอดมิน" style={inputStyle} />
            </div>
          </div>
        ) : (
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#6A5A7A" }}>เบอร์โทรศัพท์ * (ใช้เป็นรหัสผ่านเข้าใช้งาน)</label>
            <input name="phone" type="tel" required placeholder="08x-xxx-xxxx" style={inputStyle} />
          </div>
        )}

        <button type="submit" style={{
          padding: "12px", borderRadius: 12, marginTop: 4,
          background: "linear-gradient(135deg, #A67BCA 0%, #B68FD6 100%)",
          color: "white", fontWeight: 700, fontSize: 14,
          border: "none", cursor: "pointer"
        }}>
          + เพิ่มผู้ใช้งาน
        </button>
      </form>
    </div>
  )
}
