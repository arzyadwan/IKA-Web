// src/app/admin/mutations/page.tsx
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { processMutation } from "@/actions/admin"

export default async function AdminMutationsPage() {
  // 1. Cek Admin
  const session = await getSession()
  if (!session || (session.role !== 'region_admin' && session.role !== 'super_admin')) {
    redirect('/dashboard') // Tendang balik member biasa
  }

  // 2. Ambil Semua Request Pending
  // (Nanti di versi asli, Admin Jakarta hanya lihat request ke Jakarta.
  // Tapi untuk sekarang kita tampilkan semua agar Anda mudah testing).
  const pendingRequests = await prisma.regionMutation.findMany({
    where: { status: 'requested' },
    include: {
      user: {
        include: { profile: true }
      },
      fromRegion: true,
      toRegion: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Approval Mutasi</h1>
        
        {pendingRequests.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-slate-500">
              Tidak ada permintaan mutasi baru.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map((req) => (
              <Card key={req.id}>
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                  
                  {/* Info User */}
                  <div className="space-y-1">
                    <p className="font-bold text-lg">{req.user.profile?.fullName}</p>
                    <p className="text-sm text-slate-500">
                      Angkatan: {req.user.profile?.graduationYear} • WA: {req.user.profile?.phoneNumber}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <span className="bg-slate-200 px-2 py-1 rounded">
                        {req.fromRegion.name}
                      </span>
                      <span>➝</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">
                        {req.toRegion.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded border">
                      Alasan: &quot;{req.reason}&quot;
                    </p>
                  </div>

                  {/* Tombol Aksi */}
                  <div className="flex gap-2">
                    {/* Tombol Reject */}
                    <form action={async () => {
                      'use server'
                      await processMutation(req.id, 'rejected')
                    }}>
                      <Button variant="destructive" size="sm">Tolak</Button>
                    </form>

                    {/* Tombol Approve */}
                    <form action={async () => {
                      'use server'
                      await processMutation(req.id, 'approved')
                    }}>
                      <Button className="bg-green-600 hover:bg-green-700" size="sm">
                        Setujui
                      </Button>
                    </form>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}