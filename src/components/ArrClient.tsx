'use client'

import React, { useState, useTransition, useMemo } from 'react'
import { Icons } from '@/components/Icons'
import { Chip, ProgressBar, NumPill } from '@/components/UI'
import { 
  ArrActivity, 
  ArrApplicant, 
  CareJournalEntry,
  saveArrActivity, 
  deleteArrActivity, 
  saveArrApplicant, 
  deleteArrApplicant, 
  addCareJournalEntry 
} from '@/app/actions/arr'

interface ArrClientProps {
  initialActivities: ArrActivity[]
  initialApplicants: ArrApplicant[]
  initialStats: any
  userProfile: any
}

// รายชื่อพื้นที่/ภูมิภาคมาตรฐานสำหรับจับคู่พื้นที่
const PRESETS_AREAS = [
  'กรุงเทพฯ และปริมณฑล',
  'ภาคเหนือ',
  'ภาคอีสาน',
  'ภาคใต้',
  'ภาคกลาง',
  'ภาคตะวันออก',
  'ภาคตะวันตก'
]

export default function ArrClient({ 
  initialActivities, 
  initialApplicants, 
  initialStats,
  userProfile 
}: ArrClientProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'arr' | 'applicants'>('dashboard')
  
  // Data States
  const [activities, setActivities] = useState<ArrActivity[]>(initialActivities)
  const [applicants, setApplicants] = useState<ArrApplicant[]>(initialApplicants)
  const [stats, setStats] = useState(initialStats)

  // Pending State
  const [isPending, startTransition] = useTransition()

  // --- Search & Filter States for Applicants ---
  const [searchQuery, setSearchQuery] = useState('')
  const [areaFilter, setAreaFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // --- Form Modal / Collapse States ---
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState<ArrActivity | null>(null)
  
  const [showApplicantForm, setShowApplicantForm] = useState(false)
  const [editingApplicant, setEditingApplicant] = useState<ArrApplicant | null>(null)

  // Active Care Journal Applicant ID
  const [activeJournalApplicant, setActiveJournalApplicant] = useState<ArrApplicant | null>(null)
  const [journalNote, setJournalNote] = useState('')

  // Form Fields - Activity
  const [actTitle, setActTitle] = useState('')
  const [actDate, setActDate] = useState(new Date().toISOString().substring(0, 10))
  const [actSpeaker, setActSpeaker] = useState('')
  const [actAttendees, setActAttendees] = useState(0)
  const [actInterested, setActInterested] = useState(0)
  const [actL1, setActL1] = useState(0)
  const [actL2, setActL2] = useState(0)
  const [actL3, setActL3] = useState(0)
  const [actNotes, setActNotes] = useState('')

  // Form Fields - Applicant
  const [appFirstName, setAppFirstName] = useState('')
  const [appLastName, setAppLastName] = useState('')
  const [appNickname, setAppNickname] = useState('')
  const [appPhone, setAppPhone] = useState('')
  const [appArea, setAppArea] = useState(PRESETS_AREAS[0])
  const [appLevel, setAppLevel] = useState<'level1' | 'level2' | 'level3'>('level1')
  const [appStatus, setAppStatus] = useState<ArrApplicant['status']>('presentation')
  const [appInterviewDate, setAppInterviewDate] = useState('')

  // --- Notification Message ---
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text })
    setTimeout(() => setFeedbackMsg(null), 4000)
  }

  // --- Functions ---
  
  // โหลดสถิติใหม่เมื่อมีการเปลี่ยนแปลงข้อมูล
  const refreshStats = (currentActivities: ArrActivity[], currentApplicants: ArrApplicant[]) => {
    let totalPresentationListeners = 0
    let totalInterested = 0
    let totalLevel1 = 0
    let totalLevel2 = 0
    let totalLevel3 = 0

    currentActivities.forEach(act => {
      totalPresentationListeners += Number(act.attendeesCount || 0)
      totalInterested += Number(act.interestedCount || 0)
      totalLevel1 += Number(act.applications?.level1 || 0)
      totalLevel2 += Number(act.applications?.level2 || 0)
      totalLevel3 += Number(act.applications?.level3 || 0)
    })

    let actualLevel1 = 0
    let actualLevel2 = 0
    let actualLevel3 = 0
    
    currentApplicants.forEach(app => {
      if (app.level === 'level1') actualLevel1++
      else if (app.level === 'level2') actualLevel2++
      else if (app.level === 'level3') actualLevel3++
    })

    const areaStatsMap: Record<string, { interested: number, applied: number, total: number }> = {}
    currentApplicants.forEach(app => {
      const area = app.area || 'ไม่ระบุพื้นที่'
      if (!areaStatsMap[area]) {
        areaStatsMap[area] = { interested: 0, applied: 0, total: 0 }
      }
      areaStatsMap[area].total++
      if (app.status === 'presentation' || app.status === 'interested') {
        areaStatsMap[area].interested++
      } else {
        areaStatsMap[area].applied++
      }
    })

    const regionalStats = Object.keys(areaStatsMap).map(area => ({
      area,
      interested: areaStatsMap[area].interested,
      applied: areaStatsMap[area].applied,
      total: areaStatsMap[area].total
    })).sort((a, b) => b.total - a.total)

    const interviewTimeline = currentApplicants
      .filter(app => app.interviewDate)
      .map(app => ({
        id: app.id,
        name: `${app.firstName} ${app.lastName}`.trim() + (app.nickname ? ` (${app.nickname})` : ''),
        nickname: app.nickname,
        area: app.area,
        level: app.level,
        status: app.status,
        interviewDate: app.interviewDate!,
      }))
      .sort((a, b) => new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime())

    setStats({
      activitiesCount: currentActivities.length,
      overall: {
        totalListeners: totalPresentationListeners,
        totalInterested: totalInterested,
        totalLevel1: totalLevel1 || actualLevel1,
        totalLevel2: totalLevel2 || actualLevel2,
        totalLevel3: totalLevel3 || actualLevel3,
        totalApplications: (totalLevel1 + totalLevel2 + totalLevel3) || currentApplicants.length,
        actualApplicants: currentApplicants.length
      },
      regionalStats,
      interviewTimeline
    })
  }

  // เคลียร์ค่าฟอร์มกิจกรรม
  const resetActivityForm = () => {
    setEditingActivity(null)
    setActTitle('')
    setActDate(new Date().toISOString().substring(0, 10))
    setActSpeaker('')
    setActAttendees(0)
    setActInterested(0)
    setActL1(0)
    setActL2(0)
    setActL3(0)
    setActNotes('')
  }

  // เคลียร์ค่าฟอร์มผู้สมัคร
  const resetApplicantForm = () => {
    setEditingApplicant(null)
    setAppFirstName('')
    setAppLastName('')
    setAppNickname('')
    setAppPhone('')
    setAppArea(PRESETS_AREAS[0])
    setAppLevel('level1')
    setAppStatus('presentation')
    setAppInterviewDate('')
  }

  // จัดการฟอร์มบันทึกกิจกรรม ARR
  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!actTitle.trim()) {
      showFeedback('กรุณากรอกหัวข้อกิจกรรม', 'error')
      return
    }

    const activityData = {
      id: editingActivity?.id || Math.random().toString(36).substring(2, 11),
      title: actTitle,
      date: actDate,
      speaker: actSpeaker || 'ไม่ระบุผู้บรรยาย',
      attendeesCount: Number(actAttendees),
      interestedCount: Number(actInterested),
      applications: {
        level1: Number(actL1),
        level2: Number(actL2),
        level3: Number(actL3),
      },
      notes: actNotes
    }

    startTransition(async () => {
      const res = await saveArrActivity(activityData)
      if (res.error) {
        showFeedback(res.error, 'error')
      } else if (res.activities) {
        setActivities(res.activities)
        refreshStats(res.activities, applicants)
        showFeedback(editingActivity ? 'อัปเดตกิจกรรม ARR สำเร็จแล้วค่ะ' : 'บันทึกกิจกรรม ARR ใหม่เรียบร้อยแล้วค่ะ')
        setShowActivityForm(false)
        resetActivityForm()
      }
    })
  }

  // เริ่มแก้ไขกิจกรรม ARR
  const handleEditActivity = (act: ArrActivity) => {
    setEditingActivity(act)
    setActTitle(act.title)
    setActDate(act.date)
    setActSpeaker(act.speaker)
    setActAttendees(act.attendeesCount)
    setActInterested(act.interestedCount)
    setActL1(act.applications.level1)
    setActL2(act.applications.level2)
    setActL3(act.applications.level3)
    setActNotes(act.notes || '')
    setShowActivityForm(true)
  }

  // ลบกิจกรรม ARR
  const handleDeleteActivity = async (id: string) => {
    if (!confirm('คุณครูแน่ใจใช่ไหมคะว่าต้องการลบกิจกรรม ARR รายการนี้?')) return

    startTransition(async () => {
      const res = await deleteArrActivity(id)
      if (res.error) {
        showFeedback(res.error, 'error')
      } else {
        const nextActs = activities.filter(a => a.id !== id)
        setActivities(nextActs)
        refreshStats(nextActs, applicants)
        showFeedback('ลบกิจกรรมสำเร็จแล้วค่ะ')
      }
    })
  }

  // จัดการฟอร์มบันทึกผู้สมัคร
  const handleSaveApplicant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appFirstName.trim() || !appLastName.trim()) {
      showFeedback('กรุณากรอกชื่อและนามสกุลผู้สมัคร', 'error')
      return
    }

    const applicantData = {
      id: editingApplicant?.id || Math.random().toString(36).substring(2, 11),
      firstName: appFirstName,
      lastName: appLastName,
      nickname: appNickname,
      phone: appPhone,
      area: appArea,
      level: appLevel,
      status: appStatus,
      interviewDate: appInterviewDate || undefined,
      careJournal: editingApplicant?.careJournal || []
    }

    startTransition(async () => {
      const res = await saveArrApplicant(applicantData)
      if (res.error) {
        showFeedback(res.error, 'error')
      } else if (res.applicants) {
        setApplicants(res.applicants)
        refreshStats(activities, res.applicants)
        showFeedback(editingApplicant ? 'อัปเดตข้อมูลผู้สมัครสำเร็จแล้วค่ะ' : 'เพิ่มผู้สมัครรายใหม่เรียบร้อยแล้วค่ะ')
        setShowApplicantForm(false)
        resetApplicantForm()
      }
    })
  }

  // เริ่มแก้ไขข้อมูลผู้สมัคร
  const handleEditApplicant = (app: ArrApplicant) => {
    setEditingApplicant(app)
    setAppFirstName(app.firstName)
    setAppLastName(app.lastName)
    setAppNickname(app.nickname)
    setAppPhone(app.phone)
    setAppArea(app.area)
    setAppLevel(app.level)
    setAppStatus(app.status)
    setAppInterviewDate(app.interviewDate || '')
    setShowApplicantForm(true)
  }

  // ลบผู้สมัคร
  const handleDeleteApplicant = async (id: string) => {
    if (!confirm('แน่ใจใช่ไหมคะว่าต้องการลบรายชื่อผู้สมัครท่านนี้ออกจากระบบ? ข้อมูลการติดตามทั้งหมดจะหายไป')) return

    startTransition(async () => {
      const res = await deleteArrApplicant(id)
      if (res.error) {
        showFeedback(res.error, 'error')
      } else {
        const nextApps = applicants.filter(a => a.id !== id)
        setApplicants(nextApps)
        refreshStats(activities, nextApps)
        showFeedback('ลบข้อมูลผู้สมัครสำเร็จแล้วค่ะ')
      }
    })
  }

  // เพิ่มบันทึกใน Care Journal
  const handleAddJournalNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!journalNote.trim() || !activeJournalApplicant) return

    startTransition(async () => {
      const res = await addCareJournalEntry(activeJournalApplicant.id, journalNote)
      if (res.error) {
        showFeedback(res.error, 'error')
      } else if (res.careJournal) {
        // อัปเดตข้อมูลผู้สมัครใน Local state
        const updatedApps = applicants.map(a => 
          a.id === activeJournalApplicant.id 
            ? { ...a, careJournal: res.careJournal! } 
            : a
        )
        setApplicants(updatedApps)
        
        // อัปเดต activeJournalApplicant เพื่อรีเฟรชหน้าจอ Care Journal
        const activeApp = updatedApps.find(a => a.id === activeJournalApplicant.id)
        if (activeApp) setActiveJournalApplicant(activeApp)

        setJournalNote('')
        showFeedback('บันทึกการดูแลกัลยาณมิตรใหม่สำเร็จแล้วค่ะ')
      }
    })
  }

  // --- Filtering Applicants ---
  const filteredApplicants = useMemo(() => {
    return applicants.filter(app => {
      const matchQuery = 
        `${app.firstName} ${app.lastName} ${app.nickname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.phone.includes(searchQuery)
      
      const matchArea = areaFilter === 'all' || app.area === areaFilter
      const matchLevel = levelFilter === 'all' || app.level === levelFilter
      const matchStatus = statusFilter === 'all' || app.status === statusFilter

      return matchQuery && matchArea && matchLevel && matchStatus
    })
  }, [applicants, searchQuery, areaFilter, levelFilter, statusFilter])

  // รายละเอียดการแปลสถานะภาษาไทย
  const getStatusLabel = (status: ArrApplicant['status']) => {
    const map: Record<ArrApplicant['status'], { label: string, color: string }> = {
      presentation: { label: 'ฟังนำเสนอแล้ว', color: '#B5D3E7' },
      interested: { label: 'สนใจสมัคร', color: '#FCD34D' },
      applied: { label: 'ส่งใบสมัครแล้ว', color: '#86EFAC' },
      scheduled: { label: 'นัดสัมภาษณ์แล้ว', color: '#C084FC' },
      interviewed: { label: 'สัมภาษณ์แล้ว', color: '#60A5FA' },
      accepted: { label: 'ผ่านการคัดเลือก', color: '#4ADE80' },
      rejected: { label: 'ไม่ผ่านการคัดเลือก', color: '#F87171' }
    }
    return map[status] || { label: status, color: '#9CA3AF' }
  }

  // รายละเอียดใบสมัครแต่ละระดับ
  const getLevelLabel = (level: ArrApplicant['level']) => {
    const map: Record<ArrApplicant['level'], string> = {
      level1: 'ระดับ 1 (มัธยมศึกษาตอนปลาย)',
      level2: 'ระดับ 2 (ปริญญาตรี/อนุปริญญา)',
      level3: 'ระดับ 3 (บุคคลทั่วไป / โพสต์แกรด)'
    }
    return map[level] || level
  }

  return (
    <div style={{ padding: '0 22px 100px', position: 'relative' }}>
      
      {/* Feedback Toast */}
      {feedbackMsg && (
        <div style={{
          position: 'fixed',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          background: feedbackMsg.type === 'success' ? '#DEF7EC' : '#FDE8E8',
          color: feedbackMsg.type === 'success' ? '#03543F' : '#9B1C1C',
          border: `1px solid ${feedbackMsg.type === 'success' ? '#84E1BC' : '#F8B4B4'}`,
          padding: '12px 24px',
          borderRadius: '16px',
          zIndex: 9999,
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 14,
          fontWeight: 600,
          animation: 'fadeInDown 0.3s ease-out'
        }}>
          {feedbackMsg.type === 'success' ? <Icons.spark size={18} stroke="#0E9F6E" /> : <Icons.bell size={18} stroke="#E02424" />}
          {feedbackMsg.text}
        </div>
      )}

      {/* Title & Introduction Section */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid var(--saffron-200)',
            boxShadow: '0 4px 10px rgba(217, 119, 6, 0.15)'
          }}>
            <img src="/logo.png" alt="Nong Kaew Sai" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--saffron-600)', letterSpacing: '0.08em', fontFamily: 'var(--font-en)' }}>ARR & TRACKER SYSTEM</div>
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--ink-900)' }}>ระบบบันทึก ARR & ติดตามผู้สมัคร</h1>
          </div>
        </div>

        {/* Introduction Speech Bubble style */}
        <div style={{
          background: 'linear-gradient(135deg, #FDF1E6 0%, #F6FCF5 100%)',
          border: '1px solid #F0D5BE',
          borderRadius: '20px',
          padding: '14px 16px',
          position: 'relative',
          display: 'flex',
          alignItems: 'start',
          gap: 12
        }}>
          <div style={{ fontSize: 22, lineHeight: 1 }}>💡</div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--saffron-700)' }}>น้องแก้วใสแนะนำ:</span>
            <p style={{ fontSize: 12.5, color: 'var(--ink-700)', margin: '4px 0 0', lineHeight: 1.45 }}>
              "การติดตามดูแลกัลยาณมิตรเป็นประดุจงานเจียระไนเพชร ยึดหลัก <b>'นิ่ง นุ่ม นำ'</b> ค่อยๆ นำทางด้วยสมาธิและภาษาอังกฤษ NESE บันทึกการดูแลและไทม์ไลน์สัมภาษณ์อย่างประณีตนะคะ!"
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        background: '#F0ECE6',
        borderRadius: '16px',
        padding: 4,
        marginBottom: 20,
        border: '1px solid var(--ink-200)'
      }}>
        <button 
          onClick={() => setActiveTab('dashboard')}
          style={{
            flex: 1,
            padding: '10px 8px',
            border: 'none',
            borderRadius: '12px',
            background: activeTab === 'dashboard' ? 'var(--white)' : 'transparent',
            color: activeTab === 'dashboard' ? 'var(--ink-900)' : 'var(--ink-600)',
            fontWeight: activeTab === 'dashboard' ? 700 : 500,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            boxShadow: activeTab === 'dashboard' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Icons.target size={16} stroke={activeTab === 'dashboard' ? 'var(--saffron-600)' : 'var(--ink-600)'} />
          แดชบอร์ด & สถิติ
        </button>
        <button 
          onClick={() => setActiveTab('arr')}
          style={{
            flex: 1,
            padding: '10px 8px',
            border: 'none',
            borderRadius: '12px',
            background: activeTab === 'arr' ? 'var(--white)' : 'transparent',
            color: activeTab === 'arr' ? 'var(--ink-900)' : 'var(--ink-600)',
            fontWeight: activeTab === 'arr' ? 700 : 500,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            boxShadow: activeTab === 'arr' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Icons.spark size={16} stroke={activeTab === 'arr' ? 'var(--saffron-600)' : 'var(--ink-600)'} />
          บันทึก ARR
        </button>
        <button 
          onClick={() => setActiveTab('applicants')}
          style={{
            flex: 1,
            padding: '10px 8px',
            border: 'none',
            borderRadius: '12px',
            background: activeTab === 'applicants' ? 'var(--white)' : 'transparent',
            color: activeTab === 'applicants' ? 'var(--ink-900)' : 'var(--ink-600)',
            fontWeight: activeTab === 'applicants' ? 700 : 500,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            boxShadow: activeTab === 'applicants' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Icons.users size={16} stroke={activeTab === 'applicants' ? 'var(--saffron-600)' : 'var(--ink-600)'} />
          ติดตามผู้สมัคร
        </button>
      </div>

      {/* TAB 1: DASHBOARD & TIMELINE */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Section: Overview Cards */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--ink-400)', textTransform: 'uppercase', marginBottom: 8 }}>ยอดรวมสะสมของกิจกรรมโครงการ</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              
              <div className="card" style={{ padding: 14, background: '#EEF3ED', borderColor: '#D6E1D4' }}>
                <span style={{ fontSize: 11, color: '#3D5C3B', fontWeight: 600 }}>ยอดรับฟังการนำเสนอ</span>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#273C25', marginTop: 4 }}>{stats.overall.totalListeners}</div>
                <span style={{ fontSize: 10, color: 'var(--ink-500)' }}>คน จากสัมมนาทั้งหมด</span>
              </div>
              
              <div className="card" style={{ padding: 14, background: '#FFFDF0', borderColor: '#F2E5BD' }}>
                <span style={{ fontSize: 11, color: '#856404', fontWeight: 600 }}>ผู้ให้ความสนใจสมัคร</span>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#6A5005', marginTop: 4 }}>{stats.overall.totalInterested}</div>
                <span style={{ fontSize: 10, color: 'var(--ink-500)' }}>คน รอการกรอกเอกสาร</span>
              </div>

            </div>

            {/* Application Level Stats Grid */}
            <div className="card" style={{ padding: 16, marginTop: 12, background: 'var(--white)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--saffron-700)', textTransform: 'uppercase' }}>สถิติยอดสมัครจริงแยกตามระดับทุน</span>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14 }}>
                <div style={{ textAlign: 'center', padding: '8px 4px', background: '#FDF1E6', borderRadius: '12px' }}>
                  <div style={{ fontSize: 11, color: 'var(--saffron-700)', fontWeight: 600 }}>ระดับ 1</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--saffron-800)', marginTop: 2 }}>{stats.overall.totalLevel1}</div>
                  <span style={{ fontSize: 9, color: 'var(--ink-500)' }}>ม.ปลาย</span>
                </div>
                <div style={{ textAlign: 'center', padding: '8px 4px', background: '#FDF1E6', borderRadius: '12px' }}>
                  <div style={{ fontSize: 11, color: 'var(--saffron-700)', fontWeight: 600 }}>ระดับ 2</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--saffron-800)', marginTop: 2 }}>{stats.overall.totalLevel2}</div>
                  <span style={{ fontSize: 9, color: 'var(--ink-500)' }}>ป.ตรี/อนุปริญญา</span>
                </div>
                <div style={{ textAlign: 'center', padding: '8px 4px', background: '#FDF1E6', borderRadius: '12px' }}>
                  <div style={{ fontSize: 11, color: 'var(--saffron-700)', fontWeight: 600 }}>ระดับ 3</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--saffron-800)', marginTop: 2 }}>{stats.overall.totalLevel3}</div>
                  <span style={{ fontSize: 9, color: 'var(--ink-500)' }}>บุคคลทั่วไป</span>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed var(--ink-200)', marginTop: 14, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-700)' }}>ยอดผู้สมัครรายบุคคลทั้งหมด</span>
                <NumPill n={`${stats.overall.actualApplicants} คน`} color="saffron" />
              </div>
            </div>
          </div>

          {/* Section: Regional Performance & Stats */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-800)', textTransform: 'uppercase' }}>สรุปข้อมูลเชิงสถิติรายพื้นที่</span>
              <Chip variant="sage">คำนวณพื้นที่</Chip>
            </div>

            {stats.regionalStats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ink-400)', fontSize: 13 }}>
                ยังไม่มีข้อมูลผู้สมัครระบุพื้นที่ในการคำนวณค่ะ
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stats.regionalStats.map((item: any, idx: number) => {
                  const maxTotal = stats.regionalStats[0]?.total || 1
                  return (
                    <div key={idx} style={{ background: '#FBF7F1', padding: 12, borderRadius: '12px', border: '1px solid #F3E4D4' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-800)' }}>📍 {item.area}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--saffron-600)' }}>{item.total} คน</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--ink-500)', marginBottom: 8 }}>
                        <span>สนใจ: {item.interested} คน</span>
                        <span>·</span>
                        <span>ส่งใบสมัคร/สัมภาษณ์: {item.applied} คน</span>
                      </div>
                      <ProgressBar value={item.total} max={maxTotal} color="var(--saffron-500)" track="#EFEAE2" />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Section: Interview Schedule Timeline */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-800)', textTransform: 'uppercase' }}>ปฏิทินนัดหมายสัมภาษณ์ (Timeline)</span>
              <Icons.bell size={16} stroke="var(--saffron-500)" />
            </div>

            {stats.interviewTimeline.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--ink-400)', fontSize: 13 }}>
                ยังไม่มีการนัดหมายสัมภาษณ์สำหรับผู้สมัครท่านใดค่ะ
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', paddingLeft: 20 }}>
                {/* Vertical Timeline Line */}
                <div style={{
                  position: 'absolute',
                  left: 6,
                  top: 8,
                  bottom: 8,
                  width: 2,
                  background: 'repeating-linear-gradient(to bottom, var(--saffron-400), var(--saffron-400) 4px, transparent 4px, transparent 8px)'
                }} />

                {stats.interviewTimeline.map((item: any, idx: number) => {
                  const intDateObj = new Date(item.interviewDate)
                  const formattedDate = intDateObj.toLocaleDateString('th-TH', { 
                    day: 'numeric', month: 'short', year: 'numeric' 
                  })
                  const formattedTime = intDateObj.toLocaleTimeString('th-TH', {
                    hour: '2-digit', minute: '2-digit'
                  }) + ' น.'

                  return (
                    <div key={idx} style={{ position: 'relative', marginBottom: 20 }}>
                      
                      {/* Circle Dot Indicator */}
                      <div style={{
                        position: 'absolute',
                        left: -20,
                        top: 4,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: 'var(--saffron-500)',
                        border: '3px solid #FFF5EB',
                        boxShadow: '0 0 0 2px var(--saffron-200)'
                      }} />

                      <div style={{
                        background: 'linear-gradient(135deg, var(--white) 0%, #FDF1E6 100%)',
                        padding: 12,
                        borderRadius: '12px',
                        border: '1px solid var(--saffron-100)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
                          <div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--saffron-600)' }}>
                              📅 {formattedDate} · ⏰ {formattedTime}
                            </span>
                            <h4 style={{ fontSize: 14.5, fontWeight: 800, margin: '4px 0 2px', color: 'var(--ink-900)' }}>
                              {item.name}
                            </h4>
                            <div style={{ fontSize: 11, color: 'var(--ink-500)', display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                              <span style={{ background: '#ECEFEA', padding: '2px 6px', borderRadius: '4px' }}>📍 {item.area}</span>
                              <span style={{ background: '#ECEFEA', padding: '2px 6px', borderRadius: '4px' }}>ระดับ {item.level.replace('level', '')}</span>
                            </div>
                          </div>
                          
                          <span style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '8px',
                            background: getStatusLabel(item.status).color,
                            color: 'var(--ink-800)'
                          }}>
                            {getStatusLabel(item.status).label}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: ARR LOG (บันทึกกิจกรรมนำเสนอ) */}
      {activeTab === 'arr' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Add Activity Button / Accordion Form Toggle */}
          <button 
            onClick={() => {
              if (showActivityForm) resetActivityForm()
              setShowActivityForm(!showActivityForm)
            }}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '16px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--saffron-500) 0%, var(--saffron-600) 100%)',
              color: 'var(--white)',
              fontWeight: 700,
              fontSize: 14.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 8px 20px rgba(214, 95, 28, 0.25)',
            }}
          >
            {showActivityForm ? <Icons.bell size={18} stroke="currentColor" /> : <Icons.spark size={18} stroke="currentColor" />}
            {showActivityForm ? 'ปิดหน้าต่างฟอร์มบันทึก' : editingActivity ? 'แก้ไขกิจกรรม ARR ของคุณ' : 'บันทึกกิจกรรม ARR ใหม่'}
          </button>

          {/* ARR Form Log */}
          {showActivityForm && (
            <form onSubmit={handleSaveActivity} className="card animate-fade-in" style={{ padding: 18, background: '#FFFDFC', borderColor: 'var(--saffron-200)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--saffron-700)', marginTop: 0, marginBottom: 14, borderBottom: '1px solid var(--saffron-100)', paddingBottom: 8 }}>
                {editingActivity ? '📝 แก้ไขกิจกรรม ARR' : '✨ บันทึกรายงาน ARR กิจกรรมเผยแผ่'}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-700)', display: 'block', marginBottom: 4 }}>หัวข้อ / สถานที่ / กิจกรรม *</label>
                  <input 
                    type="text" 
                    value={actTitle}
                    onChange={e => setActTitle(e.target.value)}
                    placeholder="เช่น นำเสนอแนะแนวทุน ม.ธรรมศาสตร์ หรือ ค่ายธรรมะสุจริต"
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: 13.5 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-700)', display: 'block', marginBottom: 4 }}>วันที่ดำเนินงาน *</label>
                    <input 
                      type="date" 
                      value={actDate}
                      onChange={e => setActDate(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: 13.5 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-700)', display: 'block', marginBottom: 4 }}>พระอาจารย์ / วิทยากร</label>
                    <input 
                      type="text" 
                      value={actSpeaker}
                      onChange={e => setActSpeaker(e.target.value)}
                      placeholder="พระมหา..."
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: 13.5 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-700)', display: 'block', marginBottom: 4 }}>จำนวนผู้เข้าฟังบรรยาย</label>
                    <input 
                      type="number" 
                      min={0}
                      value={actAttendees}
                      onChange={e => setActAttendees(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: 13.5 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-700)', display: 'block', marginBottom: 4 }}>จำนวนผู้สนใจสมัครทุน</label>
                    <input 
                      type="number" 
                      min={0}
                      value={actInterested}
                      onChange={e => setActInterested(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: 13.5 }}
                    />
                  </div>
                </div>

                {/* Sub-form: Level quantities */}
                <div style={{ background: 'var(--saffron-50)', padding: 12, borderRadius: '12px', border: '1px solid var(--saffron-100)' }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--saffron-700)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>จำนวนใบสมัครที่ได้รับแยกตามระดับ</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--ink-600)', display: 'block', marginBottom: 2 }}>ระดับ 1</label>
                      <input 
                        type="number" 
                        min={0}
                        value={actL1}
                        onChange={e => setActL1(Number(e.target.value))}
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--saffron-200)', fontSize: 13, textAlign: 'center' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--ink-600)', display: 'block', marginBottom: 2 }}>ระดับ 2</label>
                      <input 
                        type="number" 
                        min={0}
                        value={actL2}
                        onChange={e => setActL2(Number(e.target.value))}
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--saffron-200)', fontSize: 13, textAlign: 'center' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--ink-600)', display: 'block', marginBottom: 2 }}>ระดับ 3</label>
                      <input 
                        type="number" 
                        min={0}
                        value={actL3}
                        onChange={e => setActL3(Number(e.target.value))}
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--saffron-200)', fontSize: 13, textAlign: 'center' }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-700)', display: 'block', marginBottom: 4 }}>บันทึกผลการดำเนินงาน / ARR Reflections</label>
                  <textarea 
                    value={actNotes}
                    onChange={e => setActNotes(e.target.value)}
                    placeholder="ถอดบทเรียน: สิ่งที่ทำได้ดี, จุดที่ต้องปรับปรุง หรือการดูแลผู้สมัครต่อยอด..."
                    rows={3}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: 13.5, fontFamily: 'inherit', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowActivityForm(false)
                      resetActivityForm()
                    }}
                    style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid var(--ink-200)', background: 'var(--white)', fontWeight: 600, fontSize: 13.5, cursor: 'pointer' }}
                  >
                    ยกเลิก
                  </button>
                  <button 
                    type="submit"
                    disabled={isPending}
                    style={{ 
                      flex: 2, 
                      padding: '11px', 
                      borderRadius: '10px', 
                      border: 'none', 
                      background: 'var(--saffron-500)', 
                      color: 'var(--white)', 
                      fontWeight: 700, 
                      fontSize: 13.5, 
                      cursor: 'pointer',
                      opacity: isPending ? 0.7 : 1
                    }}
                  >
                    {isPending ? 'กำลังบันทึก...' : editingActivity ? 'บันทึกการแก้ไข' : 'บันทึกรายงาน ARR'}
                  </button>
                </div>

              </div>
            </form>
          )}

          {/* Historical Activities List */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-700)', textTransform: 'uppercase', marginBottom: 12 }}>ประวัติรายงาน ARR ทั้งหมด ({activities.length} กิจกรรม)</div>

            {activities.length === 0 ? (
              <div className="card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-400)', fontSize: 13.5 }}>
                ยังไม่เคยมีรายงานการนำเสนอ ARR บันทึกไว้เลยค่ะ กดปุ่มสีส้มด้านบนเพื่อเริ่มบันทึกกิจกรรมแรกนะคะ
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {activities.map((act) => {
                  const actDateObj = new Date(act.date)
                  const formattedDate = actDateObj.toLocaleDateString('th-TH', { 
                    day: 'numeric', month: 'long', year: 'numeric' 
                  })
                  
                  return (
                    <div key={act.id} className="card" style={{ padding: 16, background: 'var(--white)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 10 }}>
                        <div>
                          <span style={{ fontSize: 11, color: 'var(--saffron-600)', fontWeight: 700, textTransform: 'uppercase' }}>
                            📅 {formattedDate}
                          </span>
                          <h4 style={{ fontSize: 15.5, fontWeight: 800, margin: '4px 0', color: 'var(--ink-900)' }}>
                            {act.title}
                          </h4>
                          <span style={{ fontSize: 12, color: 'var(--ink-500)', display: 'block' }}>
                            🎙️ วิทยากร: {act.speaker}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button 
                            onClick={() => handleEditActivity(act)}
                            style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--ink-200)', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDeleteActivity(act.id)}
                            style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--ink-200)', background: '#FDF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {/* Stat summary chips */}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12, borderTop: '1px dashed var(--ink-100)', paddingTop: 12 }}>
                        <span style={{ fontSize: 11.5, background: '#EEF3ED', color: '#3D5C3B', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                          ผู้ฟัง: {act.attendeesCount}
                        </span>
                        <span style={{ fontSize: 11.5, background: '#FFFDF0', color: '#856404', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                          สนใจ: {act.interestedCount}
                        </span>
                        <span style={{ fontSize: 11.5, background: '#FFF5EB', color: 'var(--saffron-700)', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                          สมัคร ระดับ 1: {act.applications.level1}
                        </span>
                        <span style={{ fontSize: 11.5, background: '#FFF5EB', color: 'var(--saffron-700)', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                          ระดับ 2: {act.applications.level2}
                        </span>
                        <span style={{ fontSize: 11.5, background: '#FFF5EB', color: 'var(--saffron-700)', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                          ระดับ 3: {act.applications.level3}
                        </span>
                      </div>

                      {act.notes && (
                        <div style={{ marginTop: 12, padding: '10px 12px', background: '#FBF7F1', borderRadius: '8px', borderLeft: '3px solid #E5C39E', fontSize: 12.5, color: 'var(--ink-700)', lineHeight: 1.4 }}>
                          <b>บันทึกเพิ่มเติม:</b> {act.notes}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: APPLICANT TRACKER (ระบบติดตามผู้สมัครรายบุคคล) */}
      {activeTab === 'applicants' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Add Applicant Button */}
          <button 
            onClick={() => {
              if (showApplicantForm) resetApplicantForm()
              setShowApplicantForm(!showApplicantForm)
            }}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '16px',
              border: 'none',
              background: 'linear-gradient(135deg, #429F3D 0%, #358031 100%)',
              color: 'var(--white)',
              fontWeight: 700,
              fontSize: 14.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 8px 20px rgba(66, 159, 61, 0.25)',
            }}
          >
            {showApplicantForm ? <Icons.bell size={18} stroke="currentColor" /> : <Icons.users size={18} stroke="currentColor" />}
            {showApplicantForm ? 'ปิดหน้าต่างฟอร์มผู้สมัคร' : editingApplicant ? 'แก้ไขข้อมูลผู้สมัคร' : 'เพิ่มผู้สมัครรายบุคคลใหม่'}
          </button>

          {/* Applicant Form */}
          {showApplicantForm && (
            <form onSubmit={handleSaveApplicant} className="card animate-fade-in" style={{ padding: 18, background: '#FAFCFA', borderColor: '#CDE5CB' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#31732D', marginTop: 0, marginBottom: 14, borderBottom: '1px solid #D7ECD5', paddingBottom: 8 }}>
                {editingApplicant ? '✏️ แก้ไขข้อมูลผู้สมัคร' : '👤 เพิ่มข้อมูลกัลยาณมิตรผู้สมัครบวชเรียน'}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-700)', display: 'block', marginBottom: 4 }}>ชื่อจริง *</label>
                    <input 
                      type="text" 
                      value={appFirstName}
                      onChange={e => setAppFirstName(e.target.value)}
                      placeholder="เช่น ธนพล"
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: 13.5 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-700)', display: 'block', marginBottom: 4 }}>นามสกุล *</label>
                    <input 
                      type="text" 
                      value={appLastName}
                      onChange={e => setAppLastName(e.target.value)}
                      placeholder="เช่น แก้วสะอาด"
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: 13.5 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-700)', display: 'block', marginBottom: 4 }}>ชื่อเล่น</label>
                    <input 
                      type="text" 
                      value={appNickname}
                      onChange={e => setAppNickname(e.target.value)}
                      placeholder="เช่น พล"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: 13.5 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-700)', display: 'block', marginBottom: 4 }}>เบอร์โทรศัพท์ติดต่อ</label>
                    <input 
                      type="tel" 
                      value={appPhone}
                      onChange={e => setAppPhone(e.target.value)}
                      placeholder="เช่น 081-234-5678"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: 13.5 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-700)', display: 'block', marginBottom: 4 }}>ภูมิภาค / พื้นที่ *</label>
                    <select
                      value={appArea}
                      onChange={e => setAppArea(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: 13.5, background: 'var(--white)' }}
                    >
                      {PRESETS_AREAS.map((ar, i) => (
                        <option key={i} value={ar}>{ar}</option>
                      ))}
                      <option value="ไม่ระบุพื้นที่">ไม่ระบุพื้นที่</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-700)', display: 'block', marginBottom: 4 }}>ระดับทุนการสมัคร *</label>
                    <select
                      value={appLevel}
                      onChange={e => setAppLevel(e.target.value as any)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: 13.5, background: 'var(--white)' }}
                    >
                      <option value="level1">ระดับ 1 (ม.ปลาย)</option>
                      <option value="level2">ระดับ 2 (ป.ตรี/อนุปริญญา)</option>
                      <option value="level3">ระดับ 3 (บุคคลทั่วไป)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-700)', display: 'block', marginBottom: 4 }}>สถานะการติดตาม *</label>
                    <select
                      value={appStatus}
                      onChange={e => setAppStatus(e.target.value as any)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: 13.5, background: 'var(--white)' }}
                    >
                      <option value="presentation">ฟังนำเสนอแล้ว</option>
                      <option value="interested">สนใจสมัคร</option>
                      <option value="applied">ส่งใบสมัครแล้ว</option>
                      <option value="scheduled">นัดสัมภาษณ์แล้ว</option>
                      <option value="interviewed">สัมภาษณ์แล้ว</option>
                      <option value="accepted">ผ่านการคัดเลือก</option>
                      <option value="rejected">ไม่ผ่านการคัดเลือก</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-700)', display: 'block', marginBottom: 4 }}>วันนัดสัมภาษณ์ (ถ้ามี)</label>
                    <input 
                      type="datetime-local" 
                      value={appInterviewDate}
                      onChange={e => setAppInterviewDate(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: 13 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowApplicantForm(false)
                      resetApplicantForm()
                    }}
                    style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid var(--ink-200)', background: 'var(--white)', fontWeight: 600, fontSize: 13.5, cursor: 'pointer' }}
                  >
                    ยกเลิก
                  </button>
                  <button 
                    type="submit"
                    disabled={isPending}
                    style={{ 
                      flex: 2, 
                      padding: '11px', 
                      borderRadius: '10px', 
                      border: 'none', 
                      background: '#429F3D', 
                      color: 'var(--white)', 
                      fontWeight: 700, 
                      fontSize: 13.5, 
                      cursor: 'pointer',
                      opacity: isPending ? 0.7 : 1
                    }}
                  >
                    {isPending ? 'กำลังบันทึก...' : editingApplicant ? 'บันทึกแก้ไขผู้สมัคร' : 'เพิ่มผู้สมัคร'}
                  </button>
                </div>

              </div>
            </form>
          )}

          {/* Search and Filters Box */}
          <div className="card" style={{ padding: 14, background: '#F8F9FA' }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-500)', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>🔎 ค้นหาและกรองผู้สมัคร</span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="พิมพ์ชื่อ นามสกุล หรือชื่อเล่นเพื่อค้นหา..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--ink-200)', fontSize: 13.5 }}
              />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <select 
                  value={areaFilter}
                  onChange={e => setAreaFilter(e.target.value)}
                  style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--ink-200)', fontSize: 12, background: 'var(--white)' }}
                >
                  <option value="all">ทุกพื้นที่</option>
                  {PRESETS_AREAS.map((ar, idx) => (
                    <option key={idx} value={ar}>{ar}</option>
                  ))}
                  <option value="ไม่ระบุพื้นที่">ไม่ระบุพื้นที่</option>
                </select>
                
                <select 
                  value={levelFilter}
                  onChange={e => setLevelFilter(e.target.value)}
                  style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--ink-200)', fontSize: 12, background: 'var(--white)' }}
                >
                  <option value="all">ทุกระดับทุน</option>
                  <option value="level1">ระดับ 1 (ม.ปลาย)</option>
                  <option value="level2">ระดับ 2 (ป.ตรี)</option>
                  <option value="level3">ระดับ 3 (บุคคลทั่วไป)</option>
                </select>
              </div>

              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--ink-200)', fontSize: 12, background: 'var(--white)' }}
              >
                <option value="all">ทุกสถานะการติดตาม</option>
                <option value="presentation">ฟังนำเสนอแล้ว</option>
                <option value="interested">สนใจสมัคร</option>
                <option value="applied">ส่งใบสมัครแล้ว</option>
                <option value="scheduled">นัดสัมภาษณ์แล้ว</option>
                <option value="interviewed">สัมภาษณ์แล้ว</option>
                <option value="accepted">ผ่านการคัดเลือก</option>
                <option value="rejected">ไม่ผ่านการคัดเลือก</option>
              </select>
            </div>
          </div>

          {/* Applicants List Grid */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-700)', textTransform: 'uppercase' }}>
                รายชื่อผู้สมัคร ({filteredApplicants.length} คน)
              </span>
              {filteredApplicants.length < applicants.length && (
                <span style={{ fontSize: 11, color: 'var(--saffron-600)', fontWeight: 600 }}>กรองจาก {applicants.length} คน</span>
              )}
            </div>

            {filteredApplicants.length === 0 ? (
              <div className="card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-400)', fontSize: 13.5 }}>
                ไม่พบข้อมูลรายชื่อผู้สมัครตามเงื่อนไขที่ค้นหาค่ะ
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {filteredApplicants.map((app) => (
                  <div key={app.id} className="card" style={{ padding: 16, background: 'var(--white)' }}>
                    
                    {/* Applicant Top Info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 10 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <h4 style={{ fontSize: 15.5, fontWeight: 800, margin: 0, color: 'var(--ink-900)' }}>
                            {app.firstName} {app.lastName} {app.nickname ? `(${app.nickname})` : ''}
                          </h4>
                          <span style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '8px',
                            background: getStatusLabel(app.status).color,
                            color: 'var(--ink-800)'
                          }}>
                            {getStatusLabel(app.status).label}
                          </span>
                        </div>
                        
                        <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <span>📞 {app.phone || 'ไม่มีเบอร์โทร'}</span>
                          <span>·</span>
                          <span style={{ color: 'var(--saffron-700)', fontWeight: 600 }}>📍 {app.area}</span>
                        </div>
                      </div>

                      {/* Control buttons */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button 
                          onClick={() => handleEditApplicant(app)}
                          style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--ink-200)', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDeleteApplicant(app.id)}
                          style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--ink-200)', background: '#FDF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--ink-600)', marginTop: 8, background: '#F6FCF5', padding: '6px 10px', borderRadius: '6px', border: '1px solid #E2F3E1' }}>
                      🎓 <b>ระดับสมัคร:</b> {getLevelLabel(app.level)}
                    </div>

                    {/* Interview Date alert if scheduled */}
                    {app.interviewDate && (
                      <div style={{ 
                        marginTop: 8, 
                        padding: '6px 10px', 
                        background: '#F6EFFF', 
                        borderRadius: '6px', 
                        border: '1px solid #DCD1FC', 
                        fontSize: 12, 
                        fontWeight: 600,
                        color: '#6347D4'
                      }}>
                        📆 <b>นัดสัมภาษณ์:</b> {new Date(app.interviewDate).toLocaleDateString('th-TH', { 
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })} น.
                      </div>
                    )}

                    {/* Care Journal Trigger Section */}
                    <div style={{ borderTop: '1px dashed var(--ink-200)', marginTop: 12, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11.5, color: 'var(--ink-500)' }}>
                        📝 บันทึกประวัติการดูแล ({app.careJournal?.length || 0} รายการ)
                      </span>
                      <button
                        onClick={() => setActiveJournalApplicant(activeJournalApplicant?.id === app.id ? null : app)}
                        style={{
                          border: 'none',
                          background: '#F0ECE6',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: 'var(--ink-700)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        {activeJournalApplicant?.id === app.id ? '🔒 ปิดบันทึก' : '📖 เปิดบันทึกดูแล'}
                      </button>
                    </div>

                    {/* Care Journal Expanded Panel */}
                    {activeJournalApplicant?.id === app.id && (
                      <div className="animate-fade-in" style={{ marginTop: 10, background: '#FAF8F5', border: '1px solid #F0E8DD', borderRadius: '10px', padding: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--saffron-700)', display: 'block', marginBottom: 8 }}>📖 ประวัติการติดตามดูแลกัลยาณมิตร (Care Journal)</span>
                        
                        {/* Add journal entry form */}
                        <form onSubmit={handleAddJournalNote} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                          <input 
                            type="text"
                            value={journalNote}
                            onChange={e => setJournalNote(e.target.value)}
                            placeholder="พิมพ์ข้อความดูแล เช่น โทรสัมภาษณ์เบื้องต้น/น้องขอเลื่อน..."
                            style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--ink-200)', fontSize: 12.5 }}
                          />
                          <button
                            type="submit"
                            disabled={isPending || !journalNote.trim()}
                            style={{
                              background: 'var(--saffron-500)',
                              color: 'var(--white)',
                              border: 'none',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                              opacity: (!journalNote.trim() || isPending) ? 0.6 : 1
                            }}
                          >
                            บันทึก
                          </button>
                        </form>

                        {/* List journal entries */}
                        {app.careJournal && app.careJournal.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto', paddingRight: 4 }}>
                            {app.careJournal.map((entry) => {
                              const noteDate = new Date(entry.date)
                              const formattedNoteDate = noteDate.toLocaleDateString('th-TH', { 
                                day: 'numeric', month: 'short' 
                              }) + ' ' + noteDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })

                              return (
                                <div key={entry.id} style={{ background: 'var(--white)', padding: 8, borderRadius: '8px', border: '1px solid var(--ink-100)', fontSize: 12 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-500)', fontSize: 10.5, marginBottom: 2 }}>
                                    <span style={{ fontWeight: 600 }}>👤 {entry.author}</span>
                                    <span>{formattedNoteDate}</span>
                                  </div>
                                  <p style={{ margin: 0, color: 'var(--ink-800)', lineHeight: 1.4 }}>{entry.note}</p>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '12px 0', fontSize: 11.5, color: 'var(--ink-400)' }}>
                            ยังไม่มีบันทึกการดูแลสำหรับผู้สมัครท่านนี้ค่ะ พิมพ์บันทึกแรกด้านบนได้เลย
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  )
}
