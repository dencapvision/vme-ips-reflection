import { NextRequest, NextResponse } from 'next/server'
import { getMemberByName } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/clients'
import { signSession, sessionCookieOptions, SESSION_COOKIE } from '@/lib/session'

export const dynamic = 'force-dynamic'


export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text()
    const body = JSON.parse(bodyText)
    const rawFirstName = (body.first_name as string | undefined) ?? ''
    const rawLastName  = (body.last_name  as string | undefined) ?? ''

    const first_name = rawFirstName.trim().replace(/\s+/g, ' ')
    const last_name  = rawLastName.trim().replace(/\s+/g, ' ')

    if (!first_name || !last_name) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อและนามสกุล' }, { status: 400 })
    }

    const adminClient = getSupabaseAdmin()

    // 1. Double verification lookup: Primary is profiles, secondary/fallback is members whitelist
    const { data: profileRow } = await adminClient
      .from('profiles')
      .select('id, first_name, last_name, role')
      .eq('first_name', first_name)
      .eq('last_name', last_name)
      .maybeSingle()

    let member = await getMemberByName(first_name, last_name)
    let activeProfileRow = profileRow

    // 2. Self-Healing Mechanism:
    // If the user has a profile but is missing in the members (whitelist) table,
    // we silently repair the database and insert them to ensure seamless real-time access.
    if (activeProfileRow && activeProfileRow.role !== 'admin' && !member) {
      console.log(`[self-healing] Syncing missing member to members table: ${first_name} ${last_name}`)
      const { error: insertErr } = await adminClient
        .from('members')
        .insert({
          first_name,
          last_name,
        })
      
      if (!insertErr || insertErr.code === '23505') {
        // Fetch the newly created member row
        member = await getMemberByName(first_name, last_name)
      } else {
        console.error('[self-healing] Failed to insert missing member:', insertErr)
      }
    }

    // 2.2. Reverse Self-Healing Mechanism (Whitelist-First auto-provisioning):
    // If the user is whitelisted in `members` table, but has NO profile record (or no Supabase auth user)
    // we dynamically create their auth user and profile on-demand to guarantee instant real-time login.
    if (member && !activeProfileRow) {
      console.log(`[reverse-self-healing] Member whitelisted but has no profile row. Provisioning user dynamically for: ${first_name} ${last_name}`)
      try {
        const dummyPhone = `000${Math.floor(1000000 + Math.random() * 9000000)}`
        const email = `temp_${dummyPhone}@vme-ips.local`
        const password = dummyPhone

        // Create Supabase auth user
        const { data: newUser, error: authError } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { first_name, last_name },
        })

        if (!authError && newUser?.user) {
          // Small delay to ensure database trigger has run and created the profile row
          await new Promise((r) => setTimeout(r, 500))

          // Update profile with correct details
          const { data: updatedProfile, error: profileError } = await adminClient
            .from('profiles')
            .update({
              first_name,
              last_name,
              phone: dummyPhone,
              role: 'member',
            })
            .eq('id', newUser.user.id)
            .select('id, first_name, last_name, role')
            .maybeSingle()

          if (!profileError && updatedProfile) {
            activeProfileRow = updatedProfile
            console.log(`[reverse-self-healing] Successfully provisioned dynamic profile for: ${first_name} ${last_name}`)
          } else {
            console.error('[reverse-self-healing] Failed to update dynamic profile:', profileError)
          }
        } else {
          console.error('[reverse-self-healing] Failed to create dynamic auth user:', authError)
        }
      } catch (provisionErr) {
        console.error('[reverse-self-healing] Unexpected provisioning error:', provisionErr)
      }
    }

    // 3. Fallback Validation: If still no member and no active profile, reject
    if (!member && !activeProfileRow) {
      return NextResponse.json(
        { error: 'ไม่พบชื่อของท่านในระบบ กรุณาติดต่อเจ้าหน้าที่' },
        { status: 404 }
      )
    }

    // If it's an admin trying to login via member portal, redirect/reject them
    if (activeProfileRow?.role === 'admin') {
      return NextResponse.json(
        { error: 'ผู้ดูแลระบบกรุณาเข้าสู่ระบบผ่านช่องทางเฉพาะ' },
        { status: 403 }
      )
    }

    // 4. Sign JWT — include profile_id when available
    // Fallback to activeProfileRow.id or member.id dynamically to ensure sessions always work
    const memberId = member?.id || activeProfileRow?.id || 'unknown'
    const finalFirstName = member?.first_name || activeProfileRow?.first_name || first_name
    const finalLastName = member?.last_name || activeProfileRow?.last_name || last_name

    const token = await signSession({
      sub: memberId,
      type: 'member',
      first_name: finalFirstName,
      last_name: finalLastName,
      profile_id: activeProfileRow?.id ?? undefined,
    })

    const response = NextResponse.json({ success: true })
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
    return response

  } catch (err) {
    console.error('[member-login]', err)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในระบบ' }, { status: 500 })
  }
}
