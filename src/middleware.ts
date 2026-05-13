import { type NextRequest, NextResponse } from 'next/server'
import { verifySession, SESSION_COOKIE } from '@/lib/session'

// Routes that anyone can access without a session
const PUBLIC_PATHS = ['/login', '/register', '/welcome', '/api/auth/member-login', '/api/auth/admin-login']

// Routes that require the admin role
const ADMIN_PATHS = ['/admin', '/api/admin', '/api/knowledge']

// Routes that require any valid session
const PROTECTED_PATHS = ['/profile', '/journal', '/community', '/kaewsai', '/library', '/card', '/topics', '/ai', '/reflect', '/smart', '/strategic', '/swot', '/case', '/wimee', '/export', '/admin']

function matchesAny(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(`${p}?`))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow static assets and public API routes through immediately
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)
  ) {
    return NextResponse.next()
  }

  // Read and verify the session token
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? null
  const session = token ? await verifySession(token) : null

  const isPublic    = matchesAny(pathname, PUBLIC_PATHS)
  const isProtected = matchesAny(pathname, PROTECTED_PATHS)
  const isAdminPath = matchesAny(pathname, ADMIN_PATHS)
  const isRoot      = pathname === '/'
  const isWelcome   = pathname === '/welcome'

  // Helper: redirect while preserving search params
  const redirect = (path: string) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    url.search = ''
    return NextResponse.redirect(url)
  }

  // 1. Root without session → welcome page
  if (isRoot && !session) return redirect('/welcome')

  // 2. Welcome page with active session → home
  if (isWelcome && session) return redirect('/')

  // 3. Login/register with active session → dashboard
  // Only redirect if we are not already going to a protected path that might fail
  if (isPublic && session) {
    const target = session.type === 'admin' ? '/admin/users' : '/'
    // If already at target, don't redirect again
    if (pathname === target) return NextResponse.next()
    return redirect(target)
  }

  // 4. Protected route without session → login
  if (isProtected && !session) {
    // If already at login, don't redirect again
    if (pathname === '/login') return NextResponse.next()
    return redirect('/login')
  }

  // 5. Admin-only routes: require admin session
  const hasAdminRole = session?.type === 'admin'
  if (isAdminPath && !hasAdminRole) {
    return redirect('/')
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
