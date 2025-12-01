// src/app/dashboard/mutation/page.tsx
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { MutationForm } from "@/components/mutation-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function MutationPage() {
  const session = await getSession()
  if (!session || !session.userId) redirect('/login')

  const userId = parseInt(session.userId as string)

  // 1. Ambil Profil User (untuk tahu dia sekarang dimana)
  const userProfile = await prisma.profile.findUnique({
    where: { userId },
    include: { region: true }
  })

  if (!userProfile) return <div>Profil error</div>

  // 2. Ambil Daftar Wilayah (KECUALI wilayah dia sekarang)
  const availableRegions = await prisma.region.findMany({
    where: {
      id: { not: userProfile.currentRegionId }
    },
    select: { id: true, name: true }
  })

  // 3. Ambil Riwayat Pengajuan Mutasi User Ini
  const history = await prisma.regionMutation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { 
      fromRegion: true,
      toRegion: true 
    }
  })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Tombol Kembali */}
        <Link href="/dashboard">
          <Button variant="outline" size="sm">← Kembali ke Dashboard</Button>
        </Link>

        <h1 className="text-2xl font-bold">Mutasi Wilayah</h1>
        <p className="text-slate-500">
          Saat ini Anda tercatat sebagai anggota: <span className="font-semibold text-black">{userProfile.region.name}</span>
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Kolom Kiri: Form Pengajuan */}
          <div>
            <MutationForm regions={availableRegions} />
          </div>

          {/* Kolom Kanan: Riwayat Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Riwayat Pengajuan</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-sm text-slate-500 italic">Belum ada riwayat mutasi.</p>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">
                            {item.fromRegion.name} → {item.toRegion.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            &quot;{item.reason}&quot;
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(item.createdAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          item.status === 'approved' ? 'bg-green-100 text-green-700' :
                          item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.status === 'approved' ? 'Disetujui' : 
                           item.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}