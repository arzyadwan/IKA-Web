// src/actions/gallery.ts
'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// 1. Definisikan Tipe State Output
export type GalleryState = {
  message?: string;
  status?: 'success' | 'error';
}

// 2. Definisikan Tipe Input (Payload) menggantikan 'any'
type AlbumPayload = {
  title: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  eventDate: FormDataEntryValue | null;
  regionId: number;
  imageUrls: string[];
}

const AlbumSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  eventDate: z.string(),
  regionId: z.number(),
  imageUrls: z.array(z.string()).min(1, "Minimal upload 1 foto"),
})

// 3. Gunakan tipe 'AlbumPayload' di parameter kedua
export async function createAlbum(prevState: GalleryState | null, data: AlbumPayload): Promise<GalleryState> {
  const session = await getSession()
  if (!session || !['region_admin', 'super_admin'].includes(session.role)) {
    return { message: 'Akses ditolak.', status: 'error' }
  }

  // Validasi data
  const validated = AlbumSchema.safeParse({
    title: data.title,
    description: data.description,
    eventDate: data.eventDate,
    regionId: data.regionId,
    imageUrls: data.imageUrls
  })

  if (!validated.success) {
    return { message: 'Data tidak valid.', status: 'error' }
  }

  const { title, description, eventDate, regionId, imageUrls } = validated.data
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()

  try {
    // Transaction: Buat Album dulu, lalu masukkan semua Foto
    await prisma.galleryAlbum.create({
      data: {
        title,
        slug,
        description,
        eventDate: new Date(eventDate),
        regionId,
        // Cara insert child relation sekaligus
        images: {
          create: imageUrls.map((url) => ({ imageUrl: url }))
        }
      }
    })
  } catch (error) {
    console.error(error)
    return { message: 'Gagal membuat album.', status: 'error' }
  }

  revalidatePath('/galeri')
  redirect('/galeri')
}