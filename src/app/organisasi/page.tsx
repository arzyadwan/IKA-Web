import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Award, Briefcase } from "lucide-react"

export default async function OrganizationPublicPage() {
  // Ambil data wilayah + pengurusnya
  const regions = await prisma.region.findMany({
    include: {
      orgMembers: {
        orderBy: { order: 'asc' }
      }
    }
  })

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-white border-b border-slate-100 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Struktur Organisasi
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Mengenal wajah-wajah di balik layar yang menggerakkan roda organisasi IKA Al-Ikhlas di berbagai wilayah.
          </p>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regions.map((region) => (
            <Card key={region.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
              
              {/* Region Header */}
              <div className="bg-gradient-to-r from-primary to-emerald-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <h2 className="text-xl font-bold relative z-10 flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                  {region.name}
                </h2>
                <p className="text-white/80 text-xs mt-1 relative z-10 font-medium tracking-wide uppercase">
                  Dewan Pengurus Wilayah
                </p>
              </div>

              <CardContent className="p-0 flex-1 bg-white">
                {region.orgMembers.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm italic">Struktur belum dibentuk.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-50">
                    {region.orgMembers.map((member, index) => (
                      <li key={member.id} className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors group">
                        
                        {/* Avatar / Number */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                          index === 0 
                            ? "bg-accent text-white" // Warna Emas untuk Ketua (Urutan 1)
                            : "bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                        }`}>
                          {member.imageUrl ? (
                            // Jika nanti ada foto, bisa pakai <img> di sini
                            <span>IMG</span> 
                          ) : (
                            member.name.charAt(0)
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-slate-800 truncate ${index === 0 ? 'text-lg' : 'text-base'}`}>
                            {member.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {index === 0 && <Award className="w-3 h-3 text-accent" />}
                            <p className={`text-xs font-medium uppercase tracking-wide truncate ${
                              index === 0 ? 'text-accent' : 'text-slate-500'
                            }`}>
                              {member.position}
                            </p>
                          </div>
                        </div>

                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              
              {/* Footer Card (Optional Decorative) */}
              <div className="bg-slate-50 p-3 border-t border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                  Periode Aktif
                </span>
              </div>

            </Card>
          ))}
        </div>
      </div>

    </div>
  )
}