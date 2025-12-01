// src/actions/article.ts
'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// 1. Definisikan tipe State agar tidak pakai 'any'
export type ArticleState = {
  message?: string;
  errors?: {
    title?: string[];
    content?: string[];
    imageUrl?: string[];
    regionId?: string[];
  };
}

const ArticleSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  content: z.string().min(20, "Konten terlalu pendek"),
  imageUrl: z.string().optional(),
  regionId: z.string().transform((val) => parseInt(val)),
})

// 2. Gunakan tipe 'ArticleState | null' di parameter fungsi
export async function createArticle(prevState: ArticleState | null, formData: FormData): Promise<ArticleState> {
  const session = await getSession()
  
  // Cek Role
  if (!session || !['region_admin', 'super_admin'].includes(session.role)) {
    return { message: 'Akses ditolak.' }
  }

  const validated = ArticleSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    imageUrl: formData.get('imageUrl'),
    regionId: formData.get('regionId'),
  })

  if (!validated.success) {
    return { 
      message: 'Input tidak valid.',
      errors: validated.error.flatten().fieldErrors
    }
  }

  const { title, content, imageUrl, regionId } = validated.data
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
  const excerpt = content.substring(0, 150) + '...'

  try {
    await prisma.article.create({
      data: {
        title, 
        slug, 
        content, 
        excerpt,
        imageUrl: imageUrl || null,
        regionId,
        authorId: parseInt(session.userId as string)
      }
    })
  } catch (error) { 
    // 3. Gunakan variabel error agar ESLint tidak protes
    console.error("Gagal membuat artikel:", error)
    return { message: 'Gagal post berita.' }
  }

  revalidatePath('/berita')
  redirect('/berita')
}