// src/app/admin/organization/page.tsx
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AddOfficerForm } from "./add-form" 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteOfficer } from "@/actions/organization"

export default async function OrganizationAdminPage() {
  const session = await getSession()
  if (!session || !['region_admin', 'super_admin'].includes(session.role)) redirect('/dashboard')

  const regions = await prisma.region.findMany()
  
  // Ambil semua pengurus, urutkan berdasarkan Wilayah lalu Urutan Jabatan
  const officers = await prisma.orgMember.findMany({
    orderBy: [
      { regionId: 'asc' },
      { order: 'asc' }
    ],
    include: { region: true }
  })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI: FORM TAMBAH */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Pengurus</CardTitle>
            </CardHeader>
            <CardContent>
              <AddOfficerForm regions={regions} />
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN: DAFTAR PENGURUS */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Struktur Organisasi Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              {officers.length === 0 ? (
                <p className="text-slate-500 text-center py-4">Belum ada pengurus.</p>
              ) : (
                <div className="space-y-6">
                  {/* Grouping tampilan per wilayah bisa dilakukan di JS, tapi kita list simple dulu */}
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-3">Nama & Jabatan</th>
                        <th className="p-3">Wilayah</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {officers.map((officer) => (
                        <tr key={officer.id} className="border-b hover:bg-slate-50">
                          <td className="p-3">
                            <div className="font-bold">{officer.name}</div>
                            <div className="text-xs text-slate-500">{officer.position}</div>
                          </td>
                          <td className="p-3">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {officer.region.name}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <form action={async () => {
                              'use server'
                              await deleteOfficer(officer.id)
                            }}>
                              <Button variant="destructive" size="sm" className="h-7 text-xs">
                                Hapus
                              </Button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}