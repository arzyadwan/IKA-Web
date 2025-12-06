// src/actions/event.ts
'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// 1. Definisikan Tipe State (Pengganti 'any')
export type EventState = {
  message?: string;
  errors?: {
    title?: string[];
    description?: string[];
    location?: string[];
    eventDate?: string[];
    imageUrl?: string[];
    regionIds?: string[];
  };
}

// Schema Event
const EventSchema = z.object({
  title: z.string().min(5, "Judul terlalu pendek"),
  description: z.string().min(20, "Deskripsi terlalu pendek"),
  location: z.string().min(3, "Lokasi wajib diisi"),
  eventDate: z.string(), 
  imageUrl: z.string().optional(),
  regionIds: z.array(z.number()).min(1, "Pilih minimal 1 wilayah"),
})

// 2. Gunakan Tipe 'EventState | null' di parameter
export async function createEvent(prevState: EventState | null, formData: FormData): Promise<EventState> {
  const session = await getSession()
  if (!session || !['region_admin', 'super_admin'].includes(session.role)) {
    return { message: 'Akses ditolak.' }
  }

  // Handle Multi-Checkbox
  const rawRegionIds = formData.getAll('regionIds').map(id => parseInt(id as string))

  const validated = EventSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    location: formData.get('location'),
    eventDate: formData.get('eventDate'),
    imageUrl: formData.get('imageUrl'),
    regionIds: rawRegionIds,
  })

  if (!validated.success) {
    return { 
      message: 'Data event tidak valid.',
      errors: validated.error.flatten().fieldErrors
    }
  }

  const data = validated.data
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()

  try {
    await prisma.event.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        location: data.location,
        eventDate: new Date(data.eventDate),
        imageUrl: data.imageUrl || null,
        authorId: parseInt(session.userId as string), // Error ini akan hilang setelah npx prisma generate
        regions: {
          connect: data.regionIds.map((id) => ({ id }))
        }
      }
    })
  } catch (error) {
    // 3. Gunakan variabel error agar ESLint senang
    console.error("Gagal create event:", error)
    return { message: 'Gagal membuat event.' }
  }

  revalidatePath('/agenda')
  redirect('/agenda')
}

// --- ACTION UNTUK PARTISIPASI ---
export async function toggleParticipation(eventId: number) {
  const session = await getSession()
  if (!session || !session.userId) return { message: 'Wajib login' }

  const userId = parseInt(session.userId as string)

  try {
    const existing = await prisma.eventParticipant.findUnique({
      where: { eventId_userId: { eventId, userId } }
    })

    if (existing) {
      await prisma.eventParticipant.delete({ where: { id: existing.id } })
      revalidatePath(`/agenda/${eventId}`)
      return { status: 'left' }
    } else {
      await prisma.eventParticipant.create({ data: { eventId, userId } })
      revalidatePath(`/agenda/${eventId}`)
      return { status: 'joined' }
    }
  } catch (error) {
    console.error("Participation error:", error)
    return { message: 'Error system' }
  }
}