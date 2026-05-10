import { getProfile } from '@/app/actions/profile'
import { AppHeader } from '@/components/AppHeader'
import { TabBar } from '@/components/TabBar'
import EditProfileForm from './EditProfileForm'
import { redirect } from 'next/navigation'

export default async function EditProfilePage() {
  const profile = await getProfile()
  
  if (!profile) {
    redirect('/login')
  }

  return (
    <>
      <div style={{ paddingTop: 30 }}>
        <AppHeader title="แก้ไขโปรไฟล์" subtitle="EDIT PROFILE" />
      </div>
      
      <div style={{ padding: "4px 22px 30px" }}>
        <div className="card" style={{ padding: 20 }}>
          <EditProfileForm initialData={profile} />
        </div>
      </div>

      <TabBar />
    </>
  )
}
