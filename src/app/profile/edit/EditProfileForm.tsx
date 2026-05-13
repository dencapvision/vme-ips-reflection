'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { Icons } from '@/components/Icons'
import { createBrowserClient } from '@supabase/ssr'

export default function EditProfileForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatar_url || '')
  const [lineQrUrl, setLineQrUrl] = useState(initialData.line_qr_url || '')
  const [activityPhotos, setActivityPhotos] = useState<string[]>(initialData.activity_photos || [])
  const [uploading, setUploading] = useState(false)
  const [uploadingType, setUploadingType] = useState<'avatar' | 'line_qr' | 'activity' | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>, bucket: string, type: 'avatar' | 'line_qr' | 'activity') => {
    try {
      setUploading(true)
      setUploadingType(type)
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${initialData.id}-${Math.random()}.${fileExt}`
      const filePath = `${initialData.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
      
      if (type === 'avatar') setAvatarUrl(data.publicUrl)
      if (type === 'line_qr') setLineQrUrl(data.publicUrl)
      if (type === 'activity') {
        if (activityPhotos.length >= 5) {
          alert('อัปโหลดได้สูงสุด 5 รูปครับ')
          return
        }
        setActivityPhotos([...activityPhotos, data.publicUrl])
      }
      
    } catch (error) {
      alert('Error uploading file!')
      console.error(error)
    } finally {
      setUploading(false)
      setUploadingType(null)
    }
  }

  const removeActivityPhoto = (url: string) => {
    setActivityPhotos(activityPhotos.filter(p => p !== url))
  }

  return (
    <form action={async (formData) => {
      setLoading(true)
      try {
        formData.append('avatar_url', avatarUrl)
        formData.append('line_qr_url', lineQrUrl)
        formData.append('activity_photos', JSON.stringify(activityPhotos))
        const result = await updateProfile(formData)
        if (result?.success) {
          alert('บันทึกข้อมูลเรียบร้อยแล้วครับ')
          window.location.href = `/card/${initialData.id}`
        } else {
          alert(`Error: ${result?.error || 'ไม่สามารถบันทึกข้อมูลได้'}`)
        }
      } catch (e: any) {
        console.error('Form submission error:', e)
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์')
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
            {uploading && uploadingType === 'avatar' ? 'กำลังอัปโหลด...' : 'เปลี่ยนรูป'}
            <input type="file" accept="image/*" onChange={(e) => uploadFile(e, 'avatars', 'avatar')} style={{ display: 'none' }} disabled={uploading} />
          </label>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>ชื่อ</label>
          <input name="first_name" defaultValue={initialData.first_name} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>นามสกุล</label>
          <input name="last_name" defaultValue={initialData.last_name} required style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>สังกัดหน่วยงาน / ศูนย์ / ภาค</label>
        <input name="organization" defaultValue={initialData.organization} placeholder="เช่น ศูนย์พุทธศาสตร์ศึกษา DCI" style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle}>ที่อยู่ / สังกัดภาคไหน</label>
        <textarea name="address" defaultValue={initialData.address} placeholder="ระบุที่อยู่หรือสังกัดภาค" style={{...inputStyle, minHeight: 80, resize: 'none'}} />
      </div>

      <div>
        <label style={labelStyle}>ข้อคิด คำคม</label>
        <input name="motto" defaultValue={initialData.motto} placeholder="เช่น ทำวันนี้ให้ดีที่สุด" style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle}>คุณธรรมประจำตัว</label>
        <input name="virtue" defaultValue={initialData.virtue} placeholder="เช่น ความซื่อสัตย์" style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>เบอร์โทรศัพท์</label>
          <input name="phone" defaultValue={initialData.phone} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>LINE ID</label>
          <input name="line_id" defaultValue={initialData.line_id} style={inputStyle} />
        </div>
      </div>

      <div style={{ padding: 16, background: 'var(--ink-50)', borderRadius: 16, border: '1px solid var(--ink-100)' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--ink-900)' }}>การติดต่อ LINE</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>ลิงก์ LINE (กดแล้วแอดได้เลย)</label>
          <input name="line_url" defaultValue={initialData.line_url} placeholder="https://line.me/ti/p/..." style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>QR Code LINE</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 60, height: 60, borderRadius: 8, background: 'white', border: '1px solid var(--ink-200)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {lineQrUrl ? <img src={lineQrUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icons.plus size={20} stroke="var(--ink-300)" />}
            </div>
            <label style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--ink-200)', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
              {uploading && uploadingType === 'line_qr' ? 'กำลังอัปโหลด...' : 'อัปโหลด QR Code'}
              <input type="file" accept="image/*" onChange={(e) => uploadFile(e, 'avatars', 'line_qr')} style={{ display: 'none' }} disabled={uploading} />
            </label>
          </div>
        </div>
      </div>

      <div style={{ padding: 16, background: 'var(--ink-50)', borderRadius: 16, border: '1px solid var(--ink-100)' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--ink-900)' }}>Social Media</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Facebook URL</label>
            <input name="facebook_url" defaultValue={initialData.facebook_url} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Instagram URL</label>
            <input name="instagram_url" defaultValue={initialData.instagram_url} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>TikTok URL</label>
            <input name="tiktok_url" defaultValue={initialData.tiktok_url} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>YouTube URL</label>
            <input name="youtube_url" defaultValue={initialData.youtube_url} style={inputStyle} />
          </div>
        </div>
      </div>

      <div>
        <label style={labelStyle}>รูปภาพกิจกรรมทบทวนความดี (สูงสุด 5 รูป)</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
          {activityPhotos.map((url, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', background: 'var(--ink-100)' }}>
              <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button type="button" onClick={() => removeActivityPhoto(url)} style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 10, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>×</button>
            </div>
          ))}
          {activityPhotos.length < 5 && (
            <label style={{ aspectRatio: '1/1', borderRadius: 8, border: '2px dashed var(--ink-200)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white' }}>
              <Icons.plus size={24} stroke="var(--ink-400)" />
              <span style={{ fontSize: 10, color: 'var(--ink-400)', marginTop: 4 }}>{uploading && uploadingType === 'activity' ? '...' : 'เพิ่มรูป'}</span>
              <input type="file" accept="image/*" onChange={(e) => uploadFile(e, 'activity-photos', 'activity')} style={{ display: 'none' }} disabled={uploading} />
            </label>
          )}
        </div>
      </div>

      <div>
        <label style={labelStyle}>จังหวัด</label>
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

const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  color: "var(--ink-700)"
}

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 12,
  border: "1px solid var(--ink-200)", fontSize: 15,
  outline: "none", transition: "border-color 0.2s"
}
