import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { EditProfileForm } from "./edit-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserCircle } from "lucide-react"

export default async function EditProfilePage() {
  const session = await getSession()
  if (!session || !session.userId) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.userId as string) },
    include: { profile: true }
  })

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header Navigasi */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Profil</h1>
            <p className="text-slate-500 text-sm">Perbarui informasi biodata dan kontak Anda.</p>
          </div>
        </div>

        {/* Info Card Kecil */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">
            <UserCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 text-sm">Mengapa data ini penting?</h3>
            <p className="text-blue-700 text-xs mt-1 leading-relaxed">
              Data yang lengkap membantu Admin memverifikasi akun Anda lebih cepat. 
              Golongan darah dan profesi sangat berguna untuk jejaring & bantuan darurat sesama alumni.
            </p>
          </div>
        </div>

        {/* Panggil Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <EditProfileForm existingData={user?.profile || {}} />
          </div>
        </div>

      </div>
    </div>
  )
}