// src/app/admin/users/page.tsx
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { verifyUser } from "@/actions/admin"

export default async function AdminUsersPage() {
  const session = await getSession()
  if (!session || !['region_admin', 'super_admin'].includes(session.role)) redirect('/dashboard')

  // Ambil user yang BELUM diverifikasi
  const unverifiedUsers = await prisma.user.findMany({
    where: { verificationStatus: { not: 'verified' } },
    include: { profile: { include: { region: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Verifikasi Anggota Baru</h1>
        <p className="text-slate-500">Daftar alumni yang menunggu persetujuan untuk akses penuh.</p>

        {unverifiedUsers.length === 0 ? (
          <div className="bg-white p-8 rounded shadow text-center text-slate-500">
            Tidak ada pendaftar baru yang menunggu verifikasi.
          </div>
        ) : (
          <div className="space-y-4">
            {unverifiedUsers.map((user) => (
              <div key={user.id} className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row justify-between items-center gap-4">
                
                {/* Info User */}
                <div>
                  <h3 className="font-bold text-lg">{user.profile?.fullName || 'Tanpa Nama'}</h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p>📧 {user.email}</p>
                    <p>📱 {user.profile?.phoneNumber}</p>
                    <p>🎓 Angkatan {user.profile?.graduationYear}</p>
                    <p className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Wilayah: {user.profile?.region.name}
                    </p>
                  </div>
                  {/* Tampilkan Bukti Foto jika nanti sudah ada fitur upload */}
                </div>

                {/* Tombol Aksi */}
                <form action={async () => {
                  'use server'
                  await verifyUser(user.id)
                }}>
                  <Button className="bg-green-600 hover:bg-green-700">
                    ✅ Verifikasi Akun
                  </Button>
                </form>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}