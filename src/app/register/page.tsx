// src/app/register/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import { RegisterForm } from "./register-form" // Import komponen yang baru kita buat

export default async function RegisterPage() {
  // Fetch data di server (cepat & aman)
  const regions = await prisma.region.findMany({
    select: { id: true, name: true, slug: true }
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-slate-800">
            Daftar IKA Al-Ikhlas
          </CardTitle>
          <p className="text-center text-sm text-slate-500">
            Bergabung dengan keluarga besar alumni
          </p>
        </CardHeader>
        <CardContent>
          {/* Panggil Client Component dan oper data regions */}
          <RegisterForm regions={regions} />
        </CardContent>
      </Card>
    </div>
  )
}