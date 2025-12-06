import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { MutationForm } from "@/components/mutation-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, History, RefreshCw } from "lucide-react"

export default async function MutationPage() {
  const session = await getSession()
  if (!session || !session.userId) redirect('/login')

  const userId = parseInt(session.userId as string)

  const userProfile = await prisma.profile.findUnique({
    where: { userId },
    include: { region: true }
  })

  if (!userProfile) return <div>Profil error</div>

  const availableRegions = await prisma.region.findMany({
    where: { id: { not: userProfile.currentRegionId } },
    select: { id: true, name: true }
  })

  const history = await prisma.regionMutation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { fromRegion: true, toRegion: true }
  })

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mutasi Wilayah</h1>
            <p className="text-slate-500 text-sm">Ajukan perpindahan jika Anda menetap di kota baru.</p>
          </div>
        </div>

        {/* Info Lokasi Sekarang */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Wilayah Saat Ini</p>
              <h2 className="text-xl font-bold text-slate-900">{userProfile.region.name}</h2>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold">Aktif</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Kolom Kiri: Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold border-b pb-2">
              <RefreshCw className="w-4 h-4" /> Form Pengajuan
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <MutationForm regions={availableRegions} />
            </div>
          </div>

          {/* Kolom Kanan: History */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold border-b pb-2">
              <History className="w-4 h-4" /> Riwayat Mutasi
            </div>
            
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-400">Belum ada riwayat perpindahan.</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                        <span>{item.fromRegion.name}</span>
                        <span className="text-slate-400">→</span>
                        <span className="text-primary">{item.toRegion.name}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.reason}</p>
                      <p className="text-[10px] text-slate-400 mt-2">
                        Diajukan: {new Date(item.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                        item.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                        item.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-yellow-50 text-yellow-700 border-yellow-100'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}