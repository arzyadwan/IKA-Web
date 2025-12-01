// src/lib/session.ts
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.SESSION_SECRET || 'rahasia-negara-jangan-disebar'
const encodedKey = new TextEncoder().encode(secretKey)

type SessionPayload = {
  userId: string
  role: string
  expiresAt: Date
}

export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 hari
  
  const session = await new SignJWT({ userId, role, expiresAt })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
 
  // PERBAIKAN: Tambahkan 'await' sebelum cookies()
  const cookieStore = await cookies()
  
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession() {
  // PERBAIKAN: Tambahkan 'await'
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  
  if (!session) return null
 
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as SessionPayload
  } catch (error) {
    console.log('Failed to verify session')
    return null
  }
}

export async function deleteSession() {
  // PERBAIKAN: Tambahkan 'await'
  const cookieStore = await cookies()
  cookieStore.delete('session')
}