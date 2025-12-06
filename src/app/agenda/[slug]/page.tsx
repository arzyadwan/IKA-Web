// src/app/agenda/[slug]/page.tsx
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { toggleParticipation } from "@/actions/event"

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  // Await params untuk Next.js 15
  const { slug } = await params
  const session = await getSession()
  const userId = session?.userId ? parseInt(session.userId as string) : null

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      regions: true, // Ambil siapa saja penyelenggaranya
      participants: true, // Ambil semua peserta untuk dihitung
    }
  })

  if (!event) return <div>Agenda tidak ditemukan</div>

  // Cek apakah user ini sudah join?
  const isJoined = userId ? event.participants.some(p => p.userId === userId) : false

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        
        {/* Banner */}
        <div className="h-64 bg-slate-800 relative">
          {event.imageUrl && <img src={event.imageUrl} className="w-full h-full object-cover opacity-80" />}
          <div className="absolute bottom-0 left-0 p-6 text-white">
            {/* List Penyelenggara */}
            <div className="flex gap-2 mb-2">
              {event.regions.map(r => (
                <span key={r.id} className="bg-blue-600 text-xs font-bold px-2 py-1 rounded">
                  {r.name}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-3 gap-8">
          
          {/* Kolom Kiri: Deskripsi */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Deskripsi Kegiatan</h3>
              <p className="whitespace-pre-line text-slate-700 leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Info & Action */}
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded border">
              <div className="mb-4">
                <p className="text-xs text-slate-500 font-bold uppercase">Waktu</p>
                <p className="font-medium">
                  {new Date(event.eventDate).toLocaleDateString('id-ID', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })} WIB
                </p>
              </div>
              <div className="mb-4">
                <p className="text-xs text-slate-500 font-bold uppercase">Lokasi</p>
                <p className="font-medium">{event.location}</p>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-center text-sm mb-2 text-slate-500">
                  <span className="font-bold text-slate-900 text-lg">{event.participants.length}</span> Alumni mendaftar
                </p>
                
                {userId ? (
                  <form action={async () => {
                    'use server'
                    await toggleParticipation(event.id)
                  }}>
                    <Button 
                      className={`w-full ${isJoined ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-blue-600"}`}
                      variant={isJoined ? "outline" : "default"}
                    >
                      {isJoined ? "Batalkan Kehadiran" : "Saya Akan Hadir"}
                    </Button>
                  </form>
                ) : (
                  <Button disabled className="w-full">Login untuk Daftar</Button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}