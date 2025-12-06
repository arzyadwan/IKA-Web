// src/app/agenda/page.tsx
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/session"

export default async function AgendaListPage() {
  const session = await getSession()
  const isAdmin = ['region_admin', 'super_admin'].includes(session?.role || '')

  const events = await prisma.event.findMany({
    orderBy: { eventDate: 'asc' },
    include: { regions: true }
  })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Agenda Kegiatan</h1>
            <p className="text-slate-500">Jadwal acara dan kolaborasi antar wilayah.</p>
          </div>
          
          {isAdmin && (
            <Link href="/admin/events/create">
              <Button>+ Buat Agenda</Button>
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((item) => (
            <Link key={item.id} href={`/agenda/${item.slug}`}>
              <Card className="h-full hover:shadow-lg transition overflow-hidden">
                <div className="h-48 bg-slate-800 w-full relative">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover opacity-80" />
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {item.regions.map(r => (
                       <span key={r.id} className="bg-white/90 px-2 py-1 text-xs font-bold rounded text-slate-900">
                         {r.name}
                       </span>
                    ))}
                  </div>
                </div>
                
                <CardContent className="p-5">
                  <div className="text-xs text-blue-600 font-bold mb-2 uppercase tracking-wide">
                    {new Date(item.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h2 className="font-bold text-xl mb-2 line-clamp-2">{item.title}</h2>
                  <p className="text-slate-600 text-sm line-clamp-2">
                    {item.location}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            Belum ada agenda kegiatan.
          </div>
        )}

      </div>
    </div>
  )
}