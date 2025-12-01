// src/actions/organization.ts
'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

// 1. Definisikan Tipe State untuk respon Server Action
export type OrgState = {
  message?: string;
  status?: 'success' | 'error';
}

// Skema Validasi
const OrgSchema = z.object({
  name: z.string().min(3),
  position: z.string().min(3),
  regionId: z.string().transform((val) => parseInt(val)),
  order: z.string().transform((val) => parseInt(val)).optional(),
})

// 2. Gunakan tipe 'OrgState | null' menggantikan 'any'
export async function addOfficer(prevState: OrgState | null, formData: FormData): Promise<OrgState> {
  // A. Cek Admin
  const session = await getSession()
  if (!session || (session.role !== 'region_admin' && session.role !== 'super_admin')) {
    return { message: 'Akses ditolak.', status: 'error' }
  }

  // B. Validasi Input
  const validated = OrgSchema.safeParse({
    name: formData.get('name'),
    position: formData.get('position'),
    regionId: formData.get('regionId'),
    order: formData.get('order') || '100', // Default urutan 100
  })

  if (!validated.success) return { message: 'Data tidak valid.', status: 'error' }

  const { name, position, regionId, order } = validated.data

  try {
    // C. Simpan ke Database
    await prisma.orgMember.create({
      data: { name, position, regionId, order }
    })
    
    revalidatePath('/admin/organization')
    return { message: 'Berhasil menambah pengurus!', status: 'success' }
  } catch (e) {
    console.error(e)
    return { message: 'Gagal menyimpan database.', status: 'error' }
  }
}

export async function deleteOfficer(id: number) {
  const session = await getSession()
  if (!session || !['region_admin', 'super_admin'].includes(session.role)) return

  await prisma.orgMember.delete({ where: { id } })
  revalidatePath('/admin/organization')
}