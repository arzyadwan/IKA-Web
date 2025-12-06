// src/app/admin/events/create/page.tsx
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { CreateEventForm } from "./create-form" // Kita buat di bawah

export default async function CreateEventPage() {
  const session = await getSession()
  if (!session || !['region_admin', 'super_admin'].includes(session.role)) redirect('/dashboard')

  const regions = await prisma.region.findMany()

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Buat Agenda Kegiatan Baru</h1>
        <CreateEventForm regions={regions} />
      </div>
    </div>
  )
}