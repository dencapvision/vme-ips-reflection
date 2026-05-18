'use server'

import { getProfile } from './profile'
import { saveUserResponse, getUserResponse } from './responses'
import { revalidatePath } from 'next/cache'

// Interface สำหรับกิจกรรม ARR (ARR Activity)
export interface ArrActivity {
  id: string
  date: string
  title: string
  speaker: string
  attendeesCount: number
  interestedCount: number
  applications: {
    level1: number
    level2: number
    level3: number
  }
  notes?: string
  createdAt: string
}

// Interface สำหรับประวัติการดูแลผู้สมัคร (Care Journal Entry)
export interface CareJournalEntry {
  id: string
  date: string
  note: string
  author: string
}

// Interface สำหรับผู้สมัคร (Applicant)
export interface ArrApplicant {
  id: string
  firstName: string
  lastName: string
  nickname: string
  phone: string
  area: string // ภูมิภาค / พื้นที่ (เช่น กรุงเทพฯ, ภาคเหนือ, ภาคอีสาน, ภาคใต้, ภาคกลาง)
  level: 'level1' | 'level2' | 'level3' // ระดับของใบสมัคร
  status: 'presentation' | 'interested' | 'applied' | 'scheduled' | 'interviewed' | 'accepted' | 'rejected'
  interviewDate?: string // วันนัดสัมภาษณ์ (ISO string / YYYY-MM-DDTHH:mm)
  careJournal: CareJournalEntry[]
  createdAt: string
}

/**
 * ดึงรายการกิจกรรม ARR ทั้งหมด
 */
export async function getArrActivities(): Promise<ArrActivity[]> {
  try {
    const data = await getUserResponse('arr_activities')
    if (data && data.activities && Array.isArray(data.activities)) {
      return data.activities as ArrActivity[]
    }
    return []
  } catch (error) {
    console.error('getArrActivities error:', error)
    return []
  }
}

/**
 * บันทึกหรืออัปเดตกิจกรรม ARR
 */
export async function saveArrActivity(activity: Omit<ArrActivity, 'createdAt'> & { createdAt?: string }) {
  const profile = await getProfile()
  if (!profile) return { error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }

  try {
    const currentActivities = await getArrActivities()
    let updatedActivities: ArrActivity[] = []

    const isExisting = currentActivities.some(a => a.id === activity.id)
    const nowStr = new Date().toISOString()

    if (isExisting) {
      // อัปเดตตัวเดิม
      updatedActivities = currentActivities.map(a => 
        a.id === activity.id 
          ? { ...a, ...activity, createdAt: a.createdAt || nowStr } 
          : a
      )
    } else {
      // เพิ่มตัวใหม่
      const newActivity: ArrActivity = {
        ...activity,
        createdAt: nowStr
      }
      updatedActivities = [newActivity, ...currentActivities]
    }

    const result = await saveUserResponse('arr_activities', { activities: updatedActivities })
    if (result.error) return { error: result.error }

    revalidatePath('/arr')
    return { success: true, activities: updatedActivities }
  } catch (error: any) {
    console.error('saveArrActivity error:', error)
    return { error: error.message || 'เกิดข้อผิดพลาดในการบันทึกกิจกรรม' }
  }
}

/**
 * ลบกิจกรรม ARR
 */
export async function deleteArrActivity(id: string) {
  const profile = await getProfile()
  if (!profile) return { error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }

  try {
    const currentActivities = await getArrActivities()
    const updatedActivities = currentActivities.filter(a => a.id !== id)

    const result = await saveUserResponse('arr_activities', { activities: updatedActivities })
    if (result.error) return { error: result.error }

    revalidatePath('/arr')
    return { success: true }
  } catch (error: any) {
    console.error('deleteArrActivity error:', error)
    return { error: error.message || 'เกิดข้อผิดพลาดในการลบกิจกรรม' }
  }
}

/**
 * ดึงรายการผู้สมัครทั้งหมด
 */
export async function getArrApplicants(): Promise<ArrApplicant[]> {
  try {
    const data = await getUserResponse('arr_applicants')
    if (data && data.applicants && Array.isArray(data.applicants)) {
      return data.applicants as ArrApplicant[]
    }
    return []
  } catch (error) {
    console.error('getArrApplicants error:', error)
    return []
  }
}

/**
 * บันทึกหรืออัปเดตผู้สมัครรายบุคคล
 */
export async function saveArrApplicant(applicant: Omit<ArrApplicant, 'createdAt' | 'careJournal'> & { createdAt?: string, careJournal?: CareJournalEntry[] }) {
  const profile = await getProfile()
  if (!profile) return { error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }

  try {
    const currentApplicants = await getArrApplicants()
    let updatedApplicants: ArrApplicant[] = []

    const isExisting = currentApplicants.some(a => a.id === applicant.id)
    const nowStr = new Date().toISOString()

    if (isExisting) {
      // อัปเดตตัวเดิม
      updatedApplicants = currentApplicants.map(a => 
        a.id === applicant.id 
          ? { 
              ...a, 
              ...applicant, 
              careJournal: applicant.careJournal || a.careJournal || [],
              createdAt: a.createdAt || nowStr 
            } 
          : a
      )
    } else {
      // เพิ่มตัวใหม่
      const newApplicant: ArrApplicant = {
        ...applicant,
        careJournal: applicant.careJournal || [],
        createdAt: nowStr
      }
      updatedApplicants = [newApplicant, ...currentApplicants]
    }

    const result = await saveUserResponse('arr_applicants', { applicants: updatedApplicants })
    if (result.error) return { error: result.error }

    revalidatePath('/arr')
    return { success: true, applicants: updatedApplicants }
  } catch (error: any) {
    console.error('saveArrApplicant error:', error)
    return { error: error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้สมัคร' }
  }
}

/**
 * เพิ่มบันทึกการดูแล (Care Journal Entry) ของผู้สมัคร
 */
export async function addCareJournalEntry(applicantId: string, note: string) {
  const profile = await getProfile()
  if (!profile) return { error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }

  try {
    const currentApplicants = await getArrApplicants()
    const applicant = currentApplicants.find(a => a.id === applicantId)
    if (!applicant) return { error: 'ไม่พบข้อมูลผู้สมัคร' }

    const authorName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'ผู้ดูแลระบบ'
    
    const newEntry: CareJournalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      note: note,
      author: authorName
    }

    const updatedJournal = [newEntry, ...(applicant.careJournal || [])]

    const updatedApplicants = currentApplicants.map(a => 
      a.id === applicantId 
        ? { ...a, careJournal: updatedJournal } 
        : a
    )

    const result = await saveUserResponse('arr_applicants', { applicants: updatedApplicants })
    if (result.error) return { error: result.error }

    revalidatePath('/arr')
    return { success: true, careJournal: updatedJournal }
  } catch (error: any) {
    console.error('addCareJournalEntry error:', error)
    return { error: error.message || 'เกิดข้อผิดพลาดในการบันทึกประวัติการดูแล' }
  }
}

/**
 * ลบข้อมูลผู้สมัคร
 */
export async function deleteArrApplicant(id: string) {
  const profile = await getProfile()
  if (!profile) return { error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }

  try {
    const currentApplicants = await getArrApplicants()
    const updatedApplicants = currentApplicants.filter(a => a.id !== id)

    const result = await saveUserResponse('arr_applicants', { applicants: updatedApplicants })
    if (result.error) return { error: result.error }

    revalidatePath('/arr')
    return { success: true }
  } catch (error: any) {
    console.error('deleteArrApplicant error:', error)
    return { error: error.message || 'เกิดข้อผิดพลาดในการลบข้อมูลผู้สมัคร' }
  }
}

/**
 * รวบรวมสถิติสถิติสำหรับหน้า Dashboard (คำนวณสถิติและภูมิภาคอย่างละเอียด)
 */
export async function getArrSummaryStats() {
  try {
    const activities = await getArrActivities()
    const applicants = await getArrApplicants()

    // 1. สรุปภาพรวมสถิติทั่วไป (Overall Stats)
    let totalPresentationListeners = 0
    let totalInterested = 0
    let totalLevel1 = 0
    let totalLevel2 = 0
    let totalLevel3 = 0

    // นับสถิติจากกิจกรรม ARR Log
    activities.forEach(act => {
      totalPresentationListeners += Number(act.attendeesCount || 0)
      totalInterested += Number(act.interestedCount || 0)
      totalLevel1 += Number(act.applications?.level1 || 0)
      totalLevel2 += Number(act.applications?.level2 || 0)
      totalLevel3 += Number(act.applications?.level3 || 0)
    })

    // นับยอดผู้สมัครจริงรายบุคคลแยกตามระดับ
    let actualLevel1 = 0
    let actualLevel2 = 0
    let actualLevel3 = 0
    
    applicants.forEach(app => {
      if (app.level === 'level1') actualLevel1++
      else if (app.level === 'level2') actualLevel2++
      else if (app.level === 'level3') actualLevel3++
    })

    const totalActualApplicants = applicants.length

    // 2. สถิติแยกตามภูมิภาค/พื้นที่ (Regional Stats)
    // รวบรวมพื้นที่ทั้งหมดในระบบและคำนวณยอด
    const areaStatsMap: Record<string, { interested: number, applied: number, total: number }> = {}

    applicants.forEach(app => {
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

    // 3. รวบรวม Timeline สำหรับสัมภาษณ์ (Interview Timeline Schedule)
    const interviewTimeline = applicants
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
      // เรียงลำดับตามวันที่นัดสัมภาษณ์จากอนาคตอันใกล้สุด
      .sort((a, b) => new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime())

    return {
      activitiesCount: activities.length,
      overall: {
        totalListeners: totalPresentationListeners,
        totalInterested: totalInterested,
        totalLevel1: totalLevel1 || actualLevel1,
        totalLevel2: totalLevel2 || actualLevel2,
        totalLevel3: totalLevel3 || actualLevel3,
        totalApplications: (totalLevel1 + totalLevel2 + totalLevel3) || totalActualApplicants,
        actualApplicants: totalActualApplicants
      },
      regionalStats,
      interviewTimeline
    }
  } catch (error) {
    console.error('getArrSummaryStats error:', error)
    return {
      activitiesCount: 0,
      overall: {
        totalListeners: 0,
        totalInterested: 0,
        totalLevel1: 0,
        totalLevel2: 0,
        totalLevel3: 0,
        totalApplications: 0,
        actualApplicants: 0
      },
      regionalStats: [],
      interviewTimeline: []
    }
  }
}
