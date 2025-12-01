// src/app/dashboard/profile/page.tsx
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EditProfileForm } from "./edit-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function EditProfilePage() {
  const session = await getSession()
  if (!session || !session.userId) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.userId as string) },
    include: { profile: true }
  })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">← Kembali ke Dashboard</Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Lengkapi Profil Anda</CardTitle>
            <p className="text-sm text-slate-500">Data ini membantu teman seangkatan menemukan Anda.</p>
          </CardHeader>
          <CardContent>
            <EditProfileForm existingData={user?.profile || {}} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}