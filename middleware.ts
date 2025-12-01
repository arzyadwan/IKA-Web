// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
  // 1. Ambil session dari cookies
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value

  // 2. Tentukan halaman yang diproteksi dan public
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')

  // 3. Logika Redirect
  
  // Jika mau ke Dashboard tapi tidak ada session -> Tendang ke Login
  if (isDashboard && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Jika sudah Login tapi mau buka Login/Register -> Tendang ke Dashboard
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Tentukan rute mana saja yang kena middleware ini
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}