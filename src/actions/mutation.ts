// src/actions/mutation.ts
'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Tipe data untuk respon form
export type MutationState = {
  errors?: {
    targetRegionId?: string[];
    reason?: string[];
  };
  message?: string;
}

const MutationSchema = z.object({
  targetRegionId: z.string().transform((val) => parseInt(val)),
  reason: z.string().min(5, 'Alasan/Alamat baru wajib diisi detail'),
})

export async function requestMutation(prevState: MutationState | null, formData: FormData): Promise<MutationState> {
  // 1. Cek User Login
  const session = await getSession()
  if (!session || !session.userId) {
    return { message: 'Sesi habis. Silakan login ulang.' }
  }

  const userId = parseInt(session.userId as string)

  // 2. Validasi Input
  const validatedFields = MutationSchema.safeParse({
    targetRegionId: formData.get('targetRegionId'),
    reason: formData.get('reason'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { targetRegionId, reason } = validatedFields.data

  try {
    // 3. Cek Data User Saat Ini
    const userProfile = await prisma.profile.findUnique({
      where: { userId }
    })

    if (!userProfile) return { message: 'Profil tidak ditemukan' }

    if (userProfile.currentRegionId === targetRegionId) {
      return { message: 'Anda sudah berada di wilayah tersebut.' }
    }

    // 4. Cek apakah ada request pending? (Agar tidak spam)
    const existingRequest = await prisma.regionMutation.findFirst({
      where: {
        userId,
        status: 'requested'
      }
    })

    if (existingRequest) {
      return { message: 'Anda masih memiliki pengajuan mutasi yang belum diproses.' }
    }

    // 5. Simpan Request ke Database
    await prisma.regionMutation.create({
      data: {
        userId,
        fromRegionId: userProfile.currentRegionId,
        toRegionId: targetRegionId,
        reason,
        status: 'requested'
      }
    })

    // 6. Refresh Halaman
    revalidatePath('/dashboard/mutation')
    
  } catch (error) {
    console.error('Mutation Error:', error)
    return { message: 'Gagal mengajukan mutasi.' }
  }

  // Redirect atau stay di halaman (kita pilih stay agar bisa lihat status)
  return { message: 'Berhasil! Pengajuan mutasi dikirim.' }
}