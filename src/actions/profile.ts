// src/actions/profile.ts
'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Skema Validasi
const ProfileSchema = z.object({
  profession: z.string().optional(),
  bloodType: z.string().optional(),
  address: z.string().optional(),
  santriId: z.string().optional(),
  instagram: z.string().optional(), // Tambahan sosial media
})

export type ProfileState = {
  message?: string;
  status?: 'success' | 'error';
}

export async function updateProfile(prevState: ProfileState | null, formData: FormData): Promise<ProfileState> {
  const session = await getSession()
  if (!session || !session.userId) return { message: 'Sesi habis', status: 'error' }

  const validatedData = ProfileSchema.safeParse({
    profession: formData.get('profession'),
    bloodType: formData.get('bloodType'),
    address: formData.get('address'),
    santriId: formData.get('santriId'),
  })

  if (!validatedData.success) {
    return { message: 'Format data salah', status: 'error' }
  }

  try {
    await prisma.profile.update({
      where: { userId: parseInt(session.userId as string) },
      data: {
        profession: validatedData.data.profession,
        bloodType: validatedData.data.bloodType,
        address: validatedData.data.address,
        santriId: validatedData.data.santriId,
      }
    })

    revalidatePath('/dashboard')
    return { message: 'Profil berhasil diperbarui!', status: 'success' }

  } catch (error) {
    return { message: 'Gagal menyimpan data.', status: 'error' }
  }
}