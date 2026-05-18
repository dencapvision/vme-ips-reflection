'use client'
import { useState, useEffect } from 'react'
import { Icons } from '../../../components/Icons'

type LibraryLink = {
  id: string
  title: string
  url: string
  category: string
  description?: string
  section: string
  badge_text?: string
  meta_info?: string
  sort_order: number
  created_at: string
}

type LibraryVideo = {
  id: string
  title: string
  url: string
  playlist_name: string
  thumbnail_url?: string
  description?: string
  created_at: string
}

const SECTION_OPTIONS = [
  { value: 'pr-media', label: 'PR Media & Invitations', desc: 'สื่อประชาสัมพันธ์ / หนังสือเชิญ' },
  { value: 'featured', label: 'Featured Documents', desc: 'เอกสารเด่น / คู่มือ' },
  { value: 'resource', label: 'Resources & Drive', desc: 'คลังลิงค์ทั่วไป' },
]

const BADGE_OPTIONS = ['DOWNLOAD', 'OFFICIAL', 'FEATURED', 'NEW', 'ALBUM', 'TRAINING', '']

export default function AdminLibraryPage() {
  const [tab, setTab] = useState<'links' | 'videos'>('links')
  const [links, setLinks] = useState<LibraryLink[]>([])
  const [videos, setVideos] = useState<LibraryVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Link form
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('ทั่วไป')
  const [description, setDescription] = useState('')
  const [section, setSection] = useState('resource')
  const [badgeText, setBadgeText] = useState('')
  const [metaInfo, setMetaInfo] = useState('')
  const [sortOrder, setSortOrder] = useState(0)

  // Video form
  const [vTitle, setVTitle] = useState('')
  const [vUrl, setVUrl] = useState('')
  const [vPlaylist, setVPlaylist] = useState('บรรยากาศชวนบวชเรียน')
  const [vDesc, setVDesc] = useState('')

  useEffect(() => { fetchAll() }, [])

  function normalizeUrl(value: string) {
    return value.trim().replace(/^https\/\//i, 'https://').replace(/^http\/\//i, 'http://')
  }

  async function fetchAll() {
    setLoading(true)
    try {
      const [lr, vr] = await Promise.all([
        fetch('/api/library/links'),
        fetch('/api/library/videos'),
      ])
      const ld = await lr.json()
      const vd = await vr.json()
      setLinks(ld.links || [])
      setVideos(vd.videos || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function addLink(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !url) return
    setSaving(true)
    try {
      const res = await fetch('/api/library/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url: normalizeUrl(url), category, description, section, badge_text: badgeText, meta_info: metaInfo, sort_order: sortOrder }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'บันทึกเอกสารไม่สำเร็จ')
      setTitle(''); setUrl(''); setCategory('ทั่วไป'); setDescription('')
      setSection('resource'); setBadgeText(''); setMetaInfo(''); setSortOrder(0)
      await fetchAll()
    } catch (err: any) {
      alert(err.message || 'บันทึกเอกสารไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  async function deleteLink(id: string) {
    if (!confirm('ลบรายการนี้?')) return
    await fetch('/api/library/links', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await fetchAll()
  }

  async function addVideo(e: React.FormEvent) {
    e.preventDefault()
    if (!vTitle || !vUrl) return
    setSaving(true)
    try {
      const res = await fetch('/api/library/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: vTitle, url: normalizeUrl(vUrl), playlist_name: vPlaylist, description: vDesc }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'บันทึกวิดีโอไม่สำเร็จ')
      setVTitle(''); setVUrl(''); setVPlaylist('บรรยากาศชวนบวชเรียน'); setVDesc('')
      await fetchAll()
    } catch (err: any) {
      alert(err.message || 'บันทึกวิดีโอไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  async function deleteVideo(id: string) {
    if (!confirm('ลบวิดีโอนี้?')) return
    await fetch('/api/library/videos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await fetchAll()
  }

  const sectionLabel = (s: string) => SECTION_OPTIONS.find(o => o.value === s)?.label || s

  return (
    <div className="min-h-screen bg-[#FAF7FC] p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-[#B68FD6] flex items-center justify-center">
          <Icons.download size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#4A345E]">จัดการคลังดาวน์โหลด</h1>
          <p className="text-xs text-[#8E6DA1]">Library Downloads Admin</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 bg-[#F0E4F8] p-1 rounded-2xl">
        <button
          onClick={() => setTab('links')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'links' ? 'bg-white text-[#8E6DA1] shadow-sm' : 'text-[#8E6DA1]/70'}`}
        >
          เอกสาร & ลิงค์
        </button>
        <button
          onClick={() => setTab('videos')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'videos' ? 'bg-white text-[#8E6DA1] shadow-sm' : 'text-[#8E6DA1]/70'}`}
        >
          วิดีโอ YouTube
        </button>
      </div>

      {tab === 'links' && (
        <div className="space-y-5">
          {/* Add Link Form */}
          <form onSubmit={addLink} className="bg-white rounded-2xl border border-[#E5D5F2] p-5 space-y-4">
            <h2 className="text-sm font-bold text-[#4A345E]">เพิ่มเอกสาร / ลิงค์ใหม่</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-bold text-[#8E6DA1] mb-1 block">ชื่อเอกสาร *</label>
                <input
                  value={title} onChange={e => setTitle(e.target.value)} required
                  placeholder="เช่น หนังสือเชิญร่วมโครงการ IPS#11"
                  className="w-full border border-[#E5D5F2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#B68FD6]"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-[#8E6DA1] mb-1 block">URL (Google Drive / YouTube / อื่นๆ) *</label>
                <input
                  value={url} onChange={e => setUrl(e.target.value)} required type="url"
                  placeholder="https://drive.google.com/..."
                  className="w-full border border-[#E5D5F2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#B68FD6]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#8E6DA1] mb-1 block">Section (แสดงใน)</label>
                <select
                  value={section} onChange={e => setSection(e.target.value)}
                  className="w-full border border-[#E5D5F2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#B68FD6]"
                >
                  {SECTION_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#8E6DA1] mb-1 block">Badge</label>
                <select
                  value={badgeText} onChange={e => setBadgeText(e.target.value)}
                  className="w-full border border-[#E5D5F2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#B68FD6]"
                >
                  {BADGE_OPTIONS.map(b => (
                    <option key={b} value={b}>{b || '(ไม่มี badge)'}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-[#8E6DA1] mb-1 block">คำอธิบาย (description)</label>
                <input
                  value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="เช่น โปสเตอร์, วิดีโอแนะนำ, และคอนเทนต์โซเชียล"
                  className="w-full border border-[#E5D5F2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#B68FD6]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#8E6DA1] mb-1 block">Meta Info (สำหรับ Featured)</label>
                <input
                  value={metaInfo} onChange={e => setMetaInfo(e.target.value)}
                  placeholder="26 หน้า · 4 วิดีโอ · อัปเดต พ.ค. 2569"
                  className="w-full border border-[#E5D5F2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#B68FD6]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#8E6DA1] mb-1 block">ลำดับ (sort_order)</label>
                <input
                  value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} type="number"
                  className="w-full border border-[#E5D5F2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#B68FD6]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#8E6DA1] mb-1 block">หมวดหมู่ (category)</label>
                <input
                  value={category} onChange={e => setCategory(e.target.value)}
                  placeholder="ทั่วไป"
                  className="w-full border border-[#E5D5F2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#B68FD6]"
                />
              </div>
            </div>

            <button
              type="submit" disabled={saving}
              className="w-full bg-[#B68FD6] text-white rounded-xl py-2.5 text-sm font-bold hover:bg-[#9B7BB6] transition-colors disabled:opacity-50"
            >
              {saving ? 'กำลังบันทึก...' : '+ เพิ่มเอกสาร'}
            </button>
          </form>

          {/* Links List */}
          {loading ? (
            <div className="text-center text-sm text-[#8E6DA1] py-8">กำลังโหลด...</div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#8E6DA1] uppercase tracking-wider">รายการทั้งหมด ({links.length})</p>
              {links.map(link => (
                <div key={link.id} className="bg-white rounded-2xl border border-[#E5D5F2] p-3.5 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      {link.badge_text && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-[#EDE9FE] text-[#7C3AED] rounded-md">{link.badge_text}</span>
                      )}
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#F0E4F8] text-[#8E6DA1] rounded-md">{sectionLabel(link.section)}</span>
                    </div>
                    <p className="text-sm font-bold text-[#4A345E] truncate">{link.title}</p>
                    {link.description && <p className="text-xs text-[#8E6DA1] truncate">{link.description}</p>}
                    {link.meta_info && <p className="text-[10px] text-[#B68FD6] mt-0.5">{link.meta_info}</p>}
                    <p className="text-[10px] text-[#8E6DA1]/60 mt-0.5 truncate">{link.url}</p>
                  </div>
                  <button
                    onClick={() => deleteLink(link.id)}
                    className="w-8 h-8 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center flex-shrink-0 transition-colors text-base"
                  >
                    🗑
                  </button>
                </div>
              ))}
              {links.length === 0 && (
                <div className="text-center text-sm text-[#8E6DA1]/60 py-6 border border-dashed border-[#E5D5F2] rounded-2xl">
                  ยังไม่มีเอกสาร — เพิ่มด้านบน
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'videos' && (
        <div className="space-y-5">
          {/* Add Video Form */}
          <form onSubmit={addVideo} className="bg-white rounded-2xl border border-[#E5D5F2] p-5 space-y-4">
            <h2 className="text-sm font-bold text-[#4A345E]">เพิ่มวิดีโอ YouTube</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#8E6DA1] mb-1 block">ชื่อวิดีโอ *</label>
                <input
                  value={vTitle} onChange={e => setVTitle(e.target.value)} required
                  placeholder="เช่น บรรยากาศชวนบวชเรียน IPS#10"
                  className="w-full border border-[#E5D5F2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#B68FD6]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#8E6DA1] mb-1 block">URL YouTube *</label>
                <input
                  value={vUrl} onChange={e => setVUrl(e.target.value)} required type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full border border-[#E5D5F2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#B68FD6]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#8E6DA1] mb-1 block">Playlist / หมวด</label>
                <input
                  value={vPlaylist} onChange={e => setVPlaylist(e.target.value)}
                  placeholder="บรรยากาศชวนบวชเรียน"
                  className="w-full border border-[#E5D5F2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#B68FD6]"
                />
                <p className="text-[10px] text-[#8E6DA1]/70 mt-1">
                  ตัวอย่าง: บรรยากาศชวนบวชเรียน / ภาพศิษย์เก่า IPS#10 / วิดีโอแนะนำโครงการ
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-[#8E6DA1] mb-1 block">คำอธิบาย</label>
                <input
                  value={vDesc} onChange={e => setVDesc(e.target.value)}
                  placeholder="คำอธิบายสั้นๆ"
                  className="w-full border border-[#E5D5F2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#B68FD6]"
                />
              </div>
            </div>
            <button
              type="submit" disabled={saving}
              className="w-full bg-[#B68FD6] text-white rounded-xl py-2.5 text-sm font-bold hover:bg-[#9B7BB6] transition-colors disabled:opacity-50"
            >
              {saving ? 'กำลังบันทึก...' : '+ เพิ่มวิดีโอ'}
            </button>
          </form>

          {/* Videos List */}
          {loading ? (
            <div className="text-center text-sm text-[#8E6DA1] py-8">กำลังโหลด...</div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#8E6DA1] uppercase tracking-wider">วิดีโอทั้งหมด ({videos.length})</p>
              {videos.map(video => (
                <div key={video.id} className="bg-white rounded-2xl border border-[#E5D5F2] p-3.5 flex items-center gap-3">
                  {video.thumbnail_url && (
                    <img src={video.thumbnail_url} alt="" className="w-16 h-10 rounded-lg object-cover flex-shrink-0 border border-[#E5D5F2]" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#4A345E] truncate">{video.title}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#F0E4F8] text-[#8E6DA1] rounded-md">{video.playlist_name}</span>
                  </div>
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="w-8 h-8 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center flex-shrink-0 transition-colors text-base"
                  >
                    🗑
                  </button>
                </div>
              ))}
              {videos.length === 0 && (
                <div className="text-center text-sm text-[#8E6DA1]/60 py-6 border border-dashed border-[#E5D5F2] rounded-2xl">
                  ยังไม่มีวิดีโอ — เพิ่มด้านบน
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
