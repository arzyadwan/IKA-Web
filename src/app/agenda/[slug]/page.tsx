import prisma from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { toggleParticipation } from "@/actions/event"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Clock, Share2, Users } from "lucide-react"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function EventDetailPage(props: Props) {
  const params = await props.params
  const session = await getSession()
  const userId = session?.userId ? parseInt(session.userId as string) : null

  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    include: {
      regions: true,
      participants: {
        include: { user: { include: { profile: true } } }
      }
    }
  })

  if (!event) return <div className="p-20 text-center">Agenda tidak ditemukan</div>

  const isJoined = userId ? event.participants.some(p => p.userId === userId) : false
  const eventDate = new Date(event.eventDate)

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- HERO IMAGE (Full Width) --- */}
      <div className="w-full h-[40vh] md:h-[50vh] bg-slate-900 relative overflow-hidden">
        {event.imageUrl ? (
          <img src={event.imageUrl} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        {/* Judul di atas gambar (Mobile & Desktop) */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <Link href="/agenda" className="text-white/80 hover:text-white flex items-center gap-2 text-sm mb-4">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Agenda
            </Link>
            
            <div className="flex gap-2 mb-4">
              {event.regions.map(r => (
                <span key={r.id} className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white/20">
                  {r.name}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight shadow-sm max-w-4xl">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* --- KOLOM KIRI (Konten) --- */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Metadata (Mobile Only - Hidden in Desktop) */}
            <div className="lg:hidden space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">{eventDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-sm text-slate-500">Pukul {eventDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <p className="font-bold text-slate-900">{event.location}</p>
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Tentang Acara Ini</h3>
              <article className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </article>
            </div>

            {/* List Peserta (Preview) */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center justify-between">
                <span>Peserta Terdaftar</span>
                <span className="text-sm font-normal bg-slate-100 px-2 py-1 rounded text-slate-600">
                  {event.participants.length} Orang
                </span>
              </h3>
              
              {event.participants.length === 0 ? (
                <p className="text-sm text-slate-500 italic">Belum ada peserta. Jadilah yang pertama!</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {event.participants.slice(0, 10).map((p) => (
                    <div key={p.id} className="relative group cursor-default">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-white shadow-sm flex items-center justify-center text-xs font-bold text-primary hover:scale-110 transition-transform">
                        {p.user.profile?.fullName.charAt(0)}
                      </div>
                      {/* Tooltip Nama */}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                        {p.user.profile?.fullName}
                      </span>
                    </div>
                  ))}
                  {event.participants.length > 10 && (
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-500">
                      +{event.participants.length - 10}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* --- KOLOM KANAN (Sticky Action Card) --- */}
          <div className="hidden lg:block relative">
            <div className="sticky top-24 space-y-6">
              
              {/* Card RSVP */}
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 font-medium">Tanggal & Waktu</p>
                        <p className="font-bold text-slate-900">
                          {eventDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-sm text-slate-600">
                          {eventDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 font-medium">Lokasi</p>
                        <p className="font-bold text-slate-900 leading-snug">{event.location}</p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Tombol Aksi */}
                  {userId ? (
                    <form action={async () => {
                      'use server'
                      await toggleParticipation(event.id)
                    }}>
                      <Button 
                        className={`w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all ${
                          isJoined 
                            ? "bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200" 
                            : "bg-primary hover:bg-primary/90 text-white"
                        }`}
                      >
                        {isJoined ? "Batalkan Kehadiran" : "Saya Akan Hadir"}
                      </Button>
                    </form>
                  ) : (
                    <Link href="/login">
                      <Button variant="outline" className="w-full h-12 border-primary text-primary hover:bg-primary/5 font-bold">
                        Login untuk Mendaftar
                      </Button>
                    </Link>
                  )}

                  <p className="text-xs text-center text-slate-400">
                    {isJoined ? "Tiket masuk telah dikirim ke email Anda (Simulasi)." : "Slot terbatas. Amankan kursi Anda segera."}
                  </p>
                </div>
              </div>

              {/* Share Card (Optional) */}
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 cursor-pointer hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" /> Bagikan Acara Ini
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* --- MOBILE FLOATING ACTION BUTTON (Hanya muncul di HP) --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40">
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-xs text-slate-500 uppercase font-bold">Status</p>
            <p className={`font-bold ${isJoined ? 'text-green-600' : 'text-slate-900'}`}>
              {isJoined ? 'Terdaftar ✅' : 'Belum Daftar'}
            </p>
          </div>
          <div className="flex-1">
             {userId ? (
                <form action={async () => {
                  'use server'
                  await toggleParticipation(event.id)
                }}>
                  <Button className={`w-full ${isJoined ? 'bg-red-50 text-red-600' : 'bg-primary'}`}>
                    {isJoined ? "Batal" : "Hadir"}
                  </Button>
                </form>
             ) : (
               <Link href="/login"><Button className="w-full">Login</Button></Link>
             )}
          </div>
        </div>
      </div>

    </div>
  )
}