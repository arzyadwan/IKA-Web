// src/actions/activity.ts
'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// 1. Definisikan Tipe State
export type ActivityState = {
  errors?: {
    title?: string[];
    content?: string[];
    imageUrl?: string[];
    regionId?: string[];
  };
  message?: string;
}

const ActivitySchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter'),
  content: z.string().min(20, 'Isi konten terlalu pendek'),
  imageUrl: z.string().optional(),
  regionId: z.string().transform((val) => parseInt(val)),
})

// 2. Gunakan tipe ActivityState | null menggantikan 'any'
export async function createActivity(prevState: ActivityState | null, formData: FormData): Promise<ActivityState> {
  const session = await getSession()
  if (!session || (session.role !== 'region_admin' && session.role !== 'super_admin')) {
    return { message: 'Akses ditolak.' }
  }

  const validatedFields = ActivitySchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    imageUrl: formData.get('imageUrl'),
    regionId: formData.get('regionId'),
  })

  if (!validatedFields.success) {
    return { 
      message: 'Input tidak valid.',
      errors: validatedFields.error.flatten().fieldErrors 
    }
  }

  const { title, content, imageUrl, regionId } = validatedFields.data

  const slug = title.toLowerCase().replace(/ /g, '-') + '-' + Date.now()
  const excerpt = content.substring(0, 150) + '...'

  try {
    await prisma.activity.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        imageUrl: imageUrl || 'https://via.placeholder.com/800x400',
        regionId,
        authorId: parseInt(session.userId as string)
      }
    })
  } catch (error) {
    console.error('Create Activity Error:', error)
    return { message: 'Gagal membuat berita.' }
  }

  revalidatePath('/kegiatan')
  redirect('/kegiatan')
}