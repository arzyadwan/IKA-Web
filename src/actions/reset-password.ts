// src/actions/reset-password.ts
'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// 1. Definisikan Tipe State
export type ResetState = {
  message?: string;
  status?: 'success' | 'error';
}

// Fungsi 1: User minta link reset
// 2. Gunakan 'ResetState | null' menggantikan 'any'
export async function requestReset(prevState: ResetState | null, formData: FormData): Promise<ResetState> {
  const email = formData.get('email') as string

  // Cek validitas email
  if (!email || !email.includes('@')) {
    return { message: 'Email tidak valid.', status: 'error' }
  }

  const user = await prisma.user.findUnique({ where: { email } })
  
  if (!user) {
    // Security: Pesan ambigu agar tidak bocor info user
    return { message: 'Jika email terdaftar, link reset telah dikirim.', status: 'success' }
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expiry = new Date(Date.now() + 3600000) // 1 jam

  await prisma.user.update({
    where: { id: user.id },
    data: { 
      resetToken: token,
      resetTokenExpiry: expiry
    }
  })

  // SIMULASI LINK (Cek Terminal)
  const resetLink = `http://localhost:3000/reset-password?token=${token}`
  
  console.log("========================================")
  console.log("LINK RESET PASSWORD (Klik ini):")
  console.log(resetLink)
  console.log("========================================")

  return { message: 'Cek terminal/email Anda untuk link reset.', status: 'success' }
}

// Fungsi 2: User input password baru
// 3. Gunakan 'ResetState | null' menggantikan 'any'
export async function performReset(prevState: ResetState | null, formData: FormData): Promise<ResetState> {
  const token = formData.get('token') as string
  const newPassword = formData.get('password') as string

  if (!newPassword || newPassword.length < 6) {
    return { message: 'Password minimal 6 karakter.', status: 'error' }
  }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() }
    }
  })

  if (!user) {
    return { message: 'Link reset tidak valid atau sudah kadaluarsa.', status: 'error' }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    }
  })

  return { message: 'Password berhasil diubah! Silakan login.', status: 'success' }
}