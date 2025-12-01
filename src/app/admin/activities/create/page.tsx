// src/app/admin/activities/create/page.tsx
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { CreateActivityForm } from "./create-form" // Import komponen baru

export default async function CreateActivityPage() {
  const session = await getSession()
  // Cek Admin
  if (!session || (session.role !== 'region_admin' && session.role !== 'super_admin')) {
    redirect('/dashboard')
  }

  // Ambil daftar wilayah
  const regions = await prisma.region.findMany({
    select: { id: true, name: true }
  })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Tulis Kabar / Kegiatan Baru</h1>
        
        {/* Panggil Client Component */}
        <CreateActivityForm regions={regions} />

      </div>
    </div>
  )
}