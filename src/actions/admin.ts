// src/actions/admin.ts
'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function processMutation(mutationId: number, decision: 'approved' | 'rejected') {
  // 1. Cek Security (Hanya Admin yang boleh)
  const session = await getSession()
  if (!session || (session.role !== 'region_admin' && session.role !== 'super_admin')) {
    return { message: 'Akses ditolak. Anda bukan Admin.' }
  }

  try {
    // 2. Database Transaction (Wajib Atomic)
    await prisma.$transaction(async (tx) => {
      
      // A. Update Status Mutasi
      const mutation = await tx.regionMutation.update({
        where: { id: mutationId },
        data: { status: decision }
      })

      // B. Jika Disetujui, Pindahkan Usernya
      if (decision === 'approved') {
        await tx.profile.update({
          where: { userId: mutation.userId },
          data: { 
            currentRegionId: mutation.toRegionId,
            updatedAt: new Date()
           }
        })
      }
    })

    // 3. Refresh Halaman
    revalidatePath('/admin/mutations')
    return { message: `Berhasil ${decision === 'approved' ? 'menyetujui' : 'menolak'} mutasi.` }

  } catch (error) {
    console.error('Admin Error:', error)
    return { message: 'Gagal memproses data.' }
  }
}

export async function verifyUser(targetUserId: number) {
  const session = await getSession()
  // Hanya Admin yang boleh
  if (!session || !['region_admin', 'super_admin'].includes(session.role)) {
    return { message: 'Akses ditolak.' }
  }

  try {
    await prisma.user.update({
      where: { id: targetUserId },
      data: { verificationStatus: 'verified' }
    })
    
    revalidatePath('/admin/users') // Kita akan buat halaman ini sebentar lagi
    return { message: 'User berhasil diverifikasi.' }
  } catch (error) {
    return { message: 'Gagal memverifikasi user.' }
  }
}