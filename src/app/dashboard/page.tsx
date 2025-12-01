// src/app/dashboard/page.tsx
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logoutUser } from "@/actions/auth";
import Link from "next/link";

export default async function DashboardPage() {
  // 1. Cek Sesi Keamanan
  const session = await getSession();
  if (!session || !session.userId) {
    redirect("/register"); // Nanti kita ubah ke /login
  }

  // 2. Ambil Data User + Profil + Wilayah
  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.userId as string) },
    include: {
      profile: {
        include: {
          region: true, // Kita butuh nama wilayahnya
        },
      },
    },
  });

  // Jika data tidak ditemukan (aneh, tapi mungkin terjadi)
  if (!user || !user.profile) {
    return <div>Error: Data profil tidak ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Dashboard */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard Alumni
          </h1>
          <form action={logoutUser}>
            <Button variant="destructive" size="sm">
              Logout
            </Button>
          </form>
        </div>

        {/* Kartu Profil Utama */}
        <Card>
          <CardHeader className="bg-slate-900 text-white rounded-t-lg">
            <CardTitle>Kartu Tanda Anggota Digital</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-500">
                    Nama Lengkap
                  </label>
                  <p className="text-xl font-semibold">
                    {user.profile.fullName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">
                    Nomor WhatsApp
                  </label>
                  <p className="text-lg">{user.profile.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">
                    Angkatan
                  </label>
                  <p className="text-lg">{user.profile.graduationYear}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-500">
                    Wilayah Kepengurusan
                  </label>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mt-1">
                    {user.profile.region.name}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">
                    Status Verifikasi
                  </label>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                      user.verificationStatus === "verified"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user.verificationStatus === "verified"
                      ? "Terverifikasi"
                      : "Menunggu Verifikasi"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder Menu Fitur */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/dashboard/mutation">
            <Card className="hover:bg-slate-50 cursor-pointer transition h-full">
              <CardContent className="pt-6 text-center">
                <h3 className="font-semibold">Ajukan Mutasi</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pindah domisili wilayah
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/search">
            <Card className="hover:bg-slate-50 cursor-pointer transition">
              <CardContent className="pt-6 text-center">
                <h3 className="font-semibold">Cari Alumni</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Temukan teman lama
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/profile">
            <Card className="hover:bg-slate-50 cursor-pointer transition h-full">
              <CardContent className="pt-6 text-center">
                <h3 className="font-semibold">Update Profil</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Lengkapi data darurat
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
