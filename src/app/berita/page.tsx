// src/app/berita/page.tsx
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/session"

export default async function ArticleListPage() {
  const session = await getSession()
  const isAdmin = ['region_admin', 'super_admin'].includes(session?.role || '')

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    include: { region: true, author: { include: { profile: true } } }
  })

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end border-b pb-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Kabar Al-Ikhlas</h1>
            <p className="text-slate-500 mt-2">Inspirasi, Opini, dan Kabar Terbaru Alumni.</p>
          </div>
          {isAdmin && (
            <Link href="/admin/articles/create">
              <Button>+ Tulis Artikel</Button>
            </Link>
          )}
        </div>

        <div className="space-y-8">
          {articles.length === 0 ? (
            <p className="text-slate-500 italic">Belum ada artikel yang diterbitkan.</p>
          ) : (
            articles.map((article) => (
              <div key={article.id} className="flex flex-col md:flex-row gap-6 group">
                
                {/* Gambar Thumbnail (Sebelah Kiri) */}
                <div className="w-full md:w-1/3 aspect-video bg-slate-100 rounded-lg overflow-hidden relative">
                  {article.imageUrl ? (
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300 font-bold">AL-IKHLAS</div>
                  )}
                </div>

                {/* Konten (Sebelah Kanan) */}
                <div className="w-full md:w-2/3 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2 text-xs">
                    <span className="font-bold text-blue-600 uppercase tracking-wider">{article.region.name}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{new Date(article.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
                  </div>
                  
                  <Link href={`/berita/${article.slug}`}>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition">
                      {article.title}
                    </h2>
                  </Link>
                  
                  <p className="text-slate-600 leading-relaxed line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                      {article.author.profile?.fullName.charAt(0)}
                    </div>
                    <span>{article.author.profile?.fullName || 'Admin'}</span>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}