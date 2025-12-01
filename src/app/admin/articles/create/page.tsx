// src/app/admin/articles/create/page.tsx
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ArticleForm } from "./article-form"

export default async function CreateArticlePage() {
  const session = await getSession()
  if (!session || !['region_admin', 'super_admin'].includes(session.role)) redirect('/dashboard')

  const regions = await prisma.region.findMany({
    select: { id: true, name: true }
  })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Tulis Berita / Artikel Baru</h1>
        <ArticleForm regions={regions} />
      </div>
    </div>
  )
}