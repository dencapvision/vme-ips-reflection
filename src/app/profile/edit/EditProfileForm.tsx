'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { Icons } from '@/components/Icons'
import { createBrowserClient } from '@supabase/ssr'

export default function EditProfileForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatar_url || '')
  const [uploading, setUploading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${initialData.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
      
    } catch (error) {
      alert('Error uploading avatar!')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={async (formData) => {
      setLoading(true)
      try {
        formData.append('avatar_url', avatarUrl)
        await updateProfile(formData)
        alert('บันทึกข้อมูลเรียบร้อย')
      } catch (e) {
        alert('เกิดข้อผิดพลาดในการบันทึก')
      } finally {
        setLoading(false)
      }
    }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 40, background: "var(--saffron-100)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 12px", overflow: "hidden", border: "2px solid var(--saffron-200)",
          position: "relative"
        }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Icons.user size={32} stroke="var(--saffron-600)"/>
          )}
          <label style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)',
            color: 'white', fontSize: 10, padding: '4px 0', cursor: 'pointer', textAlign: 'center'
          }}>
            {uploading ? 'กำลังอัปโหลด...' : 'เปลี่ยนรูป'}
            <input type="file" accept="image/*" onChange={uploadAvatar} style={{ display: 'none' }} disabled={uploading} />
          </label>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-700)" }}>ชื่อ</label>
          <input name="first_name" defaultValue={initialData.first_name} required style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-700)" }}>นามสกุล</label>
          <input name="last_name" defaultValue={initialData.last_name} required style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-700)" }}>ข้อคิด คำคม</label>
        <input name="motto" defaultValue={initialData.motto} placeholder="เช่น ทำวันนี้ให้ดีที่สุด" style={inputStyle} />
      </div>

      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-700)" }}>คุณธรรมประจำตัว</label>
        <input name="virtue" defaultValue={initialData.virtue} placeholder="เช่น ความซื่อสัตย์" style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-700)" }}>เบอร์โทรศัพท์</label>
          <input name="phone" defaultValue={initialData.phone} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-700)" }}>LINE ID</label>
          <input name="line_id" defaultValue={initialData.line_id} style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-700)" }}>จังหวัด</label>
        <input name="province" defaultValue={initialData.province} style={inputStyle} />
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: "var(--ink-700)", fontWeight: 500, marginTop: 8 }}>
        <input type="checkbox" name="is_public" defaultChecked={initialData.is_public} />
        เปิดเป็นสาธารณะ (นามบัตรดิจิทัล)
      </label>

      <button type="submit" disabled={loading || uploading} style={{
        width: "100%", padding: "14px", borderRadius: 12, marginTop: 16,
        background: "var(--saffron-600)", color: "white", fontWeight: 600,
        fontSize: 15, border: "none", cursor: (loading || uploading) ? "not-allowed" : "pointer",
        opacity: (loading || uploading) ? 0.7 : 1,
        boxShadow: "0 4px 12px rgba(234, 88, 12, 0.2)"
      }}>
        {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
      </button>
    </form>
  )
}

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 12,
  border: "1px solid var(--ink-200)", fontSize: 15,
  outline: "none", transition: "border-color 0.2s"
}
