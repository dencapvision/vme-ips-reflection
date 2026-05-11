import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/profile') || request.nextUrl.pathname.startsWith('/kaewsai') || request.nextUrl.pathname.startsWith('/admin')
    const isRoot = request.nextUrl.pathname === '/'
    const isWelcome = request.nextUrl.pathname === '/welcome'

    // Helper to redirect and copy cookies
    const redirectWithCookies = (path: string) => {
      const url = request.nextUrl.clone()
      url.pathname = path
      const redirectResponse = NextResponse.redirect(url)
      // Copy cookies from supabaseResponse to the new redirect response
      const supabaseCookies = supabaseResponse.cookies.getAll()
      supabaseCookies.forEach(({ name, value }) => {
        redirectResponse.cookies.set(name, value)
      })
      return redirectResponse
    }

    // 1. ถ้าเป็นหน้าแรกและยังไม่ได้ล็อกอิน -> ไปหน้า Sale Page
    if (isRoot && !user) {
      return redirectWithCookies('/welcome')
    }

    // 2. ถ้าอยู่หน้า Sale Page แต่ล็อกอินแล้ว -> ไปหน้า Dashboard (Root)
    if (isWelcome && user) {
      return redirectWithCookies('/')
    }

    // 3. ป้องกันหน้า Protected
    if (isProtectedRoute && !user) {
      return redirectWithCookies('/login')
    }

    // 4. ป้องกันหน้า Auth ถ้าล็อกอินแล้ว
    if (isAuthRoute && user) {
      return redirectWithCookies('/')
    }
  } catch (error) {
    // If there's an error in middleware, just continue to not break the app completely
    console.error('Middleware error:', error)
  }
  return supabaseResponse
}
