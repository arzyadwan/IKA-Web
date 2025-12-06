import prisma from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/session"
import { Calendar, MapPin, ArrowRight, Plus } from "lucide-react"

export default async function AgendaListPage() {
  const session = await getSession()
  const isAdmin = ['region_admin', 'super_admin'].includes(session?.role || '')

  const events = await prisma.event.findMany({
    orderBy: { eventDate: 'asc' }, // Yang terdekat di atas
    include: { regions: true }
  })

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-20">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Agenda Kegiatan</h1>
              <p className="text-slate-500 mt-1">Jadwal acara, reuni, dan kolaborasi antar wilayah.</p>
            </div>
            
            {isAdmin && (
              <Link href="/admin/events/create">
                <Button className="rounded-full shadow-lg hover:shadow-xl transition-all">
                  <Plus className="w-4 h-4 mr-2" /> Buat Agenda Baru
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-bold text-lg text-slate-700">Belum ada agenda</h3>
            <p className="text-slate-500 text-sm">Nantikan kegiatan seru dari pengurus wilayah Anda.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((item) => {
              const dateObj = new Date(item.eventDate)
              const month = dateObj.toLocaleDateString('id-ID', { month: 'short' })
              const day = dateObj.getDate()
              
              return (
                <Link key={item.id} href={`/agenda/${item.slug}`} className="group block h-full">
                  <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    
                    {/* Image Area */}
                    <div className="h-48 bg-slate-200 relative overflow-hidden">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                          <Calendar className="w-10 h-10 opacity-20" />
                        </div>
                      )}
                      
                      {/* Date Badge (Kotak Tanggal) */}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl p-2 text-center min-w-[60px] shadow-sm border border-slate-100">
                        <div className="text-xs font-bold text-red-500 uppercase tracking-wider">{month}</div>
                        <div className="text-xl font-extrabold text-slate-900 leading-none mt-0.5">{day}</div>
                      </div>

                      {/* Region Badge */}
                      <div className="absolute bottom-3 left-3 flex gap-1 flex-wrap">
                        {item.regions.slice(0, 2).map(r => (
                          <span key={r.id} className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full">
                            {r.name}
                          </span>
                        ))}
                        {item.regions.length > 2 && (
                          <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full">
                            +{item.regions.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h2 className="font-bold text-lg text-slate-900 mb-2 leading-snug group-hover:text-primary transition-colors">
                        {item.title}
                      </h2>
                      
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                        <span className="line-clamp-1">{item.location}</span>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-sm">
                        <span className="text-primary font-semibold group-hover:underline">Lihat Detail</span>
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </div>
                    </div>

                  </div>
                </Link>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}