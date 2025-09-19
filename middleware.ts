import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

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
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ['/lessons']

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    const { data: { user } } = await supabase.auth.getUser()

    console.log(`[MIDDLEWARE] Protected route: ${pathname}, User: ${user ? user.email : 'null'}`)

    if (!user) {
      console.log(`[MIDDLEWARE] Redirecting unauthenticated user from ${pathname} to /login`)
      // Redirect to login if user is not authenticated
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // If user is authenticated and tries to access auth pages, redirect to lessons
  if (pathname === '/login' || pathname === '/signup') {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      return NextResponse.redirect(new URL('/lessons', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}